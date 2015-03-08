define(["require", "exports", "aurelia-router", "scripts/app-state"], function (require, exports, aur, app) {
    var Admin = (function () {
        function Admin(router, appRouter) {
            this.router = router;
            this.appRouter = appRouter;
            this.heading = "Admin";
            router.configure(function (config) {
                config.map([
                    { route: ["", "home"], moduleId: "views/admin/admin-home", nav: true, title: "home" },
                    { route: "profile", moduleId: "views/admin/admin-profile", nav: true, title: "profile" },
                    { route: "logout", moduleId: "views/admin/admin-logout", nav: true, title: "logout" }
                ]);
            });
        }
        Admin.prototype.canActivate = function () {
            if (app.state.isAuthenticated)
                return true;
            return new app.Redirect("#/login?origin=#/" + this.appRouter.history.fragment);
        };
        Admin.inject = [aur.Router, aur.AppRouter];
        return Admin;
    })();
    exports.Admin = Admin;
});
//# sourceMappingURL=admin.js.map