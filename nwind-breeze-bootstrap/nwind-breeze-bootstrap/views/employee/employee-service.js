define(["require", "exports", 'breeze', '../settings', '../entity-manager-factory'], function (require, exports, breeze, settings_1, entity_manager_factory_1) {
    var EmployeeService = (function () {
        function EmployeeService() {
        }
        EmployeeService.prototype.getPage = function (pageIndex) {
            var query = new breeze.EntityQuery()
                .from('Employees')
                .select('EmployeeID, FirstName, LastName, Title, HireDate, HomePhone, Extension')
                .orderBy('LastName')
                .skip(pageIndex * settings_1.default.pageSize)
                .take(settings_1.default.pageSize)
                .inlineCount();
            return entity_manager_factory_1.createEntityManager()
                .then(function (em) { return em.executeQuery(query); })
                .then(function (queryResult) {
                return {
                    entities: queryResult.results,
                    pageCount: 1,
                };
            });
        };
        EmployeeService.prototype.loadExisting = function (id) {
            var employeeQuery = new breeze.EntityQuery().from('Employees').where('EmployeeID', '==', id);
            return entity_manager_factory_1.createEntityManager()
                .then(function (em) { return em.executeQuery(employeeQuery); })
                .then(function (queryResult) {
                return {
                    entity: queryResult.results[0],
                    entityManager: queryResult.entityManager
                };
            });
        };
        EmployeeService.prototype.createNew = function () {
            return entity_manager_factory_1.createEntityManager()
                .then(function (em) {
                return {
                    entity: em.createEntity('Employee'),
                    entityManager: em
                };
            });
        };
        return EmployeeService;
    })();
    exports.EmployeeService = EmployeeService;
});
//# sourceMappingURL=employee-service.js.map