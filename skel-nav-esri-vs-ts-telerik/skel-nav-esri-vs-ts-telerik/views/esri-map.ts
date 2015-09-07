import Map = require("esri/map");
import Graphic = require("esri/graphic");
import SimpleMarkerSymbol = require("esri/symbols/SimpleMarkerSymbol");
import Point = require("esri/geometry/Point");
import SpatialReference = require('esri/SpatialReference');
import * as webMercatorUtils from 'esri/geometry/webMercatorUtils';

export class EsriMap {
    map: Map;
    constructor() { }
    attached() {
        this.map = new Map("map", {
            center: [-118, 34.5],
            zoom: 8,
            basemap: "topo"
        });

        this.map.on("load", () => {
            console.log('on load: ' + this.map);
            var pm: SimpleMarkerSymbol = new SimpleMarkerSymbol();
            pm.size = 10;
            var wgs = new SpatialReference({ "wkid": 4326 });
            var p: Point = new Point(-118, 34.5, wgs);
            var p2 = webMercatorUtils.geographicToWebMercator(p);
            var g: Graphic = new Graphic(p2, pm);
            console.log(g);
            g.setGeometry(p);
            console.log(this.map.loaded);
            this.map.graphics.add(g);
        });
    }
}