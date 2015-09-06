import {inject} from 'aurelia-framework';
import {ParentElement} from 'views/sharing-state/parent-element';

@inject(ParentElement)
export class ChildElement{
    parentelement;
  constructor(parentelement){
    this.parentelement = parentelement;
  }
}