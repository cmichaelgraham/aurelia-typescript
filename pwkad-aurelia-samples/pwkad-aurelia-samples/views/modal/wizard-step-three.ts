import {inject} from 'aurelia-framework';
import {Wizard} from './wizard';

@inject(Wizard)
export class WizardStepThree{
    wizard;
  constructor(wizard){
    this.wizard = wizard;
  }
}