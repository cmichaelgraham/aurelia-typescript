define(["require", "exports"], function (require, exports) {
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .plugin('aurelia-breeze')
            .developmentLogging();
        aurelia.loader.textPluginName = 'dojo/text';
        aurelia.start().then(function (a) { return a.setRoot('views/app'); });
    }
    exports.configure = configure;
});
//# sourceMappingURL=main.js.map