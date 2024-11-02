const fs = require("node:fs/promises");
const path = require("node:path");
const os = require("node:os");

const home = os.homedir();

(async function deleteAllFiles(filePath) {
  try {
    const dir = await fs.opendir(filePath);
    try {
      for await (const items of dir) {
        if (items.isFile()) {
          await fs.unlink(path.join(items.parentPath, items.name));
        } else if (items.isDirectory()) {
          await deleteAllFiles(path.join(items.parentPath, items.name));
        }
      }
    } catch (err) {
      if (err.code === "ERR_DIR_CLOSED") {
        console.log("closed succesfully");
      } else {
        console.log(err.code);
      }
    } finally {
      console.log(`Operation successful`);
    }
  } catch (err) {
    console.log(err);
  }
});
// (`${home}/Desktop/filez`);

let itemCount = 0;
async function calcFolderSize(filePath) {
  try {
    let totalSize = 0;
    const dir = await fs.opendir(filePath);
    try {
      for await (const items of dir) {
        if (items.isFile()) {
          itemCount += 1;
          const { size } = await fs.stat(
            path.join(items.parentPath, items.name)
          );
          totalSize += size;
        } else if (items.isDirectory()) {
          itemCount += 1;
          totalSize += await calcFolderSize(
            path.join(items.parentPath, items.name)
          );
        }
      }
      return totalSize;
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
}

// calcFolderSize(`${home}/Desktop/filez`)
//   .then((res) => {
//     console.log("Calculating...");
//     console.log(`${res} bytes for ${itemCount} items`);
//   })
//   .catch((err) => console.log(err));
