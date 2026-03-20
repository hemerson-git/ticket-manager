const { contextBridge, ipcRenderer } = require("electron");
const ticket = require("./interfaces/ticket.cjs");
const user = require("./interfaces/user.cjs");
const database = require("./interfaces/database.cjs");
const configs = require("./interfaces/configs.cjs");
const page = require("./interfaces/page.cjs");
const handlers = require("./interfaces/handlers.cjs");

// Tickets
contextBridge.exposeInMainWorld(handlers.ticket.title, {
  [ticket.saveTicket]: async (data) => {
    return await ipcRenderer.invoke(ticket.saveTicket, data);
  },

  [ticket.listTicket]: async (data) => {
    return await ipcRenderer.invoke(ticket.listTicket, data);
  },

  [ticket.editTicket]: async (data) => {
    return await ipcRenderer.invoke(ticket.editTicket, data);
  },

  [ticket.deleteTicket]: async (data) => {
    return await ipcRenderer.invoke(ticket.deleteTicket, data);
  },

  [ticket.filterTicket]: async (data) => {
    return await ipcRenderer.invoke(ticket.filterTicket, data);
  },

  [ticket.getTotalTickets]: async () => {
    return await ipcRenderer.invoke(ticket.getTotalTickets);
  },
});

// User
contextBridge.exposeInMainWorld(handlers.user.title, {
  [user.signIn]: async (data) => {
    return await ipcRenderer.invoke(user.signIn, data);
  },

  [user.isFirstUser]: async () => {
    return await ipcRenderer.invoke(user.isFirstUser);
  },
});

// Database
contextBridge.exposeInMainWorld(handlers.database.title, {
  [database.exportDatabase]: async () => {
    return await ipcRenderer.invoke(database.exportDatabase);
  },

  [database.importDatabase]: async () => {
    return await ipcRenderer.invoke(database.importDatabase);
  },
});

// Configs
contextBridge.exposeInMainWorld(handlers.configs.title, {
  [configs.setDefaultPass]: async (data) => {
    return await ipcRenderer.invoke(configs.setDefaultPass, data);
  },

  [configs.comparePass]: async (data) => {
    return await ipcRenderer.invoke(configs.comparePass, data);
  },

  [configs.hasDefaultPass]: async (data) => {
    return await ipcRenderer.invoke(configs.hasDefaultPass, data);
  },

  [configs.changePass]: async (data) => {
    return await ipcRenderer.invoke(configs.changePass, data);
  },
});

// Page
contextBridge.exposeInMainWorld(handlers.page.title, {
  [page.reloadWindow]: async () => {
    return await ipcRenderer.invoke(page.reloadWindow);
  },
});
