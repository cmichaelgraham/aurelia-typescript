define(["require", "exports", "aurelia-framework", "./MultiLevelMenuUtil"], function (require, exports, auf, mlmu) {
    var MultiLevelMenuHelper = (function () {
        function MultiLevelMenuHelper() {
        }
        MultiLevelMenuHelper.prototype.navigateUp = function () {
            mlmu.MultiLevelMenuUtil.goUp(this.router);
        };
        MultiLevelMenuHelper.metadata = auf.Behavior.withProperty("router");
        return MultiLevelMenuHelper;
    })();
    exports.MultiLevelMenuHelper = MultiLevelMenuHelper;
});
//# sourceMappingURL=multi-level-menu-helper.js.map