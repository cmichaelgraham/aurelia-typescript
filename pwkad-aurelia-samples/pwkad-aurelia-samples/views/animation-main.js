define(["require", "exports"], function (require, exports) {
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .developmentLogging()
            .plugin('aurelia-animator-css')
            .plugin('aurelia-bs-modal');
        aurelia.start().then(function (a) { return a.setRoot(); });
    }
    exports.configure = configure;
});
//# sourceMappingURL=animation-main.js.map