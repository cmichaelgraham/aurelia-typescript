define(["require", "exports", 'breeze'], function (require, exports, b) {
    var Welcome = (function () {
        function Welcome() {
            this.heading = 'Welcome to the Aurelia Navigation App!';
            this.firstName = 'John';
            this.lastName = 'Doe';
        }
        Object.defineProperty(Welcome.prototype, "fullName", {
            //Getters can't be observed with Object.observe, so they must be dirty checked.
            //However, if you tell Aurelia the dependencies, it no longer needs to dirty check the property.
            //To optimize by declaring the properties that this getter is computed from, uncomment the line below.
            //@computedFrom('firstName', 'lastName')
            get: function () {
                return this.firstName + " " + this.lastName;
            },
            enumerable: true,
            configurable: true
        });
        Welcome.prototype.welcome = function () {
            alert("Welcome, " + this.fullName + "!");
        };
        Welcome.prototype.activate = function () {
            var query = new b.EntityQuery();
        };
        return Welcome;
    })();
    exports.Welcome = Welcome;
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
//# sourceMappingURL=welcome.js.map