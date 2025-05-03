const puppeteer = require('puppeteer');

let browser, page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  page = await browser.newPage();
  await page.goto('https://magento.softwaretestingboard.com', { waitUntil: 'networkidle2' });
}, 30000);

afterAll(async () => {
  await browser.close();
});

describe('Magento UI Interaction Tests', () => {

  test('1. Hover over "Men" menu shows submenu', async () => {
    await page.waitForSelector('#ui-id-5', { visible: true }); // Men
    await page.hover('#ui-id-5');
    await page.waitForSelector('#ui-id-17', { visible: true }); // Tops
    const submenuVisible = await page.$eval('#ui-id-17', el => !!el.offsetParent);
    expect(submenuVisible).toBe(true);
  }, 10000);

  test('2. Clicking "Sign In" opens login form', async () => {
    await page.goto('https://magento.softwaretestingboard.com', { waitUntil: 'networkidle2' });
    await page.click('a[href*="customer/account/login"]');
    await page.waitForSelector('#email', { visible: true });
    const emailFieldVisible = await page.$eval('#email', el => !!el.offsetParent);
    expect(emailFieldVisible).toBe(true);
  }, 10000);

  test('3. Clicking "Create an Account" opens registration page', async () => {
    await page.goto('https://magento.softwaretestingboard.com', { waitUntil: 'networkidle2' });
    await page.click('a[href*="customer/account/create"]');
    await page.waitForSelector('#firstname', { visible: true });
    const fieldVisible = await page.$eval('#firstname', el => !!el.offsetParent);
    expect(fieldVisible).toBe(true);
  }, 10000);

  test('4. Navigating to Jackets category via hover and click', async () => {
    await page.goto('https://magento.softwaretestingboard.com', { waitUntil: 'domcontentloaded' });
  
    await page.waitForSelector('#ui-id-5', { visible: true }); // Men
    await page.hover('#ui-id-5');
  
    await page.waitForSelector('#ui-id-17', { visible: true }); // Tops
    await page.hover('#ui-id-17');
  
    await page.waitForSelector('#ui-id-19', { visible: true }); // Jackets
    await page.click('#ui-id-19');
  
    // замість networkidle2 — просто очікуємо появу заголовка
    await page.waitForSelector('.page-title span', { visible: true });
    const title = await page.$eval('.page-title span', el => el.textContent.trim().toLowerCase());
    expect(title).toContain('jackets');
  }, 30000);
  
  

  test('5. Search for "hoodie" using search bar', async () => {
    await page.goto('https://magento.softwaretestingboard.com', { waitUntil: 'networkidle2' });
  
    await page.waitForSelector('#search', { visible: true });
    await page.type('#search', 'hoodie');
    await page.keyboard.press('Enter'); // ← кращий спосіб для цього сайту
  
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
  
    const titleText = await page.$eval('.page-title span', el => el.textContent.trim().toLowerCase());
    expect(titleText).toContain('search results');
  }, 30000);  

});
