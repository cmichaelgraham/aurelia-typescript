define(["require", "exports"], function (require, exports) {
    var Column = (function () {
        function Column(id, name, widgets, width) {
            this.id = id;
            this.name = name;
            this.widgets = widgets;
            this.width = width ? width : '12';
        }
        return Column;
    })();
    var Widget = (function () {
        function Widget(id, name, width) {
            this.id = id;
            this.name = name;
            this.width = width ? width : '12';
        }
        return Widget;
    })();
    var Models = { Column: Column, Widget: Widget };
    exports.Models = Models;
});
//# sourceMappingURL=models.js.map