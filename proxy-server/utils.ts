import fs = require("fs/promises")

export const fileExists = path => fs.access(path, fs.constants.F_OK).then(() => true).catch(() => false);