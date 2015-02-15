const HOST = "http://localhost:8080/";

// Configuration
process.stdin.setEncoding("utf8");
process.stdin.setRawMode(true);

// Dependencies
var Pty = require("pty.js")
  , CliResize = require("cli-resize")
  , OArgv = require("oargv")
  ;

var socket = require("socket.io-client")(HOST);
console.log(">> Connecting to the server.");
socket.on("welcome", function (sock) {

    // Create the bash session
    var term = Pty.spawn("bash", [], {
       name: "xterm-color",
       cols: process.stdout.columns,
       rows: process.stdout.rows,
       cwd: ".",
       env: process.env
    });

    term.write(OArgv({
        _: ["welcome", HOST, sock.id]
    }, "share-term") + "\r");

    term.pipe(process.stdout);
    process.stdin.pipe(term);

    term.on("data", function (data) {
        socket.emit("_terminalData", data);
    });

    term.on("close", function () {
        process.exit();
    });

    CliResize(function (err, newSize) {
        term.resize(newSize.width, newSize.height);
    });
});

socket.on("connect_error", function (err) {
    console.log(err);
    process.exit(1);
});

// Disconnect
socket.on("disconnect", function(){
    console.log(">> Disconnected by the server.");
    process.exit();
});

