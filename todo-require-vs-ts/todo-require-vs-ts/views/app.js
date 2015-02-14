define(["require", "exports", "aurelia-router"], function (require, exports, aur) {
    // import t = require("./todos");
    var App = (function () {
        function App(router) {
            this.router = router;
            this.router.configure(function (config) {
                config.title = "TodoMVC";
                config.map([
                    { route: ["", ":filter"], moduleId: "views/todos", nav: true }
                ]);
            });
        }
        App.inject = [aur.Router];
        return App;
    })();
    exports.App = App;
});
//# sourceMappingURL=app.js.map