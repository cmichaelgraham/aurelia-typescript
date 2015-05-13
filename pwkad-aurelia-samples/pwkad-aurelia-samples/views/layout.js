define(["require", "exports", './models'], function (require, exports, models_1) {
    var Layout = (function () {
        function Layout() {
            this.heading = 'Welcome to the Aurelia Layout App!';
            this.firstName = 'John';
            this.lastName = 'Doe';
            this.myDate = new Date();
            this.showing = false;
            this.yoHey = "hey";
            this.availableColumns = [
                new Option('1', '1 Column', [new models_1.Models.Column(0, 'Column 1', [new models_1.Models.Widget('1', 'Widget 1', '12')], '12')]),
                new Option('2', '2 Columns', [new models_1.Models.Column(1, 'Column 1', [new models_1.Models.Widget('1', 'Widget 1', '12')], '6'),
                    new models_1.Models.Column(2, 'Column 2', [new models_1.Models.Widget('2', 'Widget 2', '6'), new models_1.Models.Widget('4', 'Widget 4', '6')], '6')]),
                new Option('3', '3 Columns', [new models_1.Models.Column(1, 'Column 1', [new models_1.Models.Widget('1', 'Widget 1', '12')], '4'),
                    new models_1.Models.Column(2, 'Column 2', [new models_1.Models.Widget('2', 'Widget 2', '6'), new models_1.Models.Widget('4', 'Widget 4', '6')], '4'),
                    new models_1.Models.Column(3, 'Column 3', [new models_1.Models.Widget('3', 'Widget 3', '12')], '4')])
            ];
            this.selectedColumns = this.availableColumns[0];
        }
        Layout.prototype.getSomething = function (value) {
            return value.value ? value.value : value;
        };
        Layout.prototype.changeSomething = function () {
            this.yoHey = { value: 'hey yo' };
        };
        Layout.prototype.showModal = function () {
            this.showing = !this.showing;
        };
        return Layout;
    })();
    exports.Layout = Layout;
    var Option = (function () {
        function Option(id, name, cols) {
            this.id = id;
            this.name = name;
            this.columns = cols ? cols : [];
        }
        return Option;
    })();
});
//# sourceMappingURL=layout.js.map