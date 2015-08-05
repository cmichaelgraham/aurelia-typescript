import {inject, bindable, customAttribute} from "aurelia-framework";

@customAttribute('focus', null)
@inject(Element)
export class Focus {
            //.withProperty('value', 'valueChanged', 'focus');
    element: HTMLElement;
    @bindable value;
    constructor(element: HTMLElement) {
        this.element = element;
    }

    valueChanged(value) {
        if (value) {
            this.element.focus();
        }
    }
}
 