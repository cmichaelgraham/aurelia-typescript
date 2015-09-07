import {ListViewModel} from '../list-view-model';
import {inject, singleton} from 'aurelia-dependency-injection';
import {AppRouter} from 'aurelia-router';
import {EmployeeService} from './employee-service';

@inject(AppRouter, EmployeeService)
@singleton()
export class EmployeeList extends ListViewModel {
    constructor(router, service) {
        super('employees', router, service)
    }
}