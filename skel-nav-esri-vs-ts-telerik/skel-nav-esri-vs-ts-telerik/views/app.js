define(["require", "exports", "aurelia-router"], function (require, exports, aur) {
    var App = (function () {
        function App(router) {
            this.router = router;
            this.router.configure(function (config) {
                config.title = "Aurelia VS/TS";
                config.map([
                    { route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome to VS/TS" },
                    { route: "flickr", moduleId: "views/flickr", nav: true },
                    { route: "esri-map", moduleId: "views/esri-map", nav: true, title: "ESRI Map V1" },
                    { route: "child-router", moduleId: "views/child-router", nav: true, title: "Child Router" }
                ]);
            });
        }
        App.inject = [aur.Router];
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map