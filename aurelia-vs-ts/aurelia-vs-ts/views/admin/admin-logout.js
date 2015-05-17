if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", "aurelia-framework", "aurelia-router", "views/app-state"], function (require, exports, aurelia_framework_1, aurelia_router_1, app_state_1) {
    var AdminLogout = (function () {
        function AdminLogout(appState) {
            this.appState = appState;
            this.heading = "Logout";
        }
        AdminLogout.prototype.canActivate = function () {
            this.appState.logout();
            return new aurelia_router_1.Redirect("#/");
        };
        AdminLogout = __decorate([
            aurelia_framework_1.inject(app_state_1.AppState)
        ], AdminLogout);
        return AdminLogout;
    })();
    exports.AdminLogout = AdminLogout;
});
//# sourceMappingURL=admin-logout.js.map