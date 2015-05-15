import auf = require("aurelia-framework");
import {NavigationContext} from "aurelia-router";
import {MultiLevelMenuUtil} from "./MultiLevelMenuUtil";

export class MultiLevelMenuPipelineStep {
    run(routingContext: NavigationContext, next: { (): void; cancel(): void; }) {
        var targetRouteIndex = MultiLevelMenuUtil.getTargetRouteIndex(routingContext.router, routingContext.plan.default.config.moduleId);
        MultiLevelMenuUtil.setForTarget(routingContext.router, targetRouteIndex);
        return next();
    }
}