var socket = io.connect(location.origin);

var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    gutters: ["CodeMirror-linenumbers", "breakpoints"]
});