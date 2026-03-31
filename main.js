const path = require('node:path')
const { app, BrowserWindow, ipcMain } = require('electron')
const { execFile } = require('node:child_process')


function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundMaterial: 'acrylic',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  win.loadFile('renderer/index.html')
  win.webContents.openDevTools()
}


function runPowerShell(command) {
  return new Promise((resolve, reject) => {
    execFile(
      'powershell.exe',
      [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy', 'Bypass',
        '-Command',
        `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; ${command}`,
      ],
      {
        maxBuffer: 20 * 1024 * 1024,
        encoding: 'utf8',
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message))
          return
        }
        resolve(stdout)
      }
    )
  })
}


function parseWingetTable(output) {
  const lines = output
    .split(/\r?\n/)
    .map(line => line.replace(/\r/g, ''))
    .filter(line => line.trim().length > 0)

  if (lines.length < 3) {
    throw new Error(`Unexpected winget output:\n${output}`)
  }

  const header = lines[0]
  const rows = lines.slice(2)

  const idStart = header.indexOf('Id')
  const versionStart = header.indexOf('Version')
  const availableStart = header.indexOf('Available')

  if (idStart === -1 || versionStart === -1) {
    throw new Error(`Could not detect winget columns:\n${output}`)
  }

  return rows.map(line => {
    const name = line.slice(0, idStart).trim()

    const id = versionStart >= 0
      ? line.slice(idStart, versionStart).trim()
      : line.slice(idStart).trim()

    const version = availableStart >= 0
      ? line.slice(versionStart, availableStart).trim()
      : line.slice(versionStart).trim()

    const available = availableStart >= 0
      ? (line.slice(availableStart).trim() || null)
      : null

    return {
      Name: name,
      Id: id,
      Version: version,
      Available: available,
    }
  }).filter(app => app.Name || app.Id)
}


ipcMain.handle('winget:list', async () => {
  const output = await runPowerShell('winget list --source winget --accept-source-agreements')

  console.log('RAW WINGET OUTPUT:\n', output)

  const apps = parseWingetTable(output)

  console.log(`Parsed ${apps.length} apps`)
  return apps
})

ipcMain.handle('winget:update', async (_event, appId) => {
  return `Updated ${appId}`
})

ipcMain.handle('winget:uninstall', async (_event, appId) => {
  return `Uninstalled ${appId}`
})


app.whenReady().then(createWindow)