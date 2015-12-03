"use strict";

var exec = require('child_process').exec;

class CLI {
    constructor() {
        this.queue = [];
        this.current = null;
        this.busy = true;
        this.response = "";
    }

    run(cliPath, cb) {
        this.process = exec(cliPath);

        this.process.stdout.on('data', data => {
            if (data.slice(data.length-2, data.length) === "> ") {
                this.response += data.slice(0, data.length-2);

                this.busy = false;

                if (this.current) {
                    var resolve = this.current.resolve;
                    this.current = null;
                    resolve(this.response);
                } else {
                    cb(this.response);
                }

                this.handleNext();
            } else {
                this.response += data;
            }
        });

        this.process.on("SIGHUP", () => {
            console.log("Received SIGHUP");
            this.process.exit();
        });

        this.process.on("exit", () => console.log("quitting!"));
        this.process.on('SIGINT', () => console.log("SIGINT"));

        this.process.on("uncaughtException", e => {
            console.log("uncaught exception (" + e + ")");
            this.process.exit();
        });
    }

    stop() {
        this.process.disconnect();
    }

    handle(command, resolve) {
        this.queue.push({
            command: command,
            resolve: resolve
        });

        this.handleNext();
    }

    handleNext() {
        if (this.busy || this.queue.length === 0) return;

        this.busy = true;
        this.response = "";
        this.current = this.queue.shift();
        this.process.stdin.write(this.current.command + "\n");
    }

    exec(command) {
        return new Promise(resolve => this.handle(command, resolve));
    }
}

module.exports = CLI;