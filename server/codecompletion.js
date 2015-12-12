"use strict";

var net = require('net');
var cp = require('child_process');

class CodeCompletion {
    constructor() {
        // TODO
    }

    attach(file, entry) {
        var cmd = `mvn exec:java -Dexec.mainClass="org.overture.codecompletion.runner" -Dexec.args="Hello"`;
        var options = {cwd: "/Users/kaspersaaby/Documents/projects/iha/codecompletion"};

        console.log("CodeCompletion.attach called");
        //this.proposals = cp.exec(cmd, options);

        //if (!this.server) {
        //    this.server = net.createServer(client => {
        //        client.on('data', this.parse);
        //        client.on('end', this.detach);
        //    });
        //
        //    this.server.listen(9000, "localhost", () => this.proposals = cp.exec(cmd, options));
        //} else {
        //    this.proposals = cp.exec(cmd, options);
        //}
    }

    parse() {
        console.log('CodeCompletion.parse called');
    }

    detach() {
        this.proposals.disconnect();
    }

    calc(args) {
        var res = args + ' (1)';
        return new Promise(resolve => {
            resolve(res);
        });
    }
}

module.exports = CodeCompletion;