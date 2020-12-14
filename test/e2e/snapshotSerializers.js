const path = require("path");

const projectRoot = path.resolve(__dirname, "..");

module.exports = {
  print(val) {
    if (typeof val === "string")
      return `"${val.replace(new RegExp(projectRoot, "g"), "<rootDir>")}"`;
    if (val instanceof Error)
      return `[${val.name}: ${val.message.replace(
        new RegExp(projectRoot, "g"),
        "<rootDir>"
      )}]`;
  },
  test(val) {
    return typeof val === "string" || val instanceof Error;
  },
};
