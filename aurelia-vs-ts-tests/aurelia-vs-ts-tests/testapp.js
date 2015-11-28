var origin = window.location["origin"];
var pathname = window.location.pathname;
var baseUrl = origin + pathname.toLowerCase().replace("index.html", "");
require.config({
    baseUrl: baseUrl,
    paths: {
        aurelia: baseUrl + "/scripts/aurelia",
        webcomponentsjs: baseUrl + "/scripts/webcomponentsjs",
        views: baseUrl + "/views",
        tests: baseUrl + "/tests",
        underscore: baseUrl + "/scripts/underscore/underscore.min",
        'core-js': baseUrl + "/scripts/core-js/client/core.min"
    },
    shim: {
        underscore: {
            exports: "_"
        }
    }
});
require(['aurelia/aurelia-bundle'], function (bundle) {
    require(["tests/test-runner"], function (testRunner) {
        testRunner.run();
        // Hai Jasmine - ready to go!
        jasmine.getEnv().execute();
    });
});
//# sourceMappingURL=testapp.js.map