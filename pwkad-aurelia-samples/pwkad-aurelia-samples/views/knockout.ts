import {inject} from 'aurelia-framework';
import ko from 'knockout';

@inject(Element, ko)
export class Knockout{
    element;
    heading;
    firstName;
    lastName;
    fullName;
  constructor(element, ko){
    var self = this;
    this.element = element;
    console.log(ko);
    this.heading = ko.observable('Welcome to the Aurelia Navigation App - With Knockout!');
    this.firstName = ko.observable('John');
    this.lastName = ko.observable('Doe');
    this.fullName = ko.computed(function () {
      return self.firstName() + ' ' + self.lastName();
    });
  }

  welcome(){
    alert('Welcome, ' + this.firstName() + '!');
  }

  attached(){
    console.log(this.element);
    ko.applyBindings(this, document.querySelector('#knockout-template')[0]);
  }
}
