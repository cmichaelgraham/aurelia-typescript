import {Router} from 'aurelia-router';

export class MultiLevelMenuUtil {
    static setForTarget(router: Router, targetRouteIndex: number) {
        if (MultiLevelMenuUtil.targetHasChildren(router, targetRouteIndex)) {
            // hide them all, and then show the children
            MultiLevelMenuUtil.hideAll(router);

            // go down while next level & set each to visible
            var routeIndex = targetRouteIndex + 1;
            var route = router.navigation[routeIndex];
            var nextLevel = route.settings["level"];
            do {
                if (router.navigation[routeIndex].settings["level"] === nextLevel) {
                    router.navigation[routeIndex].settings["show"] = true;
                }
                routeIndex++;
            } while (routeIndex < router.navigation.length
                && router.navigation[routeIndex].settings["level"] >= nextLevel);
        } else {
            // hide them all, and then show the siblings
            MultiLevelMenuUtil.hideAll(router);

            // go up while level is not less than target's level
            var routeIndex = targetRouteIndex;
            var route = router.navigation[routeIndex];
            var currentLevel = route.settings["level"];
            while (routeIndex > 0
                && router.navigation[routeIndex - 1].settings["level"] >= currentLevel) {
                routeIndex--;
            };

            // go down while not less than target level & set each one at same level to visible
            do {
                if (router.navigation[routeIndex].settings["level"] === currentLevel) {
                    router.navigation[routeIndex].settings["show"] = true;
                }
                routeIndex++;
            } while (routeIndex < router.navigation.length
                && router.navigation[routeIndex].settings["level"] >= currentLevel);
        }
    }
    static goUp(router: Router) {
        // get current level
        var currentRouteIndex = MultiLevelMenuUtil.getActiveRouteIndex(router);
        var routeIndex = currentRouteIndex;
        var route = router.navigation[routeIndex];
        var currentLevel = route.settings["level"];
        var seekLevel = currentLevel - 1;

        // if it doesn't have children, we only want to go up one, otherwise, we want to go up two
        if (!MultiLevelMenuUtil.targetHasChildren(router, currentRouteIndex)) {
            seekLevel--;    
        }

        // go up until you get to the top or find a route with seekLevel
        while (routeIndex > 0
            && router.navigation[routeIndex - 1].settings["level"] > seekLevel) {
            routeIndex--;
        };

        router.navigate((<any>router).navigation[routeIndex].config.route, true);
    }
    static targetHasChildren(router: Router, targetRouteIndex: number) {
        var routeIndex = targetRouteIndex;
        var route = router.navigation[routeIndex];
        var currentLevel = route.settings["level"];

        if (routeIndex >= router.navigation.length - 1) {
            return false;
        }

        return (router.navigation[routeIndex + 1].settings["level"] > currentLevel);
    }
    static hideAll(router: Router) {
        for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
            var route = router.navigation[routeIndex];
            route.settings["show"] = false;
        }
    }
    static getTargetRouteIndex(router: Router, targetModuleId: string): number {
        for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
            var route = router.navigation[routeIndex];
            if ((<any>route).config.moduleId === targetModuleId) {
                return routeIndex;
            }
        }
        return 0;
    }
    static getActiveRouteIndex(router: Router): number {
        for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
            var route = router.navigation[routeIndex];
            if (route.isActive) {
                return routeIndex;
            }
        }
        return 0;
    }
} 