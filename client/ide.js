angular.module('ide', []);

angular.module('ide')
    .service('Server', function () {
        var socket = io.connect(location.origin);

        this.emit = function (event, value) {
            socket.emit(event, value);
        };

        this.on = function (event, listener) {
            socket.on(event, listener);
        };
    });

angular.module('ide')
    .directive('debug', function() {
        return {
            templateUrl: 'debug.html'
        }
    });

angular.module('ide')
    .directive('editor', function (Server) {
        return {
            template: '<textarea></textarea>',
            scope: {},
            replace: true,
            controllerAs: "editor",
            bindToController: true,
            controller: function ($element) {
                var editor = CodeMirror.fromTextArea($element[0], {
                    lineNumbers: true,
                    gutters: ["CodeMirror-linenumbers", "breakpoints"]
                });

                function makeMarker() {
                    var marker = document.createElement("div");
                    marker.style.color = "#822";
                    marker.innerHTML = "●";
                    return marker;
                }

                editor.on("gutterClick", function (cm, n) {
                    var info = cm.lineInfo(n);

                    if (info.gutterMarkers) {
                        Server.emit('breakpoints/remove', n + 1);
                        cm.setGutterMarker(n, "breakpoints", null);
                    } else {
                        Server.emit('breakpoints/set', n + 1);
                        cm.setGutterMarker(n, "breakpoints", makeMarker());
                    }
                });
            }
        }
    });

angular.module('ide')
    .directive('panelMenu', function() {
         return {
            replace: true,
            scope: {},
            transclude: true,
            template: '<div class="panel-menu" ng-transclude></div>',
            controllerAs: "menu",
            bindToController: true,
            controller: function () {

            }
        }
    });

angular.module('ide')
    .directive('panel', function () {
        return {
            replace: true,
            scope: {name: '@'},
            transclude: true,
            template: '<div class="panel" ng-class="{active: panel.active}"><div class="name" ng-click="panel.active = !panel.active">{{ panel.name }}</div><div ng-transclude class="pane"></div></div>',
            controllerAs: "panel",
            bindToController: true,
            controller: function () {

            }
        }
    });