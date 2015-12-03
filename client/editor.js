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

    if (info.gutterMarkers) {
        socket.emit('breakpoints/remove', n+1);
        cm.setGutterMarker(n, "breakpoints", null);
    } else {
        socket.emit('breakpoints/set', n+1);
        cm.setGutterMarker(n, "breakpoints", makeMarker());
    }
});

var terminal = document.getElementById('terminal');

socket.on('log', function (bps) {
    terminal.innerHTML += bps;
});

socket.emit('breakpoints/set', 23);