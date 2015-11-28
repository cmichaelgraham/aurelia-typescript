var origin = window.location.origin;
var pathname = window.location.pathname;
var baseUrl = origin + pathname.toLowerCase().replace("index-release.html", "");

require.config({
    baseUrl: baseUrl,
    paths: {
        aurelia: baseUrl + "/scripts/aurelia",
        views: baseUrl + "/views",
        webcomponentsjs: baseUrl + "/scripts/webcomponentsjs",
        underscore: baseUrl + "/scripts/underscore/underscore.min",
        'core-js': baseUrl + "/scripts/core-js/client/core.min"
    },
    shim: {
        underscore: {
            exports: "_"
        }
    }
});

require(["aurelia/aurelia-bundle"], function (au) {
    require(["aurelia-bootstrapper"], function (b) {
    });
});
