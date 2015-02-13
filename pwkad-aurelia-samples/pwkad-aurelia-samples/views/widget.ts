import m = require("./models");

export class Widget {
    public widget: m.Widget;

    constructor() {
        this.widget = new m.Widget(null, null, null);
    }

    activate(widget) {
        this.widget.id = widget.id;
        this.widget.name = widget.name;
        this.widget.width = widget.width;
        this.widget.offset = 12 - parseInt(widget.width);
    }

}