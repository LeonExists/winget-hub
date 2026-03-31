const { app, BrowserWindow } = require('electron')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundMaterial: 'acrylic',
    autoHideMenuBar: true,
    webPreferences: {
      preload: __dirname + '/preload.js',
    }
  })
  win.loadFile('renderer/index.html')
}

app.whenReady().then(createWindow)