const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 3500 });
  
  console.log("Navigating to home page...");
  await page.goto('http://localhost:8080/');
  
  console.log("Waiting for animations and queries to load...");
  await page.waitForTimeout(4000);
  
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'C:/Users/mo0od/.gemini/antigravity/brain/19a4a700-3d92-481b-bb79-fc8495bb8b16/.user_uploaded/home-screenshot.png', fullPage: true });
  
  console.log("Done!");
  await browser.close();
})();
