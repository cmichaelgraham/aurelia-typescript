define(["require", "exports"], function (require, exports) {
    var Home = (function () {
        function Home() {
            this.heading = "Welcome to Aurelia!";
            this.firstName = "John";
            this.lastName = "Doe";
        }
        Object.defineProperty(Home.prototype, "fullName", {
            get: function () {
                return this.firstName + " " + this.lastName;
            },
            enumerable: true,
            configurable: true
        });
        Home.prototype.welcome = function () {
            alert("Welcome, " + this.fullName + "!");
        };
        return Home;
    })();
    exports.Home = Home;
    var UpperValueConverter = (function () {
        function UpperValueConverter() {
        }
        UpperValueConverter.prototype.toView = function (value) {
            return value && value.toUpperCase();
        };
        return UpperValueConverter;
    })();
    exports.UpperValueConverter = UpperValueConverter;
});
//# sourceMappingURL=home.js.map