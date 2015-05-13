if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'aurelia-framework', 'knockout'], function (require, exports, aurelia_framework_1, knockout_1) {
    var Knockout = (function () {
        function Knockout(element, ko) {
            var self = this;
            this.element = element;
            console.log(ko);
            this.heading = ko.observable('Welcome to the Aurelia Navigation App - With Knockout!');
            this.firstName = ko.observable('John');
            this.lastName = ko.observable('Doe');
            this.fullName = ko.computed(function () {
                return self.firstName() + ' ' + self.lastName();
            });
        }
        Knockout.prototype.welcome = function () {
            alert('Welcome, ' + this.firstName() + '!');
        };
        Knockout.prototype.attached = function () {
            console.log(this.element);
            knockout_1.default.applyBindings(this, document.querySelector('#knockout-template')[0]);
        };
        Knockout = __decorate([
            aurelia_framework_1.inject(Element, knockout_1.default)
        ], Knockout);
        return Knockout;
    })();
    exports.Knockout = Knockout;
});
//# sourceMappingURL=knockout.js.map