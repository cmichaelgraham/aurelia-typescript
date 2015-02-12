define(["require", "exports", "./models"], function (require, exports, m) {
    var Layout = (function () {
        function Layout() {
            this.heading = "Welcome to the PWKad Aurelia Samples App (VS/TS)!";
            this.firstName = "John";
            this.lastName = "Doe";
            this.availableColumns = [
                new Option('1', '1 Column', [new m.Column(0, 'Column 1', [new m.Widget('1', 'Widget 1', '12')], '12')]),
                new Option('2', '2 Columns', [new m.Column(1, 'Column 1', [new m.Widget('1', 'Widget 1', '12')], '6'), new m.Column(2, 'Column 2', [new m.Widget('2', 'Widget 2', '6'), new m.Widget('4', 'Widget 4', '6')], '6')]),
                new Option('2', '2 Columns', [new m.Column(1, 'Column 1', [new m.Widget('1', 'Widget 1', '12')], '4'), new m.Column(2, 'Column 2', [new m.Widget('2', 'Widget 2', '6'), new m.Widget('4', 'Widget 4', '6')], '4'), new m.Column(3, 'Column 3', [new m.Widget('3', 'Widget 3', '12')], '4')])
            ];
            this.selectedColumnOption = this.availableColumns[0];
            this.showing = false;
        }
        Layout.prototype.showModal = function () {
            this.showing = !this.showing;
        };
        return Layout;
    })();
    exports.Layout = Layout;
    var Option = (function () {
        function Option(id, name, columns) {
            this.id = id;
            this.name = name;
            this.columns = columns;
        }
        return Option;
    })();
});
//# sourceMappingURL=layout.js.map