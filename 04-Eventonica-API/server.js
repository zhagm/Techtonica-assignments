let http = require("http");
let fs = require("fs");

const PORT = 3000;

http
  .createServer(function(request, response) {
    console.log("request ", request.url);

    const url = request.url;

    console.log("url =>", url);

    let filePath;
    if (url == "/") {
      filePath = "index.html";
    } else {
      filePath = "." + url;
    }

    console.log(`filePath => '${filePath}'`);

    fs.readFile(filePath, function(error, content) {
      console.log({ error, content });
      response.end(content);
    });
  })
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
