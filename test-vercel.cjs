const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  // Navigate to local dev server auth
  console.log('Navigating to local auth...');
  await page.goto('https://mohammad-haroon.vercel.app/auth', { waitUntil: 'networkidle' });
  
  // Fill auth forms. Wait, I don't have the password, but the error happens even without logging in if the page tries to load data?
  // No, the route has `beforeLoad: async () => { await supabase.auth.getUser() ... if (!user) throw redirect({to: "/auth"}) }`.
  // So it redirects to /auth. We need a valid session to even hit the server function.
  // Can we bypass this locally by injecting a mock token? No, Supabase validates it on the server.
  
  console.log('Current URL:', page.url());
  
  await browser.close();
})();
