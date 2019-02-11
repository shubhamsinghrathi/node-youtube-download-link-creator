let youtubeDL = require("./youtube-download-link");
let http = require("http");

let server = http.createServer((req, res) => {
    youtubeDownloadLinkCreator("https://www.youtube.com/watch?v=ObHQHszbIcE&t=64s").then((data) => {
        console.log("data: ", data);

        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    }).catch((err) => {
        console.log("error: ", err);

        res.writeHead(500, { "Content-type": "application/json" });
        res.end(JSON.stringify(err));
    })
});

server.listen(3000, () => {
    console.log("Lintening on port - 3000");
});