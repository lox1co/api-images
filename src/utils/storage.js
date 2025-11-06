const fs = require("fs");
const path = require("path");
const crypto = require("node:crypto");
const saveFile = (file, subdomain) => {
  const slug = crypto.randomBytes(6).toString("hex");
  const ext = path.extname(file.originalname);
  const baseDir = path.join(process.env.UPLOAD_DIR, subdomain);
  fs.mkdirSync(baseDir, { recursive: true });
  const finalPath = path.join(baseDir, slug + ext);
  fs.renameSync(file.path, finalPath);
  return { slug, path: finalPath };
};

module.exports = { saveFile };
