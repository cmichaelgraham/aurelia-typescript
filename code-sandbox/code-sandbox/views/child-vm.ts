import m = require("views/my-child-vm");

export class ChildVM {
    public myChild: m.MyChildVM;

    constructor() {
        this.myChild = new m.MyChildVM("jhonny");
    }
} 