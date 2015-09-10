define(["require", "exports"], function (require, exports) {
    var App = (function () {
        function App() {
        }
        App.prototype.configureRouter = function (config, router) {
            config.title = 'Aurelia';
            config.map([
                { route: ['', 'welcome'], moduleId: './welcome', nav: true, title: 'Welcome' },
                { route: 'employees', moduleId: './employee/employee-list', nav: true, title: 'Employees' },
                { route: 'employees2', moduleId: './direct/employee-list', nav: true, title: 'Employees2' },
                { route: 'image-test', moduleId: './employee/image-test', nav: true, title: 'Image Test' }
            ]);
            this.router = router;
        };
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map