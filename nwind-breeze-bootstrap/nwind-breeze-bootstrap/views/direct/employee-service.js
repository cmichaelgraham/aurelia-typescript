define(["require", "exports", 'breeze', '../settings', '../entity-manager-factory'], function (require, exports, breeze, settings_1, entity_manager_factory_1) {
    var missingPhoto = 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACABAMAAAAxEHz4AAAAMFBMVEXFxcX19fX+/v7x8fHu7u7p6enl5eXh4eHc3NzZ2dnV1dXR0dHNzc3Jycn5+fnGxsbcfiHzAAACQ0lEQVR4Xu2Yz0obURTGxz+Nf2IyIcvSlswNmaixQxG6LIpLRRB9geAThO4KpUieQNy4kxBfQNoXCF103dJ9SWfTUiiOeQARXHhwvHf8zhfIxvnt8+Ny5nzn3BvvyZCTk5OTUzo9ePX77YfvrOBbbG6JPlIC/5O5409C/L5rBPNXbzgz9/inFfw0KXZ1gqU4LQh03+KzeUBLI1gwFnrEAdgjlIyNCK/ClbGyAQu27IIGWULhAhRcuwQVUNB1CVbAGBkXERapOePkCBJMuwVDLgfCGiQ4dAuakCB2CwIyCAISh/kswTEgKGQJOoBgNkuwCQimRMCloZwlGHKNKNQAwYgQECegazCJrzAzbh88yxK0J5GFJSSN/DxA2HcLQmImEgt6NO5ULgDzhB2KiQfx3iVY9gSqCJegYJ7rQ8FftwvqHsovu+C/CLg4DDyYvk2w6uHMkV0knHAXJKFIVkD4kRa89HT4qX4OE6Xg3KTYJn8vPCdeXLThi7Gy400ojcWqSxD0iCBA3Yjvxj0gyutZgvoA62E379iZLm8/7gDCi2yBX31MEAy4C5LwhlvtQgOchdyG/SoC6uFUihFBlABXRLKMXUywTHahkDhzCNLWXc/wLRmjggAehbrhWMYFFWAj64vgx7ggIksgHHOjQKhwSRRec7NECOEg4HFY0Al63CwQNtErOv6I7usELe4jCCGXZSEAvyL+hl3UCi7sbz2cDhYlfDlMawU1LIt4HvtaQQvbaviV8VAraGL/huMXlapOIM/YGwKj/drs5x+/AAAAAElFTkSuQmCC';
    var EmployeeService = (function () {
        function EmployeeService() {
        }
        EmployeeService.prototype.getPage = function (pageIndex) {
            var query = new breeze.EntityQuery()
                .from('Employees')
                .orderBy('LastName')
                .skip(pageIndex * settings_1.default.pageSize)
                .take(settings_1.default.pageSize)
                .inlineCount();
            return entity_manager_factory_1.createEntityManager()
                .then(function (em) { return em.executeQuery(query); })
                .then(function (queryResult) {
                for (var ii in queryResult.results) {
                    queryResult.results[ii].photoData = 'data:image/png;base64,' + (queryResult.results[ii].Photo || missingPhoto);
                }
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