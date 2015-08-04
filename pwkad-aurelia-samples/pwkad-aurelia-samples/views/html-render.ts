import {customElement, inject} from 'aurelia-framework';

@customElement('html-render')
@inject(Element)
export class HtmlRender{
    element;
    myhtml;
  constructor(element){
    this.element = element;
    this.myhtml = '<div class="container-fluid"><h2>HTML Render</h2><div class="row"><div class="col-sm-6" style="background: yellow; height: 100px;">Check out rendered HTML</div></div><div class="row"><div class="col-sm-6 col-sm-offset-6" style="background: whitesmoke; height: 100px;">Some more html content!</div></div></div>';
  }
}
