import {inject, customAttribute} from 'aurelia-framework';

@customAttribute('html-renderer', null)
@inject(Element)
export class HtmlRenderer {
    element;
  constructor(element) {
    this.element = element;
  }
  valueChanged(newValue){
    this.element.innerHTML = newValue;
  }
}
