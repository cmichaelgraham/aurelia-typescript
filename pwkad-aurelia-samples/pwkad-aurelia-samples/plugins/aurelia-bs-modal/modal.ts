import {inject, customElement, bindable} from 'aurelia-framework';

@customElement('modal')
@inject(Element)
export class Modal {
    @bindable showing = false;
    element;
    modal;
  constructor(element) {
    this.element = element;
  }
  attached(){
    (<any>$(this.modal)).modal({show: false});
  }
  showingChanged(newValue){
    if (newValue) {
        (<any>$(this.modal)).modal('show');
    } else {
        (<any>$(this.modal)).modal('hide');
    }
  }
}
