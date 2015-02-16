import m = require("./models");
import sortable = require("sortable");

export class Column {
    public column: m.Column;
    public s: sortable;
    public el: HTMLDivElement;

    constructor() {
        this.column = new m.Column(null, null, null);
    }

    activate(col) {
        this.column.id = col.id;
        this.column.name = col.name;
        this.column.widgets = col.widgets;
        this.column.width = col.width;
    }

    addWidget() {
        this.column.widgets.push(new m.Widget(null, null, null));
    }

    attached() {
        console.log(this.el);
        this.s = new sortable(this.el, {
            animation: 150,
            draggable: ".widget-row",
            onUpdate: (evt) => {
                this.column.widgets.move(evt.newIndex, evt.oldIndex);
            }
        });
    }
}