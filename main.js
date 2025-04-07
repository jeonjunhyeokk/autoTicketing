const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const runAutomation = require('./js/start-stealth');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'function.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL('https://ticket.interpark.com/Gate/TPLogin.asp');
}

app.whenReady().then(() => {
  createWindow();
});

//  로그인 후 "Let's go" 클릭 시 자동화 시작
ipcMain.on('start-automation', async (event, formData) => {
    const log = (msg) => {
      mainWindow.webContents.send('log-msg', `[INFO] ${msg}`);
    };
    const error = (msg) => {
      mainWindow.webContents.send('log-msg', `[ERROR] ${msg}`);
    };
  
    const pages = await mainWindow.webContents.session.getAllCookies(); // 참고용
    const allPages = await mainWindow.webContents.executeJavaScript('window.open("", "_blank")'); // X (중복 방지)
  
    const page = mainWindow.webContents; // 현재 창 그대로 전달
    runAutomation(formData, page, log, error); // ✅ 페이지 전달
  });
