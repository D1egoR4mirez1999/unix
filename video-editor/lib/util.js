const fs = require("node:fs/promises");

// delete a file if exist, if not, it will not throw an error
const deleteFile = async (path) => {
  try {
    await fs.unlink(path);
  } catch (error) {
    // Do nothing
  }
};

// delete a folder if exist, if not, it will not throw an error
const deleteFolder = async (path) => {
  try {
    await fs.rm(path, { recursive: true });
  } catch (error) {
    // Do nothing
  }
};

const utils = {
  deleteFolder,
  deleteFile,
}

module.exports = utils;