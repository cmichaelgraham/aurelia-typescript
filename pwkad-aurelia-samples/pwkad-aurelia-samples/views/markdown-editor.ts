import {customElement} from 'aurelia-framework';

@customElement('markdown-editor')
export class MarkdownEditor{
    mymarkdowntext;
  constructor(){
    this.mymarkdowntext = '#hey \n ##you';
  }
}
