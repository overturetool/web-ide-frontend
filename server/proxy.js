var net = require('net');
var path = require('path');
var fs = require('fs');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

var old_console = console.log;
console.warn = console.log = () => console.error.apply(console, arguments);

// Parses commands from browser
class Client {
    constructor(connection) {
        this.connection = connection;
        this.listeners = [];
    }

    reconnect(connection) {
        this.cleanup();
        this.connection = connection;
    };

    connect() {
        return new Promise(resolve => {
            this.connection.on("data", data => {
                var commands = this.parse(data);

                if (commands.length !== 0)
                    this.listeners.forEach(listener => listener(commands));
            });

            this.connection.on("end", () => this.connection = null);

            resolve();
        });
    };

    cleanup() {
        if (this.connection) this.connection.end();
    }

    parse() {
        var data_buffer = "";
        var data_length = false;
        var json_objects = [];
        function parser(data) {
            data = data_buffer + data.toString();

            function abort() {
                var ret = json_objects;
                json_objects = [];
                return ret;
            }

            if (data_length === false) {
                var idx = data.indexOf("\r\n\r\n");
                if (idx === -1) {
                    data_buffer = data;
                    return abort();
                }

                data_length = parseInt(data.substr(15, idx), 10);
                data = data.slice(idx+4);
            }

            // haven't gotten the full JSON object yet
            if (data.length < data_length) {
                return abort();
            }

            data_buffer = data.slice(data_length);
            data = data.substr(0, data_length);

            try {
                data = JSON.parse(data);
            }
            catch (ex) {
                console.log("There was an error parsing data from the plugin.");
                log("JSON (Parse error): " + data);
                return abort();
            }

            json_objects.push(data);

            data_length = false;
            return parser("");
        }
        return parser;
    };

    send(args) {
        args = JSON.stringify(args);

        var msg = ["Content-Length:", args.length, "\r\n\r\n", args].join("");

        this.connection.write(msg);
    };

    onCommands(listener) {
        this.listeners.push(listener);
    }
}

// Issues commands to Overture CLI
class Debugger {

    spawn() {
        console.error(["gdb.spawn"]);

        this.proc = spawn('gdb', ['-q', '--interpreter=mi2', executable], {
            detached: true,
            cwd: dirname
        });

        var self = this;

        // handle gdb output
        var stdout_buff = buffers();
        this.proc.stdout.on("data", function(stdout_data) {
            stdout_buff(stdout_data, self._handleLine.bind(self));
        });

        // handle gdb stderr
        var stderr_buff = buffers();
        this.proc.stderr.on("data", function(stderr_data) {
            stderr_buff(stderr_data, function(line) {
                log("GDB STDERR: " + line);
            });
        });

        this.proc.on("end", function() {
            log("gdb proc ended");
            server.close();
        });

        this.proc.on("close", function(code, signal) {
            self.proc.stdin.end();
            log("GDB terminated with code " + code + " and signal " + signal);
            client.send({ err:"killed", code:code, signal:signal });
            process.exit();
        });
    };

    this.connect = function(callback) {
        console.error(["gdb.connect"]);

        // ask GDB to retry connections to server with a given timeout
        this.issue("set tcp connect-timeout", MAX_RETRY, function() {
            // now connect
            this.issue("-target-select", "remote localhost:"+gdb_port, function(reply) {
                if (reply.state != "connected")
                    return callback(reply, "Cannot connect to gdbserver");

                // connected! set eval of conditional breakpoints on server
                this.issue("set breakpoint", "condition-evaluation host", callback);

            }.bind(this));
        }.bind(this));
    };

    // spawn GDB client only after gdbserver is ready
    this.waitConnect = function(callback) {
        console.error(["gdb.waitConnect"]);
        setTimeout(function() {callback()}, 10);

        function wait(retries, callback) {
            if (retries < 0) return;

            // determine if gdbserver has opened the port yet
            exec("lsof -i :"+gdb_port+" -sTCP:LISTEN|grep -q gdbserver", function(err) {
                // if we get an error code back, gdbserver is not yet running
                if (err !== null)
                    return setTimeout(wait.bind(this, --retries, callback), 1000);

                // success! load gdb and connect to server
                this.spawn();
                this.connect(callback);
            }.bind(this));
        }

        wait.call(this, MAX_RETRY, callback);
    };

