var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_framework_1, aurelia_router_1) {
    var Welcome = (function () {
        function Welcome(config, router) {
            this.addedDynoViewRoute = false;
            this.config = config;
            this.theRouter = router;
            this.heading = "Welcome to the Aurelia Navigation App (VS/TS)!";
            this.firstName = "John";
            this.lastName = "Doe";
        }
        Object.defineProperty(Welcome.prototype, "fullName", {
            get: function () {
                return this.firstName + " " + this.lastName;
            },
            enumerable: true,
            configurable: true
        });
        Welcome.prototype.addDynamicRoute = function () {
            this.theRouter.addRoute({ route: "dyno-view", moduleId: "views/dyno-view", nav: true, title: "dyno-view" });
            this.theRouter.refreshNavigation();
        };
        Welcome.prototype.welcome = function () {
            alert("Welcome, " + this.fullName + "!");
        };
        Welcome = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.RouterConfiguration, aurelia_router_1.Router), 
            __metadata('design:paramtypes', [aurelia_router_1.RouterConfiguration, aurelia_router_1.Router])
        ], Welcome);
        return Welcome;
    })();
    exports.Welcome = Welcome;
});
//# sourceMappingURL=welcome.js.map