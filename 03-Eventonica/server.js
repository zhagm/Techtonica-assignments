let { createServer } = require("http");
let fs = require("fs");

createServer(function(req, res) {
  let filePath = "." + req.url;

  switch (filePath.toLowerCase()) {
    case "./":
      filePath = "./index.html";
      break;
    case "./gabby":
      filePath = "./Gabby/gabby.html";
      break;
    case "./ariel":
      filePath = "./ariel.html";
      break;
    default:
      filePath = "./error.html";
  }

  fs.readFile(filePath, (e, content) => res.end(content));
}).listen(8125);
console.log("Server running at http://127.0.0.1:8125/");
