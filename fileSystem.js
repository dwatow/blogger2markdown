fs = require("fs");
// var parser = require("xml2json");
async function fsReader(pathFilename) {
  return new Promise((res, rej) => {
    fs.readFile(pathFilename, "utf8", function (err, data) {
      if (!err) {
        res(data);
      } else {
        rej(err);
      }
    });
  });
}

async function fsWriter(pathFilename, content) {
  return new Promise((res, rej) => {
    try {
      fs.promises.mkdir("./dist", { recursive: true }).catch(console.error);
      fs.writeFile("./dist/" + pathFilename, content, function (err) {
        if (err) rej(err);
        else res("File is created successfully.");
      });
    } catch (err) {
      rej(pathFilename + err.message);
    }
  });
}

module.exports = {
  fsReader,
  fsWriter,
};
