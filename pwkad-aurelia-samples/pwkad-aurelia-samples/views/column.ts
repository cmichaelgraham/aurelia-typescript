import {inject} from 'aurelia-framework';
import {Models} from 'views/models';

export class Column {
    column;
    constructor() {
        this.column = new Models.Column();
    }

    activate(col) {
        this.column.id = col.id;
        this.column.name = col.name;
        this.column.widgets = col.widgets;
        this.column.width = col.width;
    }

    addWidget() {
        this.column.widgets.push(new Models.Widget());
    }

    attached() {
        // console.log(this.sortable);
        // sortable.create(this.el, {
        //   animation: 150,
        //   draggable: '.widget-row',
        //   onEnd: (evt) => {
        //       this.column.widgets.move(evt.oldIndex, evt.newIndex);
        //       console.log(this.column.widgets);
        //   }
        // });
    }
}

(<any>Array).prototype.move = function (old_index, new_index) {
    var element = this[old_index];
    this.splice(old_index, 1);
    this.splice(new_index, 0, element);
};
