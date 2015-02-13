import m = require("./models");

export class Layout {
    public showing: boolean;

    constructor() {
        this.showing = true;
    }

    showModal() {
        this.showing = !this.showing;
    }
}

class Option {
    constructor(public id, public name, public columns) {
    }
} 