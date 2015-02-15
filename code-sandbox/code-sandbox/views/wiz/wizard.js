define(["require", "exports", "aurelia-router"], function (require, exports, aur) {
    var Wizard = (function () {
        function Wizard(router) {
            this.router = router;
            router.configure(function (config) {
                config.title = "wiz router";
                config.map([
                    { route: ["", "step-one"], moduleId: "./step-one", nav: true }
                ]);
            });
        }
        Wizard.inject = [aur.Router];
        return Wizard;
    })();
    exports.Wizard = Wizard;
});
//# sourceMappingURL=wizard.js.map