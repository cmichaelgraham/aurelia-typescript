import {inject} from 'aurelia-framework';
import {Wizard} from './wizard';

@inject(Wizard)
export class WizardStepOne{
    wizard;
  constructor(wizard){
    this.wizard = wizard;
  }
}