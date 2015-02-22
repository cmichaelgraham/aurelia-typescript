import aur = require("aurelia-router");

export class MultiLevelMenuUtil {
    static setForTarget(router: aur.Router, targetRouteIndex: number) {
        if (MultiLevelMenuUtil.targetHasChildren(router, targetRouteIndex)) {
            // hide them all, and then show the children
            MultiLevelMenuUtil.hideAll(router);

            // go down while next level & set each to visible
            var routeIndex = targetRouteIndex + 1;
            var route = router.navigation[routeIndex];
            var nextLevel = route.settings["level"];
            do {
                router.navigation[routeIndex].settings["show"] = true;
                routeIndex++;
            } while (routeIndex < router.navigation.length
                && router.navigation[routeIndex].settings["level"] === nextLevel);
        } else {
            // hide them all, and then show the siblings
            // MultiLevelMenuUtil.hideAll;

            // go up while same level

            // go down while same level & set each to visible
        }
    }
    static goUp(router: aur.Router, targetRouteIndex: number) {
    }
    static targetHasChildren(router: aur.Router, targetRouteIndex: number) {
        var routeIndex = targetRouteIndex;
        var route = router.navigation[routeIndex];
        var currentLevel = route.settings["level"];

        if (routeIndex >= router.navigation.length) {
            return false;
        }

        return (router.navigation[routeIndex + 1].settings["level"] > currentLevel);
    }
    static hideAll(router: aur.Router) {
        for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
            var route = router.navigation[routeIndex];
            route.settings["show"] = false;
        }
    }
    static getTargetRouteIndex(router: aur.Router, targetModuleId: string): number {
        for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
            var route = router.navigation[routeIndex];
            if (route.config.moduleId === targetModuleId) {
                return routeIndex;
            }
        }
        return 0;
    }
    static getActiveRouteIndex(router: aur.Router): number {
        for (var routeIndex in router.navigation) {
            var route = router.navigation[routeIndex];
            if (route.isActive) {
                return routeIndex;
            }
        }
        return 0;
    }

} 