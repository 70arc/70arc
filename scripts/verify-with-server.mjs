import { spawn, execSync } from "child_process";
import { existsSync } from "fs";
import net from "net";

const PORT_START = Number(process.env.VERIFY_PORT_START || 3010);
const PORT_END = Number(process.env.VERIFY_PORT_END || 3029);

function isPortFree(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once("error", () => resolve(false));
    tester.once("listening", () => {
      tester.close(() => resolve(true));
    });
    tester.listen(port);
  });
}

function getEphemeralPort() {
  return new Promise((resolve, reject) => {
    const tester = net.createServer();
    tester.once("error", reject);
    tester.once("listening", () => {
      const address = tester.address();
      const port = typeof address === "object" && address ? address.port : null;
      tester.close(() => {
        if (port) resolve(port);
        else reject(new Error("Could not allocate ephemeral port"));
      });
    });
    tester.listen(0);
  });
}

async function findAvailablePort(start, end) {
  for (let port = start; port <= end; port += 1) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free port found between ${start} and ${end}`);
}

async function resolvePort() {
  if (process.env.VERIFY_PORT) {
    const port = Number(process.env.VERIFY_PORT);
    if (!(await isPortFree(port))) {
      throw new Error(
        `VERIFY_PORT ${port} is already in use. Stop the existing process or unset VERIFY_PORT.`
      );
    }
    return port;
  }

  try {
    return await getEphemeralPort();
  } catch {
    console.warn("Ephemeral port allocation failed, scanning fallback range...");
    return findAvailablePort(PORT_START, PORT_END);
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

async function waitForServer(url, attempts = 45) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Server did not become ready at ${url}`);
}

function killProcessTree(child) {
  return new Promise((resolve) => {
    if (!child?.pid) {
      resolve();
      return;
    }

    const done = () => resolve();
    child.once("exit", done);

    try {
      if (process.platform === "win32") {
        execSync(`taskkill /PID ${child.pid} /T /F`, { stdio: "ignore" });
      } else {
        child.kill("SIGTERM");
      }
    } catch {
      try {
        child.kill("SIGKILL");
      } catch {
        // already gone
      }
    }

    setTimeout(done, 3000);
  });
}

function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = spawn("npx", ["next", "start", "-p", String(port)], {
      stdio: "inherit",
      shell: process.platform === "win32",
      env: { ...process.env, PORT: String(port) },
    });

    let settled = false;

    const fail = (error) => {
      if (settled) return;
      settled = true;
      killProcessTree(server).finally(() => reject(error));
    };

    const succeed = () => {
      if (settled) return;
      settled = true;
      resolve(server);
    };

    server.on("error", fail);
    server.on("exit", (code) => {
      if (!settled && code !== 0) {
        fail(new Error(`next start exited with code ${code} on port ${port}`));
      }
    });

    // Brief pause so the port bind wins any race with the pre-flight check
    setTimeout(() => {
      waitForServer(`http://127.0.0.1:${port}/`, 45).then(succeed).catch(fail);
    }, 250);
  });
}

async function runVerifySite(baseUrl) {
  await run("node", ["scripts/verify-site.mjs"], {
    env: { ...process.env, BASE_URL: baseUrl },
  });
}

async function main() {
  if (process.env.BASE_URL) {
    const baseUrl = process.env.BASE_URL.replace(/\/$/, "");
    console.log(`BASE_URL set — verifying existing server at ${baseUrl}`);
    try {
      const response = await fetch(`${baseUrl}/`, { signal: AbortSignal.timeout(5000) });
      if (!response.ok) {
        throw new Error(`Server at ${baseUrl} returned status ${response.status}`);
      }
      await runVerifySite(baseUrl);
      process.exit(0);
    } catch (error) {
      console.error(error);
      console.error(
        "Could not verify server at BASE_URL. Start one with `npm run start` or run plain `npm run verify`."
      );
      process.exit(1);
    }
    return;
  }

  if (process.env.SKIP_BUILD !== "1" && !existsSync(".next/BUILD_ID")) {
    console.log("No production build found. Running npm run build...");
    await run("npm", ["run", "build"]);
  } else if (process.env.SKIP_BUILD !== "1") {
    console.log("Using existing production build (.next/BUILD_ID found).");
  }

  let activePort = await resolvePort();
  console.log(`Starting verification server on port ${activePort}...`);

  let server;
  try {
    server = await startServer(activePort);
  } catch (error) {
    if (process.env.VERIFY_PORT) throw error;

    console.warn(`Port ${activePort} failed (${error.message}). Retrying with a new port...`);
    activePort = await getEphemeralPort();
    console.log(`Retrying on port ${activePort}...`);
    server = await startServer(activePort);
  }

  console.log(`Verification server ready at http://localhost:${activePort}`);

  let shuttingDown = false;

  const shutdown = async (exitCode) => {
    if (shuttingDown) return;
    shuttingDown = true;
    await killProcessTree(server);
    process.exit(exitCode);
  };

  process.on("SIGINT", () => shutdown(1));
  process.on("SIGTERM", () => shutdown(1));

  try {
    await runVerifySite(`http://localhost:${activePort}`);
    await shutdown(0);
  } catch (error) {
    console.error(error);
    await shutdown(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});