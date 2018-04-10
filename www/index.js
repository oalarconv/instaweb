(function () {
    var startedHandler;

    function bindEvents() {
        var devicePromise = $.Deferred(), documentPromise = $.Deferred();
        if (window.cordova) {
            document.addEventListener('deviceready', function () {
                devicePromise.resolve();
            }, false);
        } else {
            devicePromise.resolve();
        }
        $(function () {
            documentPromise.resolve();
        });
        return $.when(devicePromise, documentPromise);
    }

    function onStarted(app) {
        if (startedHandler != null) {
            startedHandler(app);
        }
    }

    function start(appConf, appUrl) {
        if (window.StatusBar) {
            StatusBar.overlaysWebView(false);
        }

        var a = document.createElement('a');
        a.href = appUrl;

        var applicationOptions = {
            baseUrl: (a.protocol ? a.protocol + "//" : "") + a.host
        };

        var application = new AppPlayer.Application(appConf, applicationOptions);

        application.on("started", onStarted);
        application.run();

        window.app.instance = application;
    }

    function attachErrorHandler() {
        if (document.location.host.indexOf("localhost") === -1 && document.location.protocol !== "file:") {
            var _rollbarConfig = {
                accessToken: "e152c8beaf904ac9b85d8506f46b870d",
                captureUncaught: true,
                payload: {
                    environment: "production",
                    client: {
                        javascript: {
                            source_map_enabled: true,
                            code_version: 1,
                            // Optionally have Rollbar guess which frames the error was thrown from
                            // when the browser does not provide line and column numbers.
                            guess_uncaught_frames: true
                        }
                    }
                }
            };
        }
    }

    attachErrorHandler();

    function initialize(appUrl, _startedHandler) {
		console.time("initialize");
        startedHandler = _startedHandler;

        //TODO remove use application._loadFile instead
        var promises = $("script[type='text/html']")
            .toArray()
            .map(function (script) {
                if (script["src"]) {
                    var deffered = $.Deferred();
                    $.get(script["src"], function (tmpl) {
                        script["text"] = tmpl;
                        if (tmpl.indexOf('type="text/html"') !== -1) {
                            $(document.body).append(tmpl);
                        }
                        deffered.resolve();
                    })
                    return deffered.promise();
                }
            });

        var eventsPromise = bindEvents();
        promises.push(eventsPromise);
        if (AppPlayer.Utils.getQueryVariable("app")) {
            appUrl = AppPlayer.Utils.getQueryVariable("app");
        }
        var handleJsonLoaded = function (appConf) {
            $.when.apply($, promises)
                .then(function () {
					console.timeEnd("initialize");
                    start(appConf, appUrl);
                }, function (error) {
                    handleError(error);
                    debugger;
                });
        };

        $.getJSON(appUrl)
            .then(
                handleJsonLoaded,
                function () {
                    appUrl = "/app-conf.xapp";
                    $.getJSON(appUrl)
                        .then(
                            handleJsonLoaded,
                            function (error) {
                                appUrl = "app-conf.json";
                                $.getJSON(appUrl)
                                    .then(
                                        handleJsonLoaded,
                                        function (error) {
                                            var alertMessage = "Cannot load the application configuration.";
                                            if (error.status && error.statusText) {
                                                alertMessage += " Error:\r\n" + error.status + " (" + error.statusText + ")";
                                            }
                                            alert(alertMessage);
                                            debugger;
                                        });
                            });
                });
    }

    window.app = {
        initialize: initialize
    };
})();