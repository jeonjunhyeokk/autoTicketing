// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const runAutomation = require('./start-stealth.js');

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, 'function.js'), // 여기에 ipcRenderer 있는 경우
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
});

// 👇 HTML에서 입력받은 값 처리
ipcMain.on('start-automation', (event, formData) => {
  console.log('[ELECTRON] 받은 값:', formData);
  runAutomation(formData);
});
