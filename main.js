const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 850,
    minWidth: 500,
    minHeight: 750,
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'assets/icons/icon.png'),
    title: '2048 - Matrix Terminal'
  });

  mainWindow.loadFile('index.html');
  
  // Remove menu bar for cleaner look
  mainWindow.setMenuBarVisibility(false);
  
  // Open DevTools for debugging (optional - comment out for production)
  // mainWindow.webContents.openDevTools();
}

// Handle IPC message to open DevTools
ipcMain.on('open-devtools', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.openDevTools();
    console.log('DevTools opened via IPC');
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
