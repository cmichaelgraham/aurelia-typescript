define(["require", "exports", "./MultiLevelMenuUtil"], function (require, exports, MultiLevelMenuUtil_1) {
    // TODO: create a PR for aurelia-router adding router and plan properties to NavigationContext
    var MultiLevelMenuPipelineStep = (function () {
        function MultiLevelMenuPipelineStep() {
        }
        MultiLevelMenuPipelineStep.prototype.run = function (routingContext, next) {
            var targetRouteIndex = MultiLevelMenuUtil_1.MultiLevelMenuUtil.getTargetRouteIndex(routingContext.router, routingContext.plan.default.config.moduleId);
            MultiLevelMenuUtil_1.MultiLevelMenuUtil.setForTarget(routingContext.router, targetRouteIndex);
            return next();
        };
        return MultiLevelMenuPipelineStep;
    })();
    exports.MultiLevelMenuPipelineStep = MultiLevelMenuPipelineStep;
});
//# sourceMappingURL=MultiLevelMenuPipelineStep.js.map