import {bindable} from 'aurelia-framework';

export class AuButton{
  @bindable text = '';
  @bindable click = defaultClick;
}

function defaultClick(){
  console.log('Forgot to override your button click');
}
