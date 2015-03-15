// Dependencies
var Pty = require("pty.js")
  , SocketIoClient = require("socket.io-client")
  , Ul = require("ul")
  , Open = require("open")
  , QueryString = require("querystring")
  ;

/**
 * ShareTerm
 * Creates a new instance of `ShareTerm`.
 *
 * @name ShareTerm
 * @function
 * @param {Object} options The options object:
 *
 *  - `host` (String): The remote server host.
 *
 * @return {undefined}
 */
function ShareTerm(options) {
    this.host = options.host;
}

/**
 * connected
 * This is called internally after the client is connected.
 *
 * @name connected
 * @function
 * @return {ShareTerm} The `ShareTerm` instance.
 */
ShareTerm.prototype.connected = function () {

    var self = this;

    // Create the bash session
    var term = self.term = Pty.spawn("bash", [], {
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
        self.socket.emit("_termData", data);
    });

    // Listen for Pty data
    term.on("close", function (data) {
        self.socket.emit("_termClosed", data);
    });

    term.on("resize", function (size) {
        term.resize(size.width, size.height);
        self.socket.emit("_termResized", size);
    });

    self.socket.on("->clientData", function (data) {
        term.write(data);
    });

    self.socket.on("->requestControl", function (data) {
        if (!data.clientId || !data.token || !data.termId) {
            return;
        }
        Open(self.host + "term/request-control?" + QueryString.encode({
            clientId: data.clientId
          , token: data.token
          , termId: data.termId
        }));
    });

    setTimeout(function() {
        self.socket.emit("_termResized", {
            width: term.cols
          , height: term.rows
        });
    }, 0);

    return self;
};

/**
 * connect
 * Connects the client to the remote server.
 *
 * @name connect
 * @function
 * @param {Object} options The options object.
 * @param {Function} callback The callback function.
 * @return {ShareTerm} The `ShareTerm` instance.
 */
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

    return this;
};

/**
 * create
 * Creates a new terminal share session.
 *
 * @name create
 * @function
 * @param {Function} callback The callback function.
 * @return {ShareTerm} The `ShareTerm` instance.
 */
ShareTerm.prototype.create = function (callback) {
    this.connect(function (err, data) {
        if (err) { return callback(err); }
        this.socket.emit("createTerm");
        callback(null, data);
    }.bind(this));
    return this;
};

/**
 * get
 * Connects the client to an existing terminal share session.
 *
 * @name get
 * @function
 * @param {Object} options An object containing the following fields:
 *
 *  - `id` (String): The terminal share session id.
 *  - `stdout` (Stream): The output stream (default: `process.stdout`).
 *
 * @param {Function} callback The callback function.
 * @return {ShareTerm} The `ShareTerm` instance.
 */
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

    return this;
};

module.exports = ShareTerm;
