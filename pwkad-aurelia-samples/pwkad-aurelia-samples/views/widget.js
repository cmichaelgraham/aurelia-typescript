define(["require", "exports", './models'], function (require, exports, models_1) {
    var Widget = (function () {
        function Widget() {
            this.widget = new models_1.Models.Widget();
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