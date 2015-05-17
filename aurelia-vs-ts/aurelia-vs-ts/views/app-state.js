define(["require", "exports"], function (require, exports) {
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
    exports.AppState = AppState;
});
//# sourceMappingURL=app-state.js.map