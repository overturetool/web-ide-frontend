'use strict';

var xml2js = require('xml2js'),
    util = require('util');

class DbgpResponse {
    constructor(debug, connection, response) {
        this.debug = debug;
        this.connection = connection;
        this.response = response;
    }

    process() {
        var data = this.response;

        // Strip everything before the xml tag
        data = data.substr(data.indexOf('<?xml'));

        // Initialize XML parser
        var parser = new xml2js.Parser({
            attrkey: 'attributes',
            explicitChildren: true,
            childkey: 'children',
            charsAsChildren: false,
            charkey: 'content',
            explicitCharkey: true,
            explicitArray: false
        });

        parser.parseString(data, (err, result) => {
            if (err) return;

            if (result.init)
                return this.processInitResponse(result);

            if (!result.response || !result.response.attributes.command) return;

            switch (result.response.attributes.command) {
                case 'feature_set':
                    this.processFeatureSetResponse(result);
                    break;

                case 'run':
                case 'step_into':
                case 'step_over':
                case 'step_out':
                    this.processRunResponse(result);
                    break;

                case 'context_get':
                    this.processContextResponse(result);
                    break;

                case 'source':
                    this.processSourceResponse(result);
                    break;

                case 'stop':
                    this.processStopResponse(result);
                    break;
            }
        });
    }

    processInitResponse(response) {
        // Send attached event
        this.debug.emit('started', {
            file: this.replaceFileUri(response.init.attributes.fileuri)
        });

        // Send our supported features to the server
        this.connection.sendFeatures();

        if (!this.debug.options.breakOnStart)
            this.debug.run();
    }

    processFeatureSetResponse(response) {
        var transactionId = this.getTransactionId(response);
        this.resolveCommandPromise(transactionId, {transactionId: transactionId});
    }

    processStopResponse(response) {
        if (response.response.attributes.status != 'stopped')
            return;

        var transactionId = this.getTransactionId(response);
        this.resolveCommandPromise(transactionId, {transactionId: transactionId});

        this.connection.close();
    }

    processRunResponse(response) {
        var transactionId = this.getTransactionId(response);
        this.resolveCommandPromise(transactionId, {transactionId: transactionId});

        // Run command returns a status
        switch (response.response.attributes.status) {
            case 'break':
                this.onBreakpoint(response);
                break;

            case 'stopping':
            case 'stopped':
                this.connection.close();
                break;
        }
    }

    onBreakpoint(response) {
        var breakpoint = {
            file: this.replaceFileUri(response.response.children['xdebug:message'].attributes.filename),
            line: parseInt(response.response.children['xdebug:message'].attributes.lineno)
        };

        if (!this.debug.options.includeContextOnBreak && !this.debug.options.includeSourceOnBreak)
            return this.debug.emit('breakpoint', breakpoint);

        var breakpointPromises = [];

        if (this.debug.options.includeContextOnBreak) {
            breakpointPromises.push(this.debug.getContext());
        }

        if (this.debug.options.includeSourceOnBreak) {
            // Calculate what lines to request
            var filename = response.response.children['xdebug:message'].attributes.filename;
            var startLine = false;
            var endLine = false;

            if (this.debug.options.sourceOnBreakLines > 0) {
                startLine = breakpoint.line - this.debug.options.sourceOnBreakLines;
                endLine = breakpoint.line + this.debug.options.sourceOnBreakLines;
            }

            breakpointPromises.push(this.debug.getSource(filename, startLine, endLine));
        }

        Promise.all(breakpointPromises).then(results => {
            for (let i in results) {
                if (results[i].context)
                    breakpoint.context = results[i].context;

                if (results[i].source)
                    breakpoint.source = results[i].source;
            }

            this.debug.emit('breakpoint', breakpoint);
        });
    }

    processContextResponse(response) {
        var transactionId = this.getTransactionId(response);

        // Format context
        var context = {};

        if (Array.isArray(response.response.children.property)) {
            for (let i in response.response.children.property) {
                let currentVar = response.response.children.property[i];
                context[currentVar.attributes.name] = this.formatContextVariable(currentVar);
            }
        } else {
            let currentVar = response.response.children.property;
            context[currentVar.attributes.name] = this.formatContextVariable(currentVar);
        }


        this.resolveCommandPromise(transactionId, {
            transactionId: transactionId,
            context: context
        });
    }

    formatContextVariable(variable) {
        var formattedVariable = {};

        formattedVariable.name = variable.attributes.name;
        formattedVariable.fullName = variable.attributes.fullname;
        formattedVariable.type = variable.attributes.type;

        if (variable.content) {
            if (variable.attributes.encoding == 'base64') {
                formattedVariable.value = this.base64decode(variable.content);
            } else {
                formattedVariable.value = variable.content;
            }
        }

        if (variable.attributes.classname)
            formattedVariable.className = variable.attributes.classname;

        if (variable.children) {
            formattedVariable.numChildren = parseInt(variable.attributes.numchildren);
            formattedVariable.children = [];

            if (Array.isArray(variable.children.property)) {
                for (let i in variable.children.property) {
                    formattedVariable.children.push(this.formatContextVariable(variable.children.property[i]));
                }
            } else {
                formattedVariable.children.push(this.formatContextVariable(variable.children.property));
            }
        }

        return formattedVariable;
    }

    processSourceResponse(response) {
        var transactionId = this.getTransactionId(response);

        var source = this.base64decode(response.response.content);

        this.resolveCommandPromise(transactionId, {
            transactionId: transactionId,
            source: source
        });
    }

    // Resolves the promise that marks the command as responded to
    resolveCommandPromise(transactionId, data) {
        if (this.connection.commandQueue[transactionId])
            this.connection.commandQueue[transactionId].resolve(data);
    }

    // Util functions
    replaceFileUri(uri) {
        return uri.replace('file://', '');
    }

    base64decode(string) {
        return new Buffer(string, 'base64').toString('utf8');
    }

    getTransactionId(response) {
        return parseInt(response.response.attributes.transaction_id);
    }
}

module.exports = DbgpResponse;