define(["require", "exports"], function (require, exports) {
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .developmentLogging()
            .plugin('aurelia-bs-modal');
        aurelia.start().then(function (a) { return a.setRoot('views/app'); });
    }
    exports.configure = configure;
});
//# sourceMappingURL=main.js.map