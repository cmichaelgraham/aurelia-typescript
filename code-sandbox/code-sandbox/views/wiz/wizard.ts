import { Router, RouterConfiguration } from "aurelia-router";

export class Wizard {
    router: Router;
    configureRouter(config: RouterConfiguration, router: Router) {
        this.router = router;

        config.title = 'wiz router';
        config.map([
                { route: ["", "step-one"], moduleId: "./step-one", nav: true, title: "Step-one" },
                { route: ["step-two"], moduleId: "./step-two", nav: true, title: "Step-two" },
                { route: ["step-three"], moduleId: "./step-three", nav: true, title: "Step-three" },
                { route: ["step-four"], moduleId: "./step-four", nav: true, title: "Step-four" }
        ]);
    }

    getActiveRouteIndex() {
        for (var routeIndex in this.router.navigation) {
            var route = this.router.navigation[routeIndex];
            if (route.isActive) {
                return routeIndex;
            }
        }
    }

    next() {
        var currentIndex = this.getActiveRouteIndex();
        if (currentIndex < this.router.navigation.length - 1) {
            currentIndex++;
            this.router.navigate(this.router.navigation[currentIndex].config.route, true);
        }
    }

    prev() {
        var currentIndex = this.getActiveRouteIndex();
        if (currentIndex > 0) {
            currentIndex--;
            this.router.navigate(this.router.navigation[currentIndex].config.route, true);
        }
    }
} 