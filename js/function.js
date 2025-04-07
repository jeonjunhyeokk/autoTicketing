const log = require('./log.js');

async function startTicketing(consertId, numberPerson, day, userId, pw, log, error, existingPage = null) {
    let page;

    // ✅ Electron 창에서 전달된 page 객체 사용
    if (existingPage) {
        page = existingPage;
        log("기존 로그인된 페이지 사용 중...");
    } else {
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--disable-web-security', '--disable-features=IsolateOrigins', '--disable-site-isolation-trials']
        });
        page = await browser.newPage();
        await page.goto('https://ticket.interpark.com/Gate/TPLogin.asp');

        // 로그인 자동입력은 생략 (사람이 직접 함)
    }

    await page.setViewport({ width: 1080, height: 1024 });

    // 🎫 예매 페이지 이동
    const consertUrl = 'https://tickets.interpark.com/goods/' + consertId;
    await page.goto(consertUrl);
    log.addLog("예매 페이지로 이동 완료");

    // 📌 팝업 닫기
    const popupCloseBut = '#popup-prdGuide > div > div.popupFooter > button';
    const closeButElement = await page.$(popupCloseBut);
    if (closeButElement != null) {
        await page.click(popupCloseBut);
        log.addLog("팝업 닫기 완료");
    }

    // 🎟️ 날짜 선택
    const ticketSelector = '.stickyWrap';
    await page.waitForSelector(ticketSelector);

    let mutedDayLength = (await page.$$('.muted')).length;
    let dayCalculate = mutedDayLength + Number(day);

    const daySelector = `#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(3) > li:nth-child(${dayCalculate})`;
    await page.waitForSelector(daySelector);
    await page.click(daySelector);
    log.addLog("공연 관람일 클릭 완료");

    // 🎫 예매 버튼 클릭
    const buttonSelector = '#productSide > div > div.sideBtnWrap > a.sideBtn.is-primary';
    await page.click(buttonSelector);
    log.addLog("예매하기 버튼 클릭");

    const newPagePromise = new Promise(x => page.once('popup', x));
    const popupPage = await newPagePromise;
    await popupPage.setViewport({ width: 1080, height: 1024 });
    page = popupPage;

    // 🎯 좌석 창 진입
    await page.waitForSelector('#divBookSeat');
    let iframeWindow = await page.$('iframe[id="ifrmSeat"]');
    let frame = await iframeWindow.contentFrame();

    // ⛔ 캡차 접기
    try {
        await frame.waitForSelector('#divCaptchaFolding > a', { timeout: 5000 });
        await frame.click('#divCaptchaFolding > a');
        log.addLog("캡차 접기 클릭 완료");
    } catch (e) {
        log.addLog("캡차 접기 없음 또는 실패 - 무시하고 진행");
    }

    // 🎟️ 좌석 선택
    await frame.waitForSelector('#ifrmSeatDetail');
    iframeWindow = await frame.$('iframe[id="ifrmSeatDetail"]');
    const detailFrame = await iframeWindow.contentFrame();

    await detailFrame.waitForSelector('#divSeatBox');
    const seatArr = await detailFrame.$$('span[class="SeatN"]');

    for (let index = 0; index < numberPerson; index++) {
        if (index >= seatArr.length) {
            error(`잔여좌석 ${seatArr.length}개로 ${numberPerson - seatArr.length}개 좌석 부족`);
            break;
        }
        await seatArr[index].click();
        log.addLog(`좌석 ${index + 1} 선택 완료`);
    }

    // ✅ 좌석 선택 완료
    await frame.click('body > form:nth-child(2) > div > div.contWrap > div.seatR > div > div.btnWrap > a');
    log.addLog("좌석 선택 완료 → 다음 단계로 이동");

    await sleep(50000); // 결제 수기 입력을 위한 대기

    return true;
}

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

module.exports = startTicketing;
