define(["require", "exports", "./MultiLevelMenuUtil"], function (require, exports, mlmu) {
    var MultiLevelMenuPipelineStep = (function () {
        function MultiLevelMenuPipelineStep() {
        }
        MultiLevelMenuPipelineStep.prototype.run = function (routingContext, next) {
            var targetRouteIndex = mlmu.MultiLevelMenuUtil.getTargetRouteIndex(routingContext.router, routingContext.plan.default.config.moduleId);
            mlmu.MultiLevelMenuUtil.setForTarget(routingContext.router, targetRouteIndex);
            return next();
        };
        return MultiLevelMenuPipelineStep;
    })();
    exports.MultiLevelMenuPipelineStep = MultiLevelMenuPipelineStep;
});
//# sourceMappingURL=MultiLevelMenuPipelineStep.js.map