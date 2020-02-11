var http = require("http");
var fs = require("fs");

http
  .createServer(function(request, response) {
    var filePath = "." + request.url;
    if (filePath == "./") {
      filePath = "./index.html";
    } else if (filePath == "./gabby") {
      filePath = "./Gabby/gabby.html";
    } else if (filePath == "./ariel") {
      filePath = "./ariel.html";
    } else {
      filePath = "./error.html";
    }

    fs.readFile(filePath, function(error, content) {
      response.writeHead(200);
      response.end(content, "utf-8");
    });
  })
  .listen(8125);
console.log("Server running at http://127.0.0.1:8125/");
