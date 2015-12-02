var socket = io.connect(location.origin);

var editor = CodeMirror.fromTextArea(document.getElementById('editor'), {
    lineNumbers: true,
    gutters: ["CodeMirror-linenumbers", "breakpoints"]
});

function makeMarker() {
    var marker = document.createElement("div");
    marker.style.color = "#822";
    marker.innerHTML = "●";
    return marker;
}

editor.on("gutterClick", function(cm, n) {
    var info = cm.lineInfo(n);
    cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
});

socket.on('debugger/init', function (init) {
    console.log(init)
});

socket.on('breakpoints/list', function (bps) {
    console.log(bps)
});

socket.emit('breakpoints/list');