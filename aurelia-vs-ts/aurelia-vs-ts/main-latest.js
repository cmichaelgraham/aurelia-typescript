var origin = window.location.origin;
var pathname = window.location.pathname;
var baseUrl = origin + pathname.toLowerCase().replace("index-latest.html", "");

require.config({
    baseUrl: baseUrl,
    paths: {
        aurelia: baseUrl + "/scripts/aurelia",
        webcomponentsjs: baseUrl + "/scripts/webcomponentsjs",
        views: baseUrl + "/views",
        underscore: baseUrl + "/scripts/underscore/underscore.min"
    },
    shim: {
        underscore: {
            exports: "_"
        }
    }
});

require(['aurelia/aurelia-bundle-latest']);