    // Suspend program operation by sending sigint and prepare for state update
    this.suspend = function() {
        console.error(["gdb.suspend"]);
    };

    this.cleanup = function() {
        console.error(["gdb.cleanup"]);
    };

    // issue a command to GDB
    this.issue = function(cmd, args, callback) {
        console.error(["gdb.issue", cmd, args]);
        setTimeout(function() {callback()}, 10);
    };

    this.post = function(client_seq, command, args) {
        console.error(["gdb.post", client_seq, command, args]);
    };

    /////
    // Incoming command handling
    /////

    this.handle = function(command) {
        console.error(["gdb.handleCommands", this.command_queue]);

        var id = (typeof command._id === "number") ? command._id : "";

        // fix some condition syntax
        if (command.condition)
            command.condition = command.condition.replace(/=(["|{|\[])/g, "= $1");

        switch (command.command) {
            case 'run':
            case 'continue':
            case 'step':
            case 'next':
            case 'finish':
                this.post(id, "-exec-" + command.command);
                break;

            case "setvar":
                this.post(id, "-var-assign", command.name + " " + command.val);
                break;

            case "bp-change":
                if (command.enabled === false)
                    this.post(id, "-break-disable", command.id);
                else if (command.condition)
                    this.post(id, "-break-condition", command.id + " " + command.condition);
                else
                    this.post(id, "-break-enable", command.id);
                break;

            case "bp-clear":
                // include filename for multiple files
                this.post(id, "-break-delete", command.id);
                break;

            case "bp-set":
                var args = [];

                // create a disabled breakpoint if requested
                if (command.enabled === false)
                    args.push("-d");

                if (command.condition) {
                    command.condition = command.condition.replace(/"/g, '\\"');
                    args.push("-c");
                    args.push('"' + command.condition + '"');
                }

                args.push(command.text + ":" + (command.line + 1));

                this.post(id, "-break-insert", args.join(" "));
                break;

            case "bp-list":
                this.post(id, "-break-list");
                break;

            case "eval":
                // replace quotes with escaped quotes
                var exp = '"' + command.exp.replace(/"/g, '\\"') + '"';
                this.post(id, "-data-evaluate-expression", exp);
                break;

            case "reconnect":
                if (this.running) {
                    this.clientReconnect = true;
                    this.suspend();
                    client.send({ _id: id, state: "running" });
                }
                else
                    client.send({ _id: id, state: "stopped" });
                break;

            case "suspend":
                this.suspend();
                client.send({ _id: id, state: "stopped" });
                break;

            case "status":
                if (this.running) {
                    client.send({ _id: id, state: "running" });
                }
                else {
                    client.send({ _id: id, state: "stopped" });
                    this._updateState();
                }
                break;

            case "detach":
                this.issue("monitor", "exit", function() {
                    log("shutdown requested");
                    process.exit();
                });
                break;

            default:
                log("PROXY: received unknown request: " + command.command);
        }
    };
}

// End GDB class
////////////////////////////////////////////////////////////////////////////////
// Proxy initialization

class Proxy {
    constructor() {
        this.server = net.createServer(connection => {
            if (this.client)
                this.client.reconnect(connection);
            else
                this.client = new Client(connection);

            this.client.connect(() => this.client.send("connect"));

            this.client.onCommands(commands => this.clientCommands(commands));
        });

        this.server.on("error", err => console.log(err));

        this.server.listen(8182, "127.0.0.1", () => this.ready());

        this.debug = new Debugger();

        this.debug.load("bom.vdmsl").then(() => this.ready());

        this.readyCount = 0;
    }

    ready() {
        if (++this.readyCount == 2)
            old_console.apply(console, ["ß"]); // Tell client that everything is ready.
    }

    // From client
    clientCommands(commands) {

    }
}

var proxy = new Proxy();
