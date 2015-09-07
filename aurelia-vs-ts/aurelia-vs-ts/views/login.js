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
    var Login = (function () {
        function Login(router, appState) {
            this.router = router;
            this.appState = appState;
            this.heading = "aurelia login page";
            this.username = "Admin";
            this.password = "xxx";
            this.destination = "#/";
        }
        Login.prototype.activate = function (a, b, c, d) {
            if (c && c.queryParams && c.queryParams.origin)
                this.destination = c.queryParams.origin;
        };
        Login.prototype.trylogin = function () {
            if (this.appState.login(this.username, this.password))
                this.router.navigate(this.destination, true);
            else
                alert("Access denied");
        };
        Login = __decorate([
            aurelia_framework_1.inject(aurelia_router_1.Router, app_state_1.AppState), 
            __metadata('design:paramtypes', [aurelia_router_1.Router, app_state_1.AppState])
        ], Login);
        return Login;
    })();
    exports.Login = Login;
});
//# sourceMappingURL=login.js.map