"use strict";

var exec = require('child_process').exec;

class CLI {
    constructor() {
        this.queue = [];
        this.current = null;
        this.busy = true;
        this.response = "";
    }

    run(cliPath, options) {
        this.process = exec(cliPath, options);

        this.process.stdout.on('data', data => {
            if (data.slice(data.length-2, data.length) === "> ") {
                this.response += data.slice(0, data.length-2);

                this.busy = false;

                if (this.current) {
                    var resolve = this.current.resolve;
                    this.current = null;
                    resolve(this.response);
                }

                this.handleNext();
            } else {
                this.response += data;
            }
        });

        this.process.stderr.on('data', data => console.error(data));

        return new Promise(resolve => {
            var cli = this;
            return this.process.on('exit', () => resolve(cli.response));
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