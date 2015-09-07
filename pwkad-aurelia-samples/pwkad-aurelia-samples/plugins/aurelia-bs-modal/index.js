define(["require", "exports"], function (require, exports) {
    function configure(aurelia) {
        aurelia.globalResources('./modal');
        aurelia.globalResources('./modal-header');
        aurelia.globalResources('./modal-body');
        aurelia.globalResources('./modal-footer');
        aurelia.globalResources('./au-button');
    }
    exports.configure = configure;
});
//# sourceMappingURL=index.js.map