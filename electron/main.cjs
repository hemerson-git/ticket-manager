const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require(`electron-is-dev`);

// Handlers
const {
  saveTicketHandler,
  listTicketHandler,
  editTicketHandler,
  deleteTicketHandler,
  filterTicketHandler,
  getTotalTickets,
} = require("./handlers/ticket.cjs");
const { reloadWindowHandler } = require("./handlers/reload.cjs");
const { exportDatabase, importDatabase } = require("./handlers/database.cjs");
const { signIn, isFirstUser } = require("./handlers/user.cjs");
const {
  setDefaultPass,
  comparePass,
  hasDefaultPass,
  changePass,
} = require("./handlers/configs.cjs");

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    console.log(process.argv);
    app.setAsDefaultProtocolClient("ticket-manager", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  } else {
    app.setAsDefaultProtocolClient("ticket-manager");
  }
}

let win;

async function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.cjs"),
    },
    autoHideMenuBar: true,
  });

  app.setAppUserModelId("com.squirrel.AppName.AppName");

  // In development, load from the Vite dev server
  if (!app.isPackaged) {
    // Wait for Vite dev server to be ready
    let tries = 0;
    const maxTries = 20;
    const tryLoad = async () => {
      try {
        await win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
      } catch (err) {
        tries++;
        if (tries < maxTries) {
          console.log(
            `Retrying to connect to Vite dev server... (${tries}/${maxTries})`
          );
          await new Promise((resolve) => setTimeout(resolve, 500));
          await tryLoad();
        } else {
          console.error("Failed to connect to Vite dev server:", err);
        }
      }
    };

    await tryLoad();
  } else {
    // win.setMenu(null);
    win.loadFile(path.join(__dirname, "dist", "index.html"));
  }
}

app.whenReady().then(async () => {
  await createWindow();

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on("second-instance", (event, commandLine, workingDirectory) => {
//     // Someone tried to run a second instance, we should focus our window.
//     if (win) {
//       if (win.isMinimized()) win.restore();
//       win.focus();
//     }
//     // // the commandLine is array of strings in which last element is deep link url
//     // dialog.showErrorBox(
//     //   "Welcome Back",
//     //   `You arrived from: ${commandLine.pop()}`
//     // );
//   });

//   app.whenReady().then(() => {
//     createWindow();
//   });
// }


// Ticket
ipcMain.handle("getTotalTickets", () => getTotalTickets());
ipcMain.handle("saveTicket", (event, data) => saveTicketHandler(event, data));
ipcMain.handle("listTicket", (event, data) => listTicketHandler(event, data));
ipcMain.handle("editTicket", (event, data) => editTicketHandler(event, data));
ipcMain.handle("filterTicket", (event, data) =>
  filterTicketHandler(event, data)
);

ipcMain.handle("deleteTicket", (event, data) =>
  deleteTicketHandler(event, data)
);

// Window
ipcMain.handle("reloadWindow", reloadWindowHandler);

// Database
ipcMain.handle("exportDatabase", exportDatabase);
ipcMain.handle("importDatabase", importDatabase);

// User
ipcMain.handle("signIn", (event, data) => signIn(event, data));
ipcMain.handle("isFirstUser", () => isFirstUser());

// Configs
ipcMain.handle("setDefaultPass", (event, data) => setDefaultPass(event, data));
ipcMain.handle("comparePass", (event, data) => comparePass(event, data));
ipcMain.handle("hasDefaultPass", (event, data) => hasDefaultPass(event, data));
ipcMain.handle("changePass", (event, data) => changePass(event, data));
