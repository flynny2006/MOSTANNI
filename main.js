const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

const SESSION_FILE = path.join(__dirname, 'sessions.json');

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true
    },
    title: "Boongle Browser"
  });

  win.loadFile('index.html');

  win.on('close', () => {
    win.webContents.send('save-session');
  });
}

app.whenReady().then(() => {
  createWindow();
});
