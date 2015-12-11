CodeMirror.linter = function(cm, callback, options) {
    var text = cm.getValue();

    if(text.trim() == "")
    {
        callback(cm, []);
        return;
    }

    options.lint(text, function (markers) {
        callback(cm, markers.map(function(marker) {
            return {
                from: CodeMirror.Pos(start_line - 1, start_char),
                to: CodeMirror.Pos(end_line - 1, end_char),
                message: message,
                severity: severity
            }
        }));
    });
};