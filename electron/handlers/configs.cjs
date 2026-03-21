const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const { app } = require("electron");
const { prisma } = require("../lib/prisma.cjs");
const salt = bcrypt.genSaltSync(10);

const getConfigsPath = () => path.join(app.getPath("userData"), "configs.json");

const getItemsPerPage = async () => {
  const configsPath = getConfigsPath();
  if (!fs.existsSync(configsPath)) return 20;
  const raw = fs.readFileSync(configsPath, "utf-8");
  return JSON.parse(raw).items_per_page ?? 20;
};

const setItemsPerPage = async (event, items_per_page) => {
  const configsPath = getConfigsPath();
  const config = fs.existsSync(configsPath)
    ? JSON.parse(fs.readFileSync(configsPath, "utf-8"))
    : {};
  config.items_per_page = Number(items_per_page);
  fs.writeFileSync(configsPath, JSON.stringify(config, null, 2));
  return true;
};
const { z } = require("zod");

const hasDefaultPass = async (event, data) => {
  const config = await prisma.config.findFirst();
  return config?.default_pass_hash ? true : false;
};

const setDefaultPass = async (event, data) => {
  const passSchema = z.string().min(4);
  const pass = passSchema.parse(data);

  try {
    const hasPass = await prisma.config.count();

    if (hasPass) throw new Error();

    const hash = bcrypt.hashSync(pass, salt);
    await prisma.config.create({
      data: {
        default_pass_hash: hash,
      },
    });
  } catch (e) {
    throw new Error("Something went wrong while hashing");
  }

  return true;
};

const changePass = async (event, data) => {
  const passSchema = z.object({
    pass: z.string().min(4),
    newPass: z.string().min(4),
  });

  const { newPass, pass } = passSchema.parse(data);

  try {
    const config = await prisma.config.findFirst();
    const isEquals = bcrypt.compareSync(pass, config.default_pass_hash);

    if (isEquals) {
      const hash = bcrypt.hashSync(newPass, salt);

      await prisma.config.update({
        where: {
          id: config.id,
        },

        data: {
          default_pass_hash: hash,
        },
      });
    }
  } catch (e) {
    console.log(e);
    throw new Error("Something went wrong while hashing");
  }

  return true;
};

const comparePass = async (event, data) => {
  const passSchema = z.string().min(4);
  const pass = passSchema.parse(data);

  try {
    const config = await prisma.config.findFirst();
    const isEquals = bcrypt.compareSync(pass, config.default_pass_hash);

    if (!isEquals) return false;

    return true;
  } catch (e) {
    throw new Error("Passwords is not correct!");
  }
};

module.exports = {
  setDefaultPass,
  comparePass,
  hasDefaultPass,
  changePass,
  getItemsPerPage,
  setItemsPerPage,
};
