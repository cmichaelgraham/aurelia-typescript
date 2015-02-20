define(["require", "exports"], function (require, exports) {
    var MultiLevelMenuPipelineStep = (function () {
        function MultiLevelMenuPipelineStep() {
        }
        MultiLevelMenuPipelineStep.prototype.run = function (routingContext, next) {
            routingContext.router.navigation[3].config.nav = false;
            routingContext.router.refreshNavigation();
            return next();
        };
        return MultiLevelMenuPipelineStep;
    })();
    exports.MultiLevelMenuPipelineStep = MultiLevelMenuPipelineStep;
});
//# sourceMappingURL=MultiLevelMenuPipelineStep.js.map