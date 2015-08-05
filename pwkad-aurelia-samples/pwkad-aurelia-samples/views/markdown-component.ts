import {customAttribute, inject} from 'aurelia-framework';
import showdown from 'showdown';

@customAttribute('markdown-component', null)
@inject(Element)
export class MarkdownComponent {
    element;
    converter;
  constructor(element) {
    console.log('hey!!!')
    this.element = element;
    console.log(element);
    // An instance of the converter
    this.converter = new showdown.converter();
  }

  valueChanged(newValue){
    this.element.innerHTML = this.converter.makeHtml(
      newValue.split('\n').map((line) => line.trim()).join('\n')
    );
    prism.highlightAll(this.element.querySelectorAll('code'));
  }
}
