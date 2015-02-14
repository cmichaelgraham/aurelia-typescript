import t = require("./todo-item");
import _ = require("underscore");

var STORAGE_NAME = 'todomvc-aurelia';

export class Todos {
    constructor(
        public items = [],
        public filteredItems = [],
        public filter = "",
        public newTodoTitle = null,
        public areAllChecked = false) {

        this.load();
    }

    activate(params) {
        this.updateFilteredItems(params.filter);
    }

    addNewTodo(title = this.newTodoTitle) {
        if (title == undefined) return;

        title = title.trim();
        if (title.length == 0) return;

        var newTodoItem = new t.TodoItem(title);
        Object["observe"](newTodoItem,(ev) => this.onItemChanged(ev));

        this.items.push(newTodoItem);
        this.newTodoTitle = null;
        this.updateFilteredItems(this.filter);
        this.save();
    }

    onItemChanged(ev) {
        var todoItem = ev[0].object;
        if (todoItem.title == '') {
            this.deleteTodo(todoItem);
        }

        this.areAllChecked = _(this.items).all(i => i.isCompleted);
        this.updateFilteredItems(this.filter);
        this.save();
    }

    deleteTodo(todoItem) {
        this.items = _(this.items).without(todoItem);
        this.updateFilteredItems(this.filter);
        this.save();
    }

    areAllCheckedChanged() {
        _.each(this.items, i => i.isCompleted = this.areAllChecked);
        this.updateFilteredItems(this.filter);
    }

    clearCompletedTodos() {
        this.items = _(this.items).filter(i => !i.isCompleted);
        this.areAllChecked = false;
        this.updateFilteredItems(this.filter);
        this.save();
    }

    get countTodosLeft() {
        return _(this.items).filter(i => !i.isCompleted).length;
    }

    updateFilteredItems(filter) {
        this.filter = filter;

        switch (filter) {
            case 'active':
                this.filteredItems = _(this.items).filter(i => !i.isCompleted);
                break;
            case 'completed':
                this.filteredItems = _(this.items).filter(i => i.isCompleted);
                break;
            default:
                this.filteredItems = this.items;
                break;
        }
    }

    load() {
        var storageContent = localStorage.getItem(STORAGE_NAME);
        if (storageContent == undefined) return;

        var simpleItems = JSON.parse(storageContent);
        this.items = _.map(simpleItems,(item: { title: string; completed: boolean }) => {
            var todoItem = new t.TodoItem(item.title);
            todoItem.isCompleted = item.completed;

            Object["observe"](todoItem,(ev) => this.onItemChanged(ev));

            return todoItem;
        });
    }

    save() {
        var simpleItems = _.map(this.items, item => {
            return {
                title: item.title,
                completed: item.isCompleted
            }
        });

        localStorage.setItem(STORAGE_NAME, JSON.stringify(simpleItems));
    }
}
