var Debugger = require('./debugger');

var debug = new Debugger();

var log = [];

debug.load("bom.vdmsl").then(r => {log.push(r); console.log(1)});
debug.setBreakpoint(23).then(r => {log.push(r); console.log(2)});
debug.listBreakpoints().then(r => {log.push(r); console.log(3)});
debug.getEnvironment().then(r => {log.push(r); console.log(4)});
debug.evaluate("Parts(1,bom)").then(r => {log.push(r); console.log(5)});
debug.getStackFrames().then(r => {log.push(r); console.log(log)});