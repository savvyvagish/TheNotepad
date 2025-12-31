const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");

app.setName("TheNotepad");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: "TheNotepad",
    frame: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile("index.html");
}

ipcMain.handle("save-file", async (event, content) => {
  const { filePath } = await dialog.showSaveDialog({
    defaultPath: "note.txt"
  });

  if (filePath) {
    fs.writeFileSync(filePath, content);
  }
});

ipcMain.handle("open-file", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Text Files", extensions: ["txt"] }]
  });

  if (canceled) return null;

  return fs.readFileSync(filePaths[0], "utf-8");
});

ipcMain.on("window-control", (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return;

  if (action === "close") {
    win.close();
  }

  if (action === "minimize") {
    win.minimize();
  }
});

app.whenReady().then(createWindow);