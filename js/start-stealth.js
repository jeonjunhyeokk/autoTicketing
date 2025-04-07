// start.js + start-stealth.js 통합 버전

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

// 원하는 시작 시간 (예: 2025년 4월 8일 10시 59분 59초)
const startTime = new Date(2025, 3, 8, 10, 59, 59); // 주의: 4월은 '3'로 표시 (0부터 시작)
const now = new Date();

const delay = startTime.getTime() - now.getTime();

console.log(`[INFO] 티켓팅 시작까지 남은 시간(ms): ${delay}`);

function dateToString(timeStr) {
  let string = timeStr.toString();
  string = string.substring(0, string.length - 3);
  return string.replace('T', " ");
}

setTimeout(async () => {
  console.log(`[INFO] ${dateToString(new Date())} - 자동화 시작`);

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  );

  // 예시: 인터파크 로그인 페이지 이동
  await page.goto('https://ticket.interpark.com/Gate/TPLogin.asp', {
    waitUntil: 'domcontentloaded',
  });

  // 이후 예매 자동화 작업 삽입...

}, delay);
