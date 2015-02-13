define(["require", "exports", "./models"], function (require, exports, m) {
    var Widget = (function () {
        function Widget() {
            this.widget = new m.Widget(null, null, null);
        }
        Widget.prototype.activate = function (widget) {
            this.widget.id = widget.id;
            this.widget.name = widget.name;
            this.widget.width = widget.width;
            this.widget.offset = 12 - parseInt(widget.width);
        };
        return Widget;
    })();
    exports.Widget = Widget;
});
//# sourceMappingURL=widget.js.map