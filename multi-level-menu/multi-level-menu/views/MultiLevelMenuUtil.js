define(["require", "exports"], function (require, exports) {
    var MultiLevelMenuUtil = (function () {
        function MultiLevelMenuUtil() {
        }
        MultiLevelMenuUtil.setForTarget = function (router, targetRouteIndex) {
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
                } while (routeIndex < router.navigation.length && router.navigation[routeIndex].settings["level"] >= nextLevel);
            }
            else {
                // hide them all, and then show the siblings
                MultiLevelMenuUtil.hideAll(router);
                // go up while level is not less than target's level
                var routeIndex = targetRouteIndex;
                var route = router.navigation[routeIndex];
                var currentLevel = route.settings["level"];
                while (routeIndex > 0 && router.navigation[routeIndex - 1].settings["level"] >= currentLevel) {
                    routeIndex--;
                }
                ;
                do {
                    if (router.navigation[routeIndex].settings["level"] === currentLevel) {
                        router.navigation[routeIndex].settings["show"] = true;
                    }
                    routeIndex++;
                } while (routeIndex < router.navigation.length && router.navigation[routeIndex].settings["level"] >= currentLevel);
            }
        };
        MultiLevelMenuUtil.goUp = function (router) {
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
            while (routeIndex > 0 && router.navigation[routeIndex - 1].settings["level"] > seekLevel) {
                routeIndex--;
            }
            ;
            router.navigate(router.navigation[routeIndex].config.route, true);
        };
        MultiLevelMenuUtil.targetHasChildren = function (router, targetRouteIndex) {
            var routeIndex = targetRouteIndex;
            var route = router.navigation[routeIndex];
            var currentLevel = route.settings["level"];
            if (routeIndex >= router.navigation.length - 1) {
                return false;
            }
            return (router.navigation[routeIndex + 1].settings["level"] > currentLevel);
        };
        MultiLevelMenuUtil.hideAll = function (router) {
            for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
                var route = router.navigation[routeIndex];
                route.settings["show"] = false;
            }
        };
        MultiLevelMenuUtil.getTargetRouteIndex = function (router, targetModuleId) {
            for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
                var route = router.navigation[routeIndex];
                if (route.config.moduleId === targetModuleId) {
                    return routeIndex;
                }
            }
            return 0;
        };
        MultiLevelMenuUtil.getActiveRouteIndex = function (router) {
            for (var routeIndex = 0; routeIndex < router.navigation.length; routeIndex++) {
                var route = router.navigation[routeIndex];
                if (route.isActive) {
                    return routeIndex;
                }
            }
            return 0;
        };
        return MultiLevelMenuUtil;
    })();
    exports.MultiLevelMenuUtil = MultiLevelMenuUtil;
});
//# sourceMappingURL=MultiLevelMenuUtil.js.map