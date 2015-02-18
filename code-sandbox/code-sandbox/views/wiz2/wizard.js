define(["require", "exports", "aurelia-router"], function (require, exports, aur) {
    var Wizard = (function () {
        function Wizard(router) {
            this.router = router;
            router.configure(function (config) {
                config.title = "wiz router";
                config.map([
                    { route: ["", "step-one"], moduleId: "./step-one", nav: true, title: "Step-one" },
                    { route: ["step-two"], moduleId: "./step-two", nav: true },
                    { route: ["step-three"], moduleId: "./step-three", nav: true },
                    { route: ["step-four"], moduleId: "./step-four", nav: true }
                ]);
            });
        }
        Wizard.prototype.getActiveRouteIndex = function () {
            for (var routeIndex in this.router.navigation) {
                var route = this.router.navigation[routeIndex];
                if (route.isActive) {
                    return routeIndex;
                }
            }
        };
        Wizard.prototype.next = function () {
            var currentIndex = this.getActiveRouteIndex();
            if (currentIndex < this.router.navigation.length - 1) {
                currentIndex++;
                this.router.navigate(this.router.navigation[currentIndex].config.route, true);
            }
        };
        Wizard.prototype.prev = function () {
            var currentIndex = this.getActiveRouteIndex();
            if (currentIndex > 0) {
                currentIndex--;
                this.router.navigate(this.router.navigation[currentIndex].config.route, true);
            }
        };
        Wizard.inject = [aur.Router];
        return Wizard;
    })();
    exports.Wizard = Wizard;
});
//# sourceMappingURL=wizard.js.map