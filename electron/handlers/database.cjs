const { dialog, app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");
const { prisma } = require("../lib/prisma.cjs");

const getDbPath = () =>
  app.isPackaged
    ? path.join(process.resourcesPath, "prisma", "dev.db")
    : path.join(__dirname, "..", "..", "prisma", "dev.db");

const exportDatabase = async (event) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);

    const file = await dialog.showSaveDialog(win, {
      filters: [{ name: "Database", extensions: ["DB"] }],
      properties: ["showOverwriteConfirmation", "createDirectory"],
      buttonLabel: "Exportar",
    });

    if (file.canceled || !file.filePath) return false;

    // Use VACUUM INTO to create a consistent backup of the live database
    const destPath = file.filePath.toString().replace(/\\/g, "/");
    await prisma.$executeRawUnsafe(`VACUUM INTO '${destPath.replace(/'/g, "''")}'`);

    return true;
  } catch (e) {
    console.log("exportDatabase error: " + e.message);
    return false;
  }
};

const importDatabase = async (event) => {
  try {
    const win = BrowserWindow.fromWebContents(event.sender);

    const file = await dialog.showOpenDialog(win, {
      filters: [{ name: "Database", extensions: ["DB"] }],
      buttonLabel: "Importar",
      properties: ["openFile"],
    });

    if (file.canceled || file.filePaths.length === 0) return false;

    const destPath = getDbPath();
    const destDir = path.dirname(destPath);

    if (!fs.existsSync(destDir)) {
      await fs.promises.mkdir(destDir, { recursive: true });
    }

    // Disconnect Prisma before replacing the database file to avoid file lock
    await prisma.$disconnect();

    await fs.promises.copyFile(file.filePaths[0], destPath);

    console.log(`${file.filePaths[0]} copied to ${destPath}`);
    return true;
  } catch (error) {
    console.log("importDatabase error: " + error.message);
    return false;
  }
};

module.exports = {
  exportDatabase,
  importDatabase,
};
