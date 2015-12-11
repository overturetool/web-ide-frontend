'use strict';

var EventEmitter = require('events'),
    DbgpConnection = require('./dbgpConnection');

class DbgpDebugger extends EventEmitter {
    constructor(options) {
        super();
        // Initialize default options and override with options passed
        this.setDefaults();
        this.setOptions(options);

        // Create a new connection
        this.connection = new DbgpConnection(this);
    }

    setDefaults() {
        this.options = {
            port: 9000,
            showHidden: true,
            maxChildren: 32,
            maxData: 1024,
            maxDepth: 3,
            breakOnStart: false,
            includeContextOnBreak: true,
            includeSourceOnBreak: false,
            sourceOnBreakLines: 2, // lines before and after breakpoint
            includeGlobals: true
        };
    }

    setOptions(options) {
        for (let option in options) {
            this.options[option] = options[option];
        }
    }

    start() {
        return this.connection.listen(this.options.port);
    }

    run() {
        this.connection.sendCommand('run');
    }

    stepInto() {
        this.connection.sendCommand('step_into');
    }

    stepOver() {
        this.connection.sendCommand('step_over');
    }

    stepOut() {
        this.connection.sendCommand('step_out');
    }

    stop() {
        this.connection.sendCommand('stop');
    }

    getContext() {
        var that = this;

        return new Promise(function(resolve, reject) {
            if (!that.options.includeGlobals) {
                that.connection.sendCommand('context_get').then(function(response) {
                    resolve(response);
                });
            } else
            {
                Promise.all([
                    that.connection.sendCommand('context_get'),
                    that.connection.sendCommand('context_get', '-c 1')
                ]).then(function(results) {
                    var combinedContext = { context: { } };

                    for (let i in results) {
                        for (let j in results[i].context) {
                            combinedContext.context[j] = results[i].context[j];
                        }
                    }

                    resolve(combinedContext);
                });
            }
        });
    }

    getSource(file, startLine, endLine) {
        var that = this;

        return new Promise(function(resolve, reject) {
            var parameters = '-f ' + file;

            if (startLine)
                parameters += ' -b ' + startLine;

            if (endLine)
                parameters += ' -e ' + endLine;

            that.connection.sendCommand('source', parameters).then(function(response) {
                resolve(response);
            });
        });
    }
}

module.exports = DbgpDebugger;