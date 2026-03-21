const { dialog, app } = require("electron");
const path = require("path");
const fs = require("fs");

const getDbPath = () =>
  app.isPackaged
    ? path.join(process.resourcesPath, "prisma", "dev.db")
    : path.join(__dirname, "..", "..", "prisma", "dev.db");

const exportDatabase = async () => {
  try {
    const file = await dialog.showSaveDialog({
      filters: [{ name: "Database", extensions: ["DB"] }],
      properties: ["showOverwriteConfirmation", "createDirectory"],
      buttonLabel: "Exportar",
    });

    if (file.canceled) return;

    await fs.promises.copyFile(getDbPath(), file.filePath.toString());
  } catch (e) {
    console.log("error: " + e.message);
  }
};

const importDatabase = async () => {
  try {
    const file = await dialog.showOpenDialog({
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

    await fs.promises.copyFile(file.filePaths[0], destPath);

    console.log(`${file.filePaths[0]} copied to ${destPath}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = {
  exportDatabase,
  importDatabase,
};
