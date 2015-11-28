import {MultiLevelMenuUtil} from "./MultiLevelMenuUtil";

// TODO: create a PR for aurelia-router adding router and plan properties to NavigationContext
export class MultiLevelMenuPipelineStep {
    run(routingContext, next: { (): void; cancel(): void; }) {
        var targetRouteIndex = MultiLevelMenuUtil.getTargetRouteIndex((<any>routingContext).router, (<any>routingContext).plan.default.config.moduleId);
        MultiLevelMenuUtil.setForTarget((<any>routingContext).router, targetRouteIndex);
        return next();
    }
}