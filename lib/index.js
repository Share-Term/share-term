// Dependencies
var Pty = require("pty.js")
  , SocketIoClient = require("socket.io-client")
  ;

function ShareTerm(options) {
    this.host = options.host;
}

ShareTerm.prototype.connected = function () {
    // Create the bash session
    var term = this.term = Pty.spawn("bash", [], {
       name: "xterm-color",
       cols: process.stdout.columns,
       rows: process.stdout.rows,
       cwd: ".",
       env: process.env
    });

    // Pipe standard input and output
    term.pipe(process.stdout);
    process.stdin.pipe(term);

    // Listen for Pty data
    term.on("data", function (data) {
        this.socket.emit("_terminalData", data);
    }.bind(this));

};

ShareTerm.prototype.connect = function (callback) {
    this.socket = SocketIoClient(this.host)

    // Welcome
    this.socket.on("welcome", function (sock) {
        this.connected();
        callback(null, sock);
    }.bind(this));

    // Connect error
    this.socket.on("connect_error", function (err) {
        callback(err);
    });

};

module.exports = ShareTerm;
