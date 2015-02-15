// Configuration
process.stdin.setEncoding("utf8");
process.stdin.setRawMode(true);

// Dependencies
var Pty = require("pty.js")
  , CliResize = require("cli-handlers")
  ;

// Create the bash session
var term = Pty.spawn("bash", [], {
   name: "xterm-color",
   cols: process.stdout.columns,
   rows: process.stdout.rows,
   cwd: ".",
   env: process.env
});

term.pipe(process.stdout);
process.stdin.pipe(term);
term.on("close", function () {
    process.exit();
});

CliResize(function (err, newSize) {
    term.resize(newSize.width, newSize.height);
});
