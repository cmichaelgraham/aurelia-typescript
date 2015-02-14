define(["require", "exports", "./todo-item", "underscore"], function (require, exports, t, _) {
    var STORAGE_NAME = 'todomvc-aurelia';
    var Todos = (function () {
        function Todos(items, filteredItems, filter, newTodoTitle, areAllChecked) {
            if (items === void 0) { items = []; }
            if (filteredItems === void 0) { filteredItems = []; }
            if (filter === void 0) { filter = ""; }
            if (newTodoTitle === void 0) { newTodoTitle = null; }
            if (areAllChecked === void 0) { areAllChecked = false; }
            this.items = items;
            this.filteredItems = filteredItems;
            this.filter = filter;
            this.newTodoTitle = newTodoTitle;
            this.areAllChecked = areAllChecked;
            this.load();
        }
        Todos.prototype.activate = function (params) {
            this.updateFilteredItems(params.filter);
        };
        Todos.prototype.addNewTodo = function (title) {
            var _this = this;
            if (title === void 0) { title = this.newTodoTitle; }
            if (title == undefined)
                return;
            title = title.trim();
            if (title.length == 0)
                return;
            var newTodoItem = new t.TodoItem(title);
            Object["observe"](newTodoItem, function (ev) { return _this.onItemChanged(ev); });
            this.items.push(newTodoItem);
            this.newTodoTitle = null;
            this.updateFilteredItems(this.filter);
            this.save();
        };
        Todos.prototype.onItemChanged = function (ev) {
            var todoItem = ev[0].object;
            if (todoItem.title == '') {
                this.deleteTodo(todoItem);
            }
            this.areAllChecked = _(this.items).all(function (i) { return i.isCompleted; });
            this.updateFilteredItems(this.filter);
            this.save();
        };
        Todos.prototype.deleteTodo = function (todoItem) {
            this.items = _(this.items).without(todoItem);
            this.updateFilteredItems(this.filter);
            this.save();
        };
        Todos.prototype.areAllCheckedChanged = function () {
            var _this = this;
            _.each(this.items, function (i) { return i.isCompleted = _this.areAllChecked; });
            this.updateFilteredItems(this.filter);
        };
        Todos.prototype.clearCompletedTodos = function () {
            this.items = _(this.items).filter(function (i) { return !i.isCompleted; });
            this.areAllChecked = false;
            this.updateFilteredItems(this.filter);
            this.save();
        };
        Object.defineProperty(Todos.prototype, "countTodosLeft", {
            get: function () {
                return _(this.items).filter(function (i) { return !i.isCompleted; }).length;
            },
            enumerable: true,
            configurable: true
        });
        Todos.prototype.updateFilteredItems = function (filter) {
            this.filter = filter;
            switch (filter) {
                case 'active':
                    this.filteredItems = _(this.items).filter(function (i) { return !i.isCompleted; });
                    break;
                case 'completed':
                    this.filteredItems = _(this.items).filter(function (i) { return i.isCompleted; });
                    break;
                default:
                    this.filteredItems = this.items;
                    break;
            }
        };
        Todos.prototype.load = function () {
            var _this = this;
            var storageContent = localStorage.getItem(STORAGE_NAME);
            if (storageContent == undefined)
                return;
            var simpleItems = JSON.parse(storageContent);
            this.items = _.map(simpleItems, function (item) {
                var todoItem = new t.TodoItem(item.title);
                todoItem.isCompleted = item.completed;
                Object["observe"](todoItem, function (ev) { return _this.onItemChanged(ev); });
                return todoItem;
            });
        };
        Todos.prototype.save = function () {
            var simpleItems = _.map(this.items, function (item) {
                return {
                    title: item.title,
                    completed: item.isCompleted
                };
            });
            localStorage.setItem(STORAGE_NAME, JSON.stringify(simpleItems));
        };
        return Todos;
    })();
    exports.Todos = Todos;
});
//# sourceMappingURL=todos.js.map