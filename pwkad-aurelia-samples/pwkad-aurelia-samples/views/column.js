define(["require", "exports", "./models"], function (require, exports, m) {
    var Column = (function () {
        function Column() {
            this.column = new m.Column(null, null, null);
        }
        Column.prototype.activate = function (col) {
            this.column.id = col.id;
            this.column.name = col.name;
            this.column.widgets = col.widgets;
            this.column.width = col.width;
        };
        Column.prototype.addWidget = function () {
            this.column.widgets.push(new m.Widget(null, null, null));
        };
        return Column;
    })();
    exports.Column = Column;
});
//# sourceMappingURL=column.js.map