import auf = require("aurelia-framework");
import aur = require("aurelia-router");

export class MultiLevelMenuPipelineStep {
    run(routingContext: aur.NavigationContext, next: { (): void; cancel(): void; }) {
        routingContext.router.navigation[3].config.nav = false;
        routingContext.router.refreshNavigation();
        return next();
    }
} 