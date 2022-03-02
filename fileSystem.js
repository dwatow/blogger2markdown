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

async function fsWriter(filename, content, path) {
  await fs.promises.mkdir(`./${path}`, { recursive: true });
  return new Promise((res, rej) => {
    try {
      fs.writeFile(`./${path}/` + filename, content, function (err) {
        if (err) rej(err);
        else res("File is created successfully.");
      });
    } catch (err) {
      rej(filename + err.message);
    }
  });

  // .catch(console.error);
}

module.exports = {
  fsReader,
  fsWriter,
};
