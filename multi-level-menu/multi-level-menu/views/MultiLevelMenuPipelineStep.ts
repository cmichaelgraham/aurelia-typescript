import auf = require("aurelia-framework");
import aur = require("aurelia-router");
import mlmu = require("./MultiLevelMenuUtil");

export class MultiLevelMenuPipelineStep {
    run(routingContext: aur.NavigationContext, next: { (): void; cancel(): void; }) {
        var targetRouteIndex = mlmu.MultiLevelMenuUtil.getTargetRouteIndex(routingContext.router, routingContext.plan.default.config.moduleId);
        mlmu.MultiLevelMenuUtil.setForTarget(routingContext.router, targetRouteIndex);
        return next();
    }
}