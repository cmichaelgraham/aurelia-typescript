define(["require", "exports"], function (require, exports) {
    var ChildRouter = (function () {
        function ChildRouter() {
            this.heading = 'Child Router';
        }
        ChildRouter.prototype.configureRouter = function (config, router) {
            config.map([
                { route: ['', 'welcome'], moduleId: './welcome', nav: true, title: 'Welcome' },
                { route: 'flickr', moduleId: './flickr', nav: true },
                { route: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
            ]);
            this.router = router;
        };
        return ChildRouter;
    })();
    exports.ChildRouter = ChildRouter;
});
