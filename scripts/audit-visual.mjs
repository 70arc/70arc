import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3010";
const ROUTES = ["/", "/about", "/careers", "/contact", "/privacy", "/terms"];
const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "desktop", width: 1440, height: 900 },
];

async function waitForServer() {
  for (let i = 0; i < 40; i += 1) {
    try {
      const res = await fetch(`${BASE_URL}/`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server not ready at ${BASE_URL}`);
}

async function main() {
  await waitForServer();
  mkdirSync("terminals/screenshots", { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const findings = [];
  const consoleErrors = [];

  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  for (const viewport of VIEWPORTS) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of ROUTES) {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(400);
      await page.evaluate(() => localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true })));
      await page.reload({ waitUntil: "networkidle" });
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(() => {
        const body = getComputedStyle(document.body);
        const h1 = document.querySelector("h1");
        const h2 = document.querySelector("h2");
        const clipped = [];
        document.querySelectorAll("h1, h2, p, a, button").forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width < 2 || rect.height < 2) return;
          if (rect.right > document.documentElement.clientWidth + 2) {
            clipped.push(el.textContent?.trim().slice(0, 40) || el.tagName);
          }
        });
        return {
          bodyFont: body.fontFamily,
          h1Font: h1 ? getComputedStyle(h1).fontFamily : null,
          h2Font: h2 ? getComputedStyle(h2).fontFamily : null,
          h1Size: h1 ? getComputedStyle(h1).fontSize : null,
          clipped,
        };
      });

      const shot = `terminals/screenshots/${viewport.name}${route.replaceAll("/", "_") || "_home"}.png`;
      await page.screenshot({ path: shot, fullPage: true });
      findings.push({ route, viewport: viewport.name, ...metrics, shot });
    }
  }

  // Interactions at mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("cookie-consent", JSON.stringify({ necessary: true })));
  await page.reload({ waitUntil: "networkidle" });

  await page.locator('button[aria-label="Open menu"]').click();
  const menuOpen = await page.locator("#mobile-navigation").isVisible();
  await page.locator('#mobile-navigation a[href="/about"]').click();
  await page.waitForTimeout(500);
  const landedAbout = page.url().includes("/about");

  await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /send transmission/i }).click();
  const nameError = await page.getByText("Name is required").isVisible();
  await page.getByLabel(/^Name/).fill("Ada Lovelace");
  await page.locator("#email").fill("ada@70arc.com");
  await page.getByLabel(/^Message/).fill("I would like to deploy a new model cluster.");
  await page.getByRole("button", { name: /send transmission/i }).click();
  await page.waitForTimeout(1200);
  const success = await page.getByText("Transmission Received").isVisible();

  await page.goto(`${BASE_URL}/careers`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Apply Now" }).first().click();
  await page.waitForTimeout(600);
  const applyPrefill = await page.locator("#message").inputValue();

  await page.goto(`${BASE_URL}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /What modalities/i }).click();
  const faqOpen = await page.getByText(/unified multimodal architecture/i).isVisible();

  await page.getByRole("button", { name: /Switch to dark mode/i }).click();
  const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));

  console.log(JSON.stringify({
    findings,
    interactions: { menuOpen, landedAbout, nameError, success, applyPrefill, faqOpen, isDark },
    consoleErrors: [...new Set(consoleErrors)],
  }, null, 2));

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
