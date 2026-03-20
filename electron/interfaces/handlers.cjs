const ticket = require("./ticket.cjs");
const user = require("./user.cjs");
const database = require("./database.cjs");
const configs = require("./configs.cjs");
const page = require("./page.cjs");

module.exports = {
  ticket: {
    title: "TICKET",
    ...ticket,
  },
  user: {
    title: "USER",
    ...user,
  },
  database: {
    title: "DATABASE",
    ...database,
  },
  configs: {
    title: "CONFIGS",
    ...configs,
  },
  page: {
    title: "PAGE",
    ...page,
  },
};
