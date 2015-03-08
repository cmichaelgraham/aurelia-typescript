define(["require", "exports", "aurelia-router", "scripts/app-state"], function (require, exports, aur, app) {
    var Login = (function () {
        function Login(theRouter) {
            this.theRouter = theRouter;
            this.heading = "aurelia login page";
            this.username = "Admin";
            this.password = "xxx";
            this.destination = "#/";
        }
        Login.prototype.activate = function (a, queryParams, c, d) {
            if (queryParams && queryParams.origin)
                this.destination = queryParams.origin;
        };
        Login.prototype.trylogin = function () {
            if (app.state.login(this.username, this.password))
                this.theRouter.navigate(this.destination, true);
            else
                alert("Access denied");
        };
        Login.inject = [aur.Router];
        return Login;
    })();
    exports.Login = Login;
});
//# sourceMappingURL=login.js.map