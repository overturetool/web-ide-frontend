"use strict";

var exec = require('child_process').exec;

class CLI {
    constructor(command, initCallback) {
        this.queue = [];
        this.current = null;
        this.busy = true;
        this.response = [];
        this.process = exec(command);

        this.process.stdout.on('data', data => {
            if (data === "> ") {
                this.busy = false;

                if (this.current) {
                    var resolve = this.current.resolve;
                    this.current = null;
                    resolve(this.response);
                } else {
                    initCallback(this.response);
                }

                this.handleNext();
            } else {
                this.response.push(data);
            }
        });
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
        this.response = [];
        this.current = this.queue.shift();
        this.process.stdin.write(this.current.command + "\n");
    }

    exec(command) {
        return new Promise(resolve => this.handle(command, resolve));
    }
}

module.exports = CLI;