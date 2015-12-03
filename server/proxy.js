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
    constructor() {
        this.cli = new CLI();
    }

    load() {
        return new Promise(resolve => {
            this.cli.run('overture -vdmsl -i workspace/' + file, response => resolve(response));
        });
    }

    suspend() {
        this.cli.exec("stop");
    }

    cleanup() {
        this.cli.stop();
    }

    exec(cmd, args) {
        return this.cli.get(cmd, args);
    };

    handle(command) {
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
        }
    };
}

// Connects client and debugger
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
        commands.forEach(command => {
            this.debug
                .handle(command)
                .then(response => this.client.send(response));
        })
    }
}

var proxy = new Proxy();
