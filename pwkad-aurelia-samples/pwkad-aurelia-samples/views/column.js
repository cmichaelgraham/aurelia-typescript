define(["require", "exports", "./models", "sortable"], function (require, exports, m, sortable) {
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
        Column.prototype.attached = function () {
            console.log(this.el);
            this.s = new sortable(this.el, {
                animation: 150,
                draggable: ".widget-row"
            });
        };
        return Column;
    })();
    exports.Column = Column;
});
//# sourceMappingURL=column.js.map