import Map = require("esri/map");

export class EsriMap {
    constructor() { }
    attached() {
        var map = new Map("map", {
            center: [-118, 34.5],
            zoom: 8,
            basemap: "topo"
        });
    }
}
