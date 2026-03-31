const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('winget', {
  // Fetch all installed apps
  listApps: () => ipcRenderer.invoke('winget:list'),

  // Update a specific app by ID
  updateApp: (appId) => ipcRenderer.invoke('winget:update', appId),

  // Uninstall a specific app by ID
  uninstallApp: (appId) => ipcRenderer.invoke('winget:uninstall', appId),
})


