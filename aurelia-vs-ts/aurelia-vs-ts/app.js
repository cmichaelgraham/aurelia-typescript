define(["require", "exports", "aurelia-router"], function (require, exports, aur) {
    var App = (function () {
        function App(router) {
            this.router = router;
            this.router.configure(function (config) {
                config.title = "Aurelia demo";
                config.map([
                    { route: ["", "home"], moduleId: "views/home", nav: true, title: "home" },
                    { route: "login", moduleId: "views/login", nav: false, title: "login" },
                    { route: "test", moduleId: "views/nav-test/nav-test", nav: true, title: "navigation test" },
                    { route: "flickr", moduleId: "views/flickr/flickr", nav: true, title: "flickr" },
                    { route: "admin", moduleId: "views/admin/admin", nav: true, title: "admin" }
                ]);
            });
        }
        App.inject = [aur.Router];
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map