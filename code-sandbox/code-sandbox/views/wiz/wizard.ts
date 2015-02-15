import auf = require("aurelia-framework");
import aur = require("aurelia-router");

export class Wizard {
    static inject = [aur.Router];

    constructor(public router: aur.Router) {
        router.configure(config => {
            config.title = "wiz router";
            config.map([
                { route: ["", "step-one"], moduleId: "./step-one", nav: true },
                { route: ["step-two"], moduleId: "./step-two", nav: true },
                { route: ["step-three"], moduleId: "./step-three", nav: true },
                { route: ["step-four"], moduleId: "./step-four", nav: true }
            ]);
        });
    }

    getActiveRouteIndex() {
        for (var routeIndex in this.router.navigation) {
            var route = this.router.navigation[routeIndex];
            if (route["isActive"]) {
                //alert("active[" + routeIndex + "]: " + route["config"]["route"]);
                return routeIndex;
            }
        }
    }

    next() {
        var currentIndex = this.getActiveRouteIndex();
        if (currentIndex < this.router.navigation.length - 1) {
            currentIndex++;
            this.router.navigate(this.router.navigation[currentIndex]["config"]["route"], true);
        }
    }

    prev() {
        var currentIndex = this.getActiveRouteIndex();
        if (currentIndex > 0) {
            currentIndex--;
            this.router.navigate(this.router.navigation[currentIndex]["config"]["route"], true);
        }
    }
} 