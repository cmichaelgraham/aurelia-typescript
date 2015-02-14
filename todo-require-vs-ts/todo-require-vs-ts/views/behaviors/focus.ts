import auf = require("aurelia-framework");

export class Focus {
    static metadata() {
        return auf.Behavior
            .attachedBehavior('focus')
            .withProperty('value', 'valueChanged', 'focus');
    }

    static inject() { return [Element]; }
    constructor(public element: HTMLElement) {
        this.element = element;
    }

    valueChanged(value) {
        if (value) {
            this.element.focus();
        }
    }
}
 