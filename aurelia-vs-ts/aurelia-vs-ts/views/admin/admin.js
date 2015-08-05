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
define(["require", "exports", "aurelia-framework", "aurelia-router", "views/app-state"], function (require, exports, aurelia_framework_1, aurelia_router_1, app_state_1) {
    var Admin = (function () {
        function Admin(appRouter, appState) {
            this.heading = "Admin";
            this.appRouter = appRouter;
            this.appState = appState;
        }
        Admin.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.map([
                { route: ["", "home"], moduleId: "views/admin/admin-home", nav: true, title: "home" },
                { route: "profile", moduleId: "views/admin/admin-profile", nav: true, title: "profile" },
                { route: "logout", moduleId: "views/admin/admin-logout", nav: true, title: "logout" }
            ]);
        };
        ;
        Admin.prototype.canActivate = function () {
            if (this.appState.isAuthenticated)
                return true;
            return new aurelia_router_1.Redirect("#/login?origin=#/" + this.appRouter.history.fragment, {});
        };
        Admin = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router, app_state_1.AppState), 
            __metadata('design:paramtypes', [aurelia_router_1.Router, app_state_1.AppState])
        ], Admin);
        return Admin;
    })();
    exports.Admin = Admin;
});
//# sourceMappingURL=admin.js.map