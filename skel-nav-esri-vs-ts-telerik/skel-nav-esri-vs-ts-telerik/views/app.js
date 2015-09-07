define(["require", "exports"], function (require, exports) {
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Aurelia';
            config.map([
                { route: ['', 'welcome'], name: 'welcome', moduleId: './welcome', nav: true, title: 'Welcome' },
                { route: 'flickr', name: 'flickr', moduleId: './flickr', nav: true, title: 'Flickr' },
                { route: 'users', name: 'users', moduleId: './users', nav: true, title: 'Github Users' },
                { route: 'esri-map', name: 'esri-map', moduleId: './esri-map', nav: true, title: 'ESRI Map' },
                { route: 'child-router', name: 'child-router', moduleId: './child-router', nav: true, title: 'Child Router' }
            ]);
            this.router = router;
        };
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map