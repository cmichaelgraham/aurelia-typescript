import {inject} from 'aurelia-framework';
import {ParentElement} from './parent-element';

@inject(ParentElement)
export class ChildElement{
    parentelement;
  constructor(parentelement){
    this.parentelement = parentelement;
  }
}