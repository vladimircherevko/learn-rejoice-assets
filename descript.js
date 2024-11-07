const fs = require("fs");
const path = require("path");

const OUTPUT_FILE = "structure.json";

function getDirectoryTree(dirPath, rootDir, isRoot) {
  const items = fs.readdirSync(dirPath);

  return items
    .filter((item) => !item.startsWith(".") && !item.startsWith("_")) // исключаем скрытые папки и те, что начинаются с '_'
    .map((item) => {
      const itemPath = path.join(dirPath, item);
      const relativePath = path.relative(rootDir, itemPath); // относительный путь
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        return {
          path: relativePath,
          name: item,
          type: "folder",
          children: getDirectoryTree(itemPath, rootDir),
        };
      } else if (!isRoot) {
        return {
          path: relativePath,
          name: item,
          type: "file",
        };
      }
    })
    .filter((item) => item);
}

// Функция для создания JSON файла с описанием структуры проекта
function createProjectStructureJSON(rootDir) {
  const tree = getDirectoryTree(rootDir, rootDir, true);

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(tree, null, 2), "utf8");
  console.log(`Файл "${OUTPUT_FILE}" успешно создан!`);
}

// Запуск скрипта
const rootDirectory = path.resolve(__dirname); // корневая папка проекта
createProjectStructureJSON(rootDirectory);

/*
node descript.js
*/
