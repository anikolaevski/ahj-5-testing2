import puppetteer from 'puppeteer';

const childProcess = require('child_process');

let server = null;

jest.setTimeout(30000); // default puppeteer timeout
describe('INN/OGRN form', () => {
  let browser = null;
  let page = null;
  const baseUrl = 'http://localhost:9000';
  beforeAll(async () => {
    server = await childProcess.fork(`${__dirname}/test-server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', () => {
        reject();
      });
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      // Опции в методе launch нужно закомментировать при запуске в CI.
      // headless: false, // show gui
      // slowMo: 100,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });
  afterAll(async () => {
    await browser.close();
    server.kill();
  });
  // test code here
  // test start
  describe('Check credit card form -- valid', () => {
    test('should add .valid class for valid card number', async () => {
      await page.goto(baseUrl);
      const form = await page.$('#enterform');
      const input = await form.$('#entercard');
      await input.type('5084840100137725');
      const submit = await form.$('#enterbutton');
      submit.click();
      // expect(await form.$('#entercardState').innerText).toBe('проверено');
      await page.waitForSelector('#entercard.valid');
    });
  });
  describe('Check credit card form -- invalid', () => {
    test('should add .invalid class for invalid card number', async () => {
      await page.goto(baseUrl);
      const form = await page.$('#enterform');
      const input = await form.$('#entercard');
      await input.type('5084840100137726');
      const submit = await form.$('#enterbutton');
      submit.click();
      await page.waitForSelector('#entercard.invalid');
    });
  });
  describe('Check for card type detection', () => {
    test('should add .selectedcardtype class after 1st two digits', async () => {
      await page.goto(baseUrl);
      const form = await page.$('#enterform');
      const input = await form.$('#entercard');
      await input.type('50');
      // const submit = await form.$('#enterbutton');
      await page.waitForSelector('.sn-icon.selectedcardtype');
    });
  });
  // test end
});
