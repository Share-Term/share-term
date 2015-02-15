// Dependencies
var Pty = require("pty.js")
  , SocketIoClient = require("socket.io-client")
  , Ul = require("ul")
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
        this.socket.emit("_termData", data);
    }.bind(this));

    // Listen for Pty data
    term.on("close", function (data) {
        this.socket.emit("_termClosed", data);
    }.bind(this));

};

ShareTerm.prototype.connect = function (options, callback) {

    if (typeof options === "function") {
        callback = options;
        options = {};
    }

    this.socket = SocketIoClient(this.host)

    // Welcome
    this.socket.on("welcome", function (sock) {
        if (options.createPty !== false) {
            this.connected();
        }
        callback(null, sock);
    }.bind(this));

    // Connect error
    this.socket.on("connect_error", function (err) {
        callback(err);
    });
};

ShareTerm.prototype.create = function (callback) {
    this.connect(function (err, data) {
        if (err) { return callback(err); }
        this.socket.emit("createTerm");
        callback(null, data);
    }.bind(this));
};

ShareTerm.prototype.get = function (options, callback) {
    this.socket = SocketIoClient(this.host)

    Ul.merge(options, {
        stdout: process.stdout
    });

    this.connect({ createPty: false }, function (err, data) {
        if (err) { return callback(err); }

        this.socket.on("_termData", function (data) {
            options.stdout.write(data);
        }.bind(this));

        this.socket.on("_termClosed", function () {
            callback();
        });

        this.socket.emit("getTerm", { id: options.id });
    }.bind(this));

};

module.exports = ShareTerm;
