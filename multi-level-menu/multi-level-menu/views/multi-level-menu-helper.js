define(["require", "exports", "aurelia-framework"], function (require, exports, auf) {
    var MultiLevelMenuHelper = (function () {
        function MultiLevelMenuHelper() {
            this.isNaving = false;
        }
        MultiLevelMenuHelper.prototype.navigateUp = function () {
            alert("MultiLevelMenuHelper: navigateUp");
        };
        MultiLevelMenuHelper.prototype.isNavingChanged = function (val) {
            alert("isNaving: " + val);
        };
        MultiLevelMenuHelper.metadata = [auf.Behavior.customElement("multi-level-menu-helper").withProperty("isNaving", "isNavingChanged", "multi-level-menu-helper")];
        return MultiLevelMenuHelper;
    })();
    exports.MultiLevelMenuHelper = MultiLevelMenuHelper;
});
//# sourceMappingURL=multi-level-menu-helper.js.map