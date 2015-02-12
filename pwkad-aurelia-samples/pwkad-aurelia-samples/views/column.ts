import m = require("./models");

export class Column {
    public column: m.Column;

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
}