// start-stealth.js
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

function dateToString(timeStr) {
  let string = timeStr.toString();
  string = string.substring(0, string.length - 3);
  return string.replace('T', " ");
}

async function runAutomation({ id, pw, url, reserveTimeStr }) {
  const reserveTime = new Date(reserveTimeStr);
  const delay = reserveTime.getTime() - Date.now();
  console.log(`[INFO] 자동화 ${delay}ms 뒤에 시작`);

  setTimeout(async () => {
    console.log(`[INFO] ${dateToString(new Date())} - 자동화 시작`);

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    // 로그인
    await page.goto('https://ticket.interpark.com/Gate/TPLogin.asp', { waitUntil: 'domcontentloaded' });
    await page.type('#userId', id);
    await page.type('#userPwd', pw);
    await page.click('#btn_login');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // 예매 페이지 이동
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // 예매 버튼 클릭 (필요 시 수정)
    try {
      await page.waitForSelector('.btn_reserve', { timeout: 10000 });
      await page.click('.btn_reserve');
      console.log('[SUCCESS] 예매 버튼 클릭 완료');
    } catch (e) {
      console.log('[FAIL] 예매 버튼 찾을 수 없음');
    }

  }, delay);
}

module.exports = runAutomation;
