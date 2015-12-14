"use strict";

var CLI = require('./cli');

class Linter {
    constructor(type) {
        this.type = type || "vdmsl";
        this.cli = new CLI();
    }

    parse(data) {
        var markers = [];

        data.split("\n")
            .forEach(line => {
            var match = line.match(/^(Error|Warning) [0-9]+: (.*?) at line ([0-9]+):([0-9]+)/);

            if (!match) return;

            markers.push({
                from: {
                    line: parseInt(match[3], 10) - 1, // Line number
                    ch: parseInt(match[4], 10) - 1 // Column number
                },
                to: {
                    line: parseInt(match[3], 10) - 1, // Line number
                    ch: parseInt(match[4], 10) // Column number
                },
                message: match[2],  // Message to display in editor
                severity: match[1] == "Error" ? "error" : "warning" // Marker type (error or warning)
            });
        });

        return markers;
    }

    lint(file) {
        return this.cli
            .run(`overture -${this.type} workspace/${file}`)
            .then(data => this.parse(data));
    }

    bindToClient(socket) {
        socket.on('linter/lint', () => {
            this.lint("bom.vdmsl")
                .then(markers => socket.emit('linter/linted', markers))
        });
    }
}

module.exports = Linter;