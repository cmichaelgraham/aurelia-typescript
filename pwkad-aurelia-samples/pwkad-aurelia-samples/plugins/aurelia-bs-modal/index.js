define(["require", "exports"], function (require, exports) {
    function configure(aurelia) {
        aurelia.globalizeResources('./modal');
        aurelia.globalizeResources('./modal-header');
        aurelia.globalizeResources('./modal-body');
        aurelia.globalizeResources('./modal-footer');
        aurelia.globalizeResources('./au-button');
    }
    exports.configure = configure;
});
//# sourceMappingURL=index.js.map