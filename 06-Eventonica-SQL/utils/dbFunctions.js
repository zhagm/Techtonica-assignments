const fs = require("fs");
const dataFilePath = __dirname + "/data.json";

function getAllData() {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
}

function updateData(updatedItem, property) {
  getAllData().then(data => {
    data[property] = updatedItem;
    fs.writeFile(dataFilePath, JSON.stringify(data), err => {
      if (err) console.error("ERROR: ", err);
    });
  });
}

module.exports = {
  getAllData,
  updateData
};
