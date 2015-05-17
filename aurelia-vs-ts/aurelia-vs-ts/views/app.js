define(["require", "exports"], function (require, exports) {
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            config.title = "Aurelia demo";
            config.map([
                { route: ["", "home"], moduleId: "views/home", nav: true, title: "home" },
                { route: "login", moduleId: "views/login", nav: false, title: "login" },
                { route: "test", moduleId: "views/nav-test/nav-test", nav: true, title: "navigation test" },
                { route: "flickr", moduleId: "views/flickr/flickr", nav: true, title: "flickr" },
                { route: "admin", moduleId: "views/admin/admin", nav: true, title: "admin" }
            ]);
        };
        ;
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map