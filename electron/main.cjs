const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const isDev = require(`electron-is-dev`);

// Interfaces
const ticket = require("./interfaces/ticket.cjs");
const user = require("./interfaces/user.cjs");
const database = require("./interfaces/database.cjs");
const configs = require("./interfaces/configs.cjs");
const page = require("./interfaces/page.cjs");

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
  getItemsPerPage,
  setItemsPerPage,
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

// Ticket
ipcMain.handle(ticket.getTotalTickets, () => getTotalTickets());
ipcMain.handle(ticket.saveTicket, (event, data) => saveTicketHandler(event, data));
ipcMain.handle(ticket.listTicket, (event, data) => listTicketHandler(event, data));
ipcMain.handle(ticket.editTicket, (event, data) => editTicketHandler(event, data));
ipcMain.handle(ticket.filterTicket, (event, data) => filterTicketHandler(event, data));
ipcMain.handle(ticket.deleteTicket, (event, data) => deleteTicketHandler(event, data));

// Page
ipcMain.handle(page.reloadWindow, reloadWindowHandler);

// Database
ipcMain.handle(database.exportDatabase, exportDatabase);
ipcMain.handle(database.importDatabase, importDatabase);

// User
ipcMain.handle(user.signIn, (event, data) => signIn(event, data));
ipcMain.handle(user.isFirstUser, () => isFirstUser());

// Configs
ipcMain.handle(configs.setDefaultPass, (event, data) => setDefaultPass(event, data));
ipcMain.handle(configs.comparePass, (event, data) => comparePass(event, data));
ipcMain.handle(configs.hasDefaultPass, (event, data) => hasDefaultPass(event, data));
ipcMain.handle(configs.changePass, (event, data) => changePass(event, data));
ipcMain.handle(configs.getItemsPerPage, () => getItemsPerPage());
ipcMain.handle(configs.setItemsPerPage, (event, data) => setItemsPerPage(event, data));
