const crypto = require("crypto");

const generateHash = (input) => {
  return crypto.createHash("sha256").update(input).digest("hex");
};

module.exports = { generateHash };
