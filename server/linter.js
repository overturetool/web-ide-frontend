"use strict";

var CLI = require('./cli');

class Linter {
    constructor(type) {
        this.type = type || "vdmsl";
        this.cli = new CLI();
    }

    lint(file) {
        return new Promise(resolve => {
            this.cli.run(`overture -${this.type} workspace/${file}`, response => {
                resolve(response)
            });
        });
    }
}

module.exports = Linter;