define(["require", "exports"], function (require, exports) {
    var Redirect = (function () {
        /**
          * Application redirect (works with approuter instead of current child router)
          *
          * @url the url to navigate to (ex: "#/home")
          */
        function Redirect(url) {
            this.url = url;
            this.shouldContinueProcessing = false;
        }
        Redirect.prototype.navigate = function (appRouter) {
            appRouter.navigate(this.url, { trigger: true, replace: true });
        };
        return Redirect;
    })();
    exports.Redirect = Redirect;
    var AppState = (function () {
        /**
          * Simple application state
          *
          */
        function AppState() {
            this.isAuthenticated = false;
        }
        AppState.prototype.login = function (username, password) {
            if (username == "Admin" && password == "xxx") {
                this.isAuthenticated = true;
                return true;
            }
            this.logout();
            return false;
        };
        AppState.prototype.logout = function () {
            this.isAuthenticated = false;
        };
        return AppState;
    })();
    var appState = new AppState();
    exports.state = appState;
});
//# sourceMappingURL=app-state.js.map