import auf = require("aurelia-framework");

export class Modal {
    public modal: ModalObject;
    public toggle: boolean;
    public showing: boolean;

    static metadata() {
        return auf.Behavior
            .customElement('modal')
            .withProperty('showing', 'valueChanged', 'modal');
    }

    constructor() {
        this.modal = new ModalObject(false);
    }

    toggleShowing() {
        console.log(this.showing);
        this.showing = !this.showing;
    }

    activate(value) {
        console.log(value);

        this.toggle = value.toggle;
        this.showing = value.showing;
    }

    showingChanged(hey) {
        console.log('hey you - ', hey);
    }
}

class ModalObject {
    constructor(public showing) { }
} 