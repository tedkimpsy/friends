// main.js

const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
  // 메인 윈도우 생성
  mainWindow = new BrowserWindow({ width: 1024, height: 800 });

  // 웹 페이지 로드
  mainWindow.loadFile('index.html');
});
