class Column {
    id;
    name;
    widgets;
    width;
  constructor(id?, name?, widgets?, width?) {
    this.id = id;
    this.name = name;
    this.widgets = widgets;
    this.width = width ? width : '12';
  }
}

class Widget {
    id;
    name;
    width;
  constructor(id?, name?, width?) {
    this.id = id;
    this.name = name;
    this.width = width ? width : '12';
  }
}

var Models = { Column: Column, Widget: Widget };

export {
  Models
}
