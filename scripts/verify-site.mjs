import { chromium } from "@playwright/test";
import { writeFileSync } from "fs";

const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x640", width: 360, height: 640 },
  { name: "375x812", width: 375, height: 812 },
  { name: "390x844", width: 390, height: 844 },
  { name: "414x896", width: 414, height: 896 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "820x1180", width: 820, height: 1180 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1280x720", width: 1280, height: 720 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1536x864", width: 1536, height: 864 },
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "2560x1440", width: 2560, height: 1440 },
];

const ROUTES = ["/", "/about", "/careers", "/contact", "/privacy", "/terms"];
const CANDIDATE_PORTS = [3000, 3001, 3002];

async function resolveBaseUrl() {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, "");
  }

  for (const port of CANDIDATE_PORTS) {
    const candidate = `http://localhost:${port}`;
    try {
      const response = await fetch(`${candidate}/`, {
        signal: AbortSignal.timeout(5000),
      });
      if (response.ok) {
        console.log(`Using server at ${candidate}`);
        return candidate;
      }
    } catch {
      // Try next port
    }
  }

  throw new Error(
    "No running Next.js server found on ports 3000-3002.\n" +
      "Run `npm run verify` (starts its own server) or `npm run build && npm run start` first.\n" +
      "You can also set BASE_URL explicitly for `npm run verify:quick`."
  );
}

async function checkOverflow(page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const hasHorizontalOverflow =
      doc.scrollWidth > doc.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;

    const vw = doc.clientWidth;
    const overflowing = [];
    const isClippedByAncestor = (el) => {
      let current = el.parentElement;
      while (current && current !== document.body) {
        const ancestorStyle = getComputedStyle(current);
        if (["hidden", "clip", "auto", "scroll"].includes(ancestorStyle.overflowX)) return true;
        if (["hidden", "clip"].includes(ancestorStyle.overflow)) return true;
        current = current.parentElement;
      }
      return false;
    };

    document.querySelectorAll("body *").forEach((node) => {
      if (!(node instanceof HTMLElement)) return;
      const style = getComputedStyle(node);
      if (style.position === "fixed" || style.position === "sticky") return;
      if (["hidden", "clip"].includes(style.overflowX) || ["hidden", "clip"].includes(style.overflow)) return;
      if (style.overflowX === "auto" || style.overflowX === "scroll") return;
      if (isClippedByAncestor(node)) return;
      const rect = node.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      if (rect.right > vw + 2) {
        overflowing.push(`${node.tagName.toLowerCase()}.${String(node.className).slice(0, 60)}`);
      }
    });

    const bodyFont = getComputedStyle(body).fontFamily;
    const headingFonts = [...new Set(
      [...document.querySelectorAll("h1, h2, h3")].map((el) => getComputedStyle(el).fontFamily)
    )];

    return {
      hasHorizontalOverflow,
      scrollWidth: Math.max(doc.scrollWidth, body.scrollWidth),
      clientWidth: doc.clientWidth,
      overflowingElements: overflowing.slice(0, 6),
      bodyFont,
      headingFonts,
    };
  });
}

async function collectA11yIssues(page) {
  return page.evaluate(() => {
    const issues = [];

    document.querySelectorAll("img:not([alt])").forEach((img) => {
      issues.push(`Missing alt: ${img.getAttribute("src") || "inline image"}`);
    });

    document.querySelectorAll("button").forEach((button) => {
      const label =
        button.getAttribute("aria-label") ||
        button.textContent?.trim() ||
        button.querySelector("svg[aria-label]")?.getAttribute("aria-label");
      if (!label) {
        issues.push("Empty button without accessible name");
      }
    });

    document.querySelectorAll("a").forEach((link) => {
      const label = link.getAttribute("aria-label") || link.textContent?.trim();
      if (!label) {
        issues.push(`Link without name: ${link.getAttribute("href")}`);
      }
    });

    document.querySelectorAll("input, textarea, select").forEach((field) => {
      const id = field.getAttribute("id");
      const hasLabel =
        (id && document.querySelector(`label[for="${id}"]`)) ||
        field.getAttribute("aria-label") ||
        field.getAttribute("aria-labelledby");
      if (!hasLabel && field.getAttribute("type") !== "hidden") {
        issues.push(`Field without label: ${field.getAttribute("name") || field.getAttribute("id") || "unknown"}`);
      }
    });

    return issues;
  });
}

async function main() {
  const BASE_URL = await resolveBaseUrl();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const networkFailures = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      const text = msg.text();
      if (text.includes("ERR_CERT_AUTHORITY_INVALID")) return;
      consoleErrors.push(text);
    }
  });

  page.on("pageerror", (error) => {
    consoleErrors.push(error.message);
  });

  page.on("response", (response) => {
    const url = response.url();
    if (response.status() >= 400 && url.startsWith(BASE_URL)) {
      networkFailures.push(`${response.status()} ${url}`);
    }
  });

  const results = [];

  for (const route of ROUTES) {
    const response = await page.goto(`${BASE_URL}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    if (!response || !response.ok()) {
      throw new Error(`Failed to load ${BASE_URL}${route} (status: ${response?.status() ?? "no response"})`);
    }

    await page.waitForTimeout(800);

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(250);

      const overflow = await checkOverflow(page);
      const a11yIssues = await collectA11yIssues(page);

      const hasElementOverflow = (overflow.overflowingElements || []).length > 0;
      results.push({
        route,
        viewport: viewport.name,
        overflow,
        a11yIssueCount: a11yIssues.length,
        a11yIssues: a11yIssues.slice(0, 5),
        pass: !overflow.hasHorizontalOverflow && !hasElementOverflow && a11yIssues.length === 0,
      });
    }
  }

  // Interaction checks on homepage mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true })));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(500);

  const menuButton = page.locator('button[aria-label="Open menu"]');
  await menuButton.waitFor({ state: "visible", timeout: 15000 });
  await menuButton.click();
  const mobileNav = page.locator("#mobile-navigation");
  const menuOpens = await mobileNav.isVisible();

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const menuClosesOnEscape = !(await mobileNav.isVisible());

  const report = {
    baseUrl: BASE_URL,
    timestamp: new Date().toISOString(),
    viewportResults: results,
    summary: {
      totalChecks: results.length,
      passedChecks: results.filter((r) => r.pass).length,
      overflowFailures: results.filter((r) => r.overflow.hasHorizontalOverflow || (r.overflow.overflowingElements || []).length > 0).length,
      a11yFailures: results.filter((r) => r.a11yIssueCount > 0).length,
      uniqueConsoleErrors: [...new Set(consoleErrors)],
      uniqueNetworkFailures: [...new Set(networkFailures)],
      mobileMenuOpens: menuOpens,
      mobileMenuClosesOnEscape: menuClosesOnEscape,
    },
  };

  writeFileSync("verification-report.json", JSON.stringify(report, null, 2));

  console.log(JSON.stringify(report.summary, null, 2));

  const success =
    report.summary.overflowFailures === 0 &&
    report.summary.uniqueConsoleErrors.length === 0 &&
    report.summary.uniqueNetworkFailures.length === 0 &&
    report.summary.mobileMenuOpens &&
    report.summary.mobileMenuClosesOnEscape;

  await browser.close();
  process.exit(success ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});