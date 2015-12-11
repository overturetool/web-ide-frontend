'use strict';

var cp = require('child_process'),
    EventEmitter = require('events'),
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

    bindToClient(socket) {
        socket.on('debug/start', options => this.start(options.file, options.entry));
        socket.on('debug/run', () => this.run().then(info => socket.emit('debug/status', info)));
        socket.on('debug/stop', () => this.stop());
        socket.on('debug/step-into', () => this.stepInto());
        socket.on('debug/step-out', () => this.stepOut());
        socket.on('debug/step-over', () => this.stepOver());
        socket.on('debug/set-breakpoint', line => this.setBreakpoint(line));
        socket.on('debug/remove-breakpoint', line => this.removeBreakpoint(line));

        this.on('started', info => {
            socket.emit('debug/started', info);
        });

        this.on('stopped', info => {
            socket.emit('debug/stopped', info);
            this.detach();
        });

        this.on('breakpoint', info => {
            socket.emit('debug/suspended', info);
        });

        // this.dbg.getContext().then(context => socket.emit('debug/context', context));
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
            includeGlobals: false
        };
    }

    setOptions(options) {
        for (let option in options) {
            this.options[option] = options[option];
        }
    }

    start(file, entry) {
        this.connection.listen(this.options.port)
            .then(() => {
                this.dbEngine = cp.exec(
                    `mvn exec:java -Dexec.mainClass="org.overture.interpreter.debug.DBGPReaderV2" -Dexec.args="-vdmsl -h localhost -p 9000 -k testKey -e \\\"${entry}\\\" ${file}"`,
                    {cwd: "/home/rsreimer/projects/Speciale/overture-dev/core/interpreter"}
                );
                this.dbEngine.stdout.on('data', data => console.log(['dbEngine out', data]))
                this.dbEngine.stderr.on('data', data => console.log(['dbEngine err', data]))
            })
    }

    run() {
        return this.connection.sendCommand('run');
    }

    stepInto() {
        return this.connection.sendCommand('step_into');
    }

    stepOver() {
        return this.connection.sendCommand('step_over');
    }

    stepOut() {
        return this.connection.sendCommand('step_out');
    }

    stop() {
        return this.connection.sendCommand('stop').then(() => this.dbEngine.disconnect());
    }

    setBreakpoint(line) {
        return this.connection.sendCommand('breakpoint_set', `-t line -n ${line}`);
    }

    getContext() {
        var that = this;

        return new Promise(function (resolve, reject) {
            if (!that.options.includeGlobals) {
                that.connection.sendCommand('context_get').then(function (response) {
                    resolve(response);
                });
            } else {
                Promise.all([
                    that.connection.sendCommand('context_get'),
                    that.connection.sendCommand('context_get', '-c 1')
                ]).then(function (results) {
                    var combinedContext = {context: {}};

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

        return new Promise(function (resolve, reject) {
            var parameters = '-f ' + file;

            if (startLine)
                parameters += ' -b ' + startLine;

            if (endLine)
                parameters += ' -e ' + endLine;

            that.connection.sendCommand('source', parameters).then(function (response) {
                resolve(response);
            });
        });
    }
}

module.exports = DbgpDebugger;