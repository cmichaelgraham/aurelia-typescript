import {inject} from 'aurelia-framework';
import {Wizard} from './wizard';

@inject(Wizard)
export class WizardStepTwo{
    wizard;
  constructor(wizard){
    this.wizard = wizard;
  }
}