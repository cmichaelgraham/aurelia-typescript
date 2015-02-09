define(["require", "exports"], function (require, exports) {
    var Column = (function () {
        function Column(id, name, widgets, width) {
            if (width === void 0) { width = "12"; }
            this.id = id;
            this.name = name;
            this.widgets = widgets;
            this.width = width;
        }
        return Column;
    })();
    exports.Column = Column;
    var Widget = (function () {
        function Widget(id, name, width) {
            if (width === void 0) { width = "12"; }
            this.id = id;
            this.name = name;
            this.width = width;
        }
        return Widget;
    })();
    exports.Widget = Widget;
});
//# sourceMappingURL=models.js.map