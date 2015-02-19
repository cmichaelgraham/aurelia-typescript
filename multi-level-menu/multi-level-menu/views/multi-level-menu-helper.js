define(["require", "exports"], function (require, exports) {
    var MultiLevelMenuHelper = (function () {
        function MultiLevelMenuHelper() {
        }
        MultiLevelMenuHelper.prototype.navigateUp = function () {
            alert("MultiLevelMenuHelper: navigateUp");
        };
        return MultiLevelMenuHelper;
    })();
    exports.MultiLevelMenuHelper = MultiLevelMenuHelper;
});
//# sourceMappingURL=multi-level-menu-helper.js.map