const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');
const path = require('path');
const startTicketing = require('./function.js');

puppeteer.use(StealthPlugin());

async function runAutomation(formData, log = console.log, error = console.error) {
  const { consertId, numberPerson, day, reserveTimeStr } = formData;
  const reserveTime = new Date(reserveTimeStr);
  const delay = reserveTime.getTime() - Date.now();

  log(`예약 시간까지 ${delay}ms 대기 중...`);

  setTimeout(async () => {
    try {
      log("Puppeteer 실행 중...");

      const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-web-security'],
        defaultViewport: { width: 1280, height: 1024 },
      });

      const page = await browser.newPage();

      // ✅ 쿠키 로딩
      const cookiesPath = path.join(__dirname, '../cookies.json');
      if (fs.existsSync(cookiesPath)) {
        const cookies = JSON.parse(fs.readFileSync(cookiesPath));
        await page.setCookie(...cookies);
        log("쿠키 로딩 완료");
      } else {
        error("cookies.json이 없습니다. 로그인 후 쿠키를 먼저 저장해주세요.");
        return;
      }

      // 예매 페이지로 이동 후 자동화
      log("예매 페이지로 이동...");
      await startTicketing(consertId, Number(numberPerson), Number(day), null, null, log, error, page);
    } catch (err) {
      error("자동화 중 에러 발생: " + err.message);
    }
  }, delay);
}

module.exports = runAutomation;
