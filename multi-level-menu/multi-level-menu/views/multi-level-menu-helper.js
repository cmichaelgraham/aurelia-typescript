define(["require", "exports", "aurelia-framework"], function (require, exports, auf) {
    var MultiLevelMenuHelper = (function () {
        function MultiLevelMenuHelper() {
        }
        MultiLevelMenuHelper.prototype.navigateUp = function () {
            alert("MultiLevelMenuHelper: navigateUp");
        };
        MultiLevelMenuHelper.prototype.isNavigatingChanged = function (val) {
            alert("isNavigatingChanged: " + val);
        };
        MultiLevelMenuHelper.metadata = auf.Behavior.withProperty("router").withProperty("isNavigating", "isNavigatingChanged");
        return MultiLevelMenuHelper;
    })();
    exports.MultiLevelMenuHelper = MultiLevelMenuHelper;
});
//# sourceMappingURL=multi-level-menu-helper.js.map