let { createServer } = require("http");
let fs = require("fs");

createServer(function(req, res) {
  switch (req.url.toLowerCase()) {
    case "/":
      filePath = "./index.html";
      break;
    default:
      filePath = "./error.html";
  }

  fs.readFile(filePath, (e, content) => res.end(content));
}).listen(8125);
console.log("Server running at http://127.0.0.1:8125/");
