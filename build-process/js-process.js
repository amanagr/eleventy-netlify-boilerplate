const UglifyJS = require("uglify-js");
const fs = require("fs-extra");
const path = require("path");

const processJs = (src, dest) => {
  return new Promise((resolve, reject) => {
    result = UglifyJS.minify(fs.readFileSync(src, "utf8"));
    if (result.error != undefined) reject(result.error);
    resolve(result.code);
    console.log("Writing js files.");
  });
};

module.exports = (JSPath, finalJsPath) => {
  if (!fs.existsSync(path.dirname(finalJsPath))) {
    Promise.all([
      fs.mkdir(path.dirname(finalJsPath), { recursive: true }),
      processJs(JSPath, finalJsPath),
    ])
      .then((result) => fs.writeFile(finalJsPath, result[1]))
      .catch((error) => console.error(error.stack));
  }
  processJs(JSPath, finalJsPath)
    .then((result) => fs.writeFile(finalJsPath, result))
    .catch((error) => console.error(error.stack));
};
