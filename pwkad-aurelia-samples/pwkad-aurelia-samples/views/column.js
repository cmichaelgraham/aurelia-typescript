define(["require", "exports", './models'], function (require, exports, models_1) {
    var Column = (function () {
        function Column() {
            this.column = new models_1.Models.Column();
        }
        Column.prototype.activate = function (col) {
            this.column.id = col.id;
            this.column.name = col.name;
            this.column.widgets = col.widgets;
            this.column.width = col.width;
        };
        Column.prototype.addWidget = function () {
            this.column.widgets.push(new models_1.Models.Widget());
        };
        Column.prototype.attached = function () {
            // console.log(this.sortable);
            // sortable.create(this.el, {
            //   animation: 150,
            //   draggable: '.widget-row',
            //   onEnd: (evt) => {
            //       this.column.widgets.move(evt.oldIndex, evt.newIndex);
            //       console.log(this.column.widgets);
            //   }
            // });
        };
        return Column;
    })();
    exports.Column = Column;
    Array.prototype.move = function (old_index, new_index) {
        var element = this[old_index];
        this.splice(old_index, 1);
        this.splice(new_index, 0, element);
    };
});
//# sourceMappingURL=column.js.map