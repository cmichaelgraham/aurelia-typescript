export class Column {
    constructor(public id, public name, public widgets, public width = "12") { }
}

export class Widget {
    constructor(public id, public name, public width = "12") { }
}
