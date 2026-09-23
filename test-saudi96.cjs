const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Mobile screenshot
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  console.log("Navigating to saudi96 (mobile)...");
  await mobilePage.goto('http://localhost:8080/saudi96', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(2000);
  await mobilePage.screenshot({
    path: 'C:/Users/mo0od/.gemini/antigravity/brain/2b2342fe-1ff2-4022-b549-bc24908214bd/saudi96-mobile-redesign-v2.png',
    fullPage: true,
  });
  console.log("Mobile screenshot saved!");

  // Desktop screenshot
  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  console.log("Navigating to saudi96 (desktop)...");
  await desktopPage.goto('http://localhost:8080/saudi96', { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(2000);
  await desktopPage.screenshot({
    path: 'C:/Users/mo0od/.gemini/antigravity/brain/2b2342fe-1ff2-4022-b549-bc24908214bd/saudi96-desktop-redesign-v2.png',
    fullPage: true,
  });
  console.log("Desktop screenshot saved!");

  await browser.close();
  console.log("All screenshots completed successfully!");
})();
