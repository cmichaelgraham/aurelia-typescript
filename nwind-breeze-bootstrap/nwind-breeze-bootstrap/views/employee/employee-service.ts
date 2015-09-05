import * as breeze from 'breeze';
import settings from '../settings';
import {createEntityManager} from '../entity-manager-factory';

export class EmployeeService {
    getPage(pageIndex) {
        var query = new (<any>breeze).EntityQuery()
            .from('Employees')
            .select('EmployeeID, FirstName, LastName, Title, HireDate, HomePhone, Extension')
            .orderBy('LastName')
            .skip(pageIndex * settings.pageSize)
            .take(settings.pageSize)
            .inlineCount();

        return createEntityManager()
            .then(em => em.executeQuery(query))
            .then(queryResult => {
                return {
                    entities: queryResult.results,
                    pageCount: 1, //Math.ceil(queryResult.inlineCount / this.pageSize);
                };
            });
    }

    loadExisting(id) {
        var employeeQuery = new (<any>breeze).EntityQuery().from('Employees').where('EmployeeID', '==', id);

        return createEntityManager()
            .then(em => em.executeQuery(employeeQuery))
            .then(queryResult => {
                return {
                    entity: queryResult.results[0],
                    entityManager: queryResult.entityManager
                };
            });
    }

    createNew() {
        return createEntityManager()
            .then(em => {
                return {
                    entity: em.createEntity('Employee'),
                    entityManager: em
                };
            });
    }
}