const { app, BrowserWindow, ipcMain } = require('electron')

let mainWindow = null
const ipc = ipcMain

app.whenReady().then(() => {
    // We cannot require the screen module until the app is ready. 
    const { screen } = require('electron')

    // Create a window that fills the screen's available work area. 
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize

    mainWindow = new BrowserWindow({
        x: width - 30,
        y: (height / 2) - (100 / 2),
        width: 30,
        height: 100,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    })
    mainWindow.loadFile('index.html')
    //open dev tools in a new window 
    // mainWindow.webContents.openDevTools({ mode: 'detach' })

    telegramWindow = new BrowserWindow({
        x: width - 420 - 34 - 10,
        y: (height / 2) - (720 / 2),
        width: 420,
        height: 720,
        frame: false,
        show: false,
    })
    telegramWindow.loadURL('https://web.telegram.org/k')
    telegramWindow.setAlwaysOnTop(true, 'dock')

    // telegramWindow alway on top of layerWindow
    telegramWindow.on('focus', () => {
        telegramWindow.setAlwaysOnTop(true, 'dock')
    })

    
    layerWindow = new BrowserWindow({
        x: 0,
        y: 0,
        width: width,
        height: height,
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        fullscreen: true,
    })
    layerWindow.loadFile('closeLayer.html')
    layerWindow.setOpacity(0.8)
    
    // make telegram remember the login 
    telegramWindow.webContents.on('did-finish-load', () => {
        telegramWindow.webContents.executeJavaScript(`
            localStorage.setItem('remember', 'true')
        `)
    })
})



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

ipc.on('show-hide-telegram', () => {
    if (telegramWindow.isVisible()) {
        telegramWindow.hide()
        layerWindow.hide()
    } else {
        telegramWindow.show()
        layerWindow.show()
    }
})

