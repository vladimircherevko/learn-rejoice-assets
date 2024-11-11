const fs = require("fs");
const path = require("path");

const OUTPUT_FILE = "structure.json";

function getTopics(rootDir) {
  const items = fs.readdirSync(rootDir);

  return items
    .filter((item) => !item.startsWith(".") && !item.startsWith("_"))
    .map((item) => {
      const itemPath = path.join(rootDir, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const relativePath = path.relative(rootDir, itemPath);
        return {
          path: relativePath,
          name: item,
          stories: getStories(itemPath, rootDir),
        };
      }
    })
    .filter((item) => item);
}

function getStories(dirPath, rootDir) {
  const items = fs.readdirSync(dirPath);

  return items
    .sort((a, b) => {
      const numA = parseInt(a.split("-")[1], 10);
      const numB = parseInt(b.split("-")[1], 10);
      return numA - numB;
    })
    .map((item) => {
      const itemPath = path.join(dirPath, item);
      if (fs.statSync(itemPath).isDirectory()) {
        const relativePath = path.relative(rootDir, itemPath);
        return {
          path: relativePath,
          name: item,
        };
      }
    })
    .filter((item) => item);
}

function createProjectStructureJSON() {
  const rootDir = path.resolve(__dirname);
  const tree = getTopics(rootDir);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2), "utf8");
  console.log(`File "${OUTPUT_FILE}" is updated!`);
}

createProjectStructureJSON();

/*
node descript.js
*/
