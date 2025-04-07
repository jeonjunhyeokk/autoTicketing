const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './js/preload.js'), 
    },
  });

  mainWindow.webContents.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  mainWindow.loadURL('https://ticket.interpark.com/Gate/TPLogin.asp');
}

app.whenReady().then(() => {
  createWindow();
});

// 자동화 요청 수신
ipcMain.on('start-automation', async (event, formData) => {
  const { consertId, numberPerson, day } = formData;

  const reserveTime = new Date();
  reserveTime.setSeconds(reserveTime.getSeconds() + 5); // 5초 뒤 실행

  setTimeout(async () => {
    console.log('[INFO] 자동화 시작');

    // 1. 콘서트 페이지로 이동
    await mainWindow.webContents.executeJavaScript(`
      location.href = "https://tickets.interpark.com/goods/${consertId}";
    `);

    // 2. 페이지 로드 기다린 후 자동화 실행
    mainWindow.webContents.once('did-finish-load', async () => {
      await mainWindow.webContents.executeJavaScript(`
        (async () => {
          const sleep = ms => new Promise(r => setTimeout(r, ms));
          console.log("[자동화] 관람일/좌석 선택 시작");

          // 팝업 닫기
          const closeBtn = document.querySelector('#popup-prdGuide > div > div.popupFooter > button');
          if (closeBtn) closeBtn.click();

          await sleep(500);

          // 날짜 선택
          const mutedDays = document.querySelectorAll('.muted').length;
          const dayIndex = mutedDays + ${Number(day)};
          const dayBtn = document.querySelector(\`#productSide ul:nth-child(3) li:nth-child(\${dayIndex})\`);
          if (dayBtn) dayBtn.click();

          await sleep(300);

          // 예매 버튼 클릭
          const reserveBtn = document.querySelector('.sideBtn.is-primary');
          if (reserveBtn) reserveBtn.click();
        })();
      `);
    });
  }, reserveTime.getTime() - Date.now());
});
