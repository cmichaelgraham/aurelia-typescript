define(["require", "exports"], function (require, exports) {
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .developmentLogging()
            .plugin('aurelia-animator-css');
        aurelia.start().then(function (a) { return a.setRoot(); });
    }
    exports.configure = configure;
});
