define(["require", "exports", "aurelia-router"], function (require, exports, aurelia_router_1) {
    var Welcome = (function () {
        function Welcome(router) {
            this.router = router;
            this.heading = "Child Router";
            router.configure(function (config) {
                config.map([
                    { route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome" },
                    { route: "flickr", moduleId: "views/flickr", nav: true },
                    { route: "child-router", moduleId: "views/child-router", nav: true, title: "Child Router" }
                ]);
            });
        }
        Welcome.inject = [aurelia_router_1.Router];
        return Welcome;
    })();
    exports.Welcome = Welcome;
});
