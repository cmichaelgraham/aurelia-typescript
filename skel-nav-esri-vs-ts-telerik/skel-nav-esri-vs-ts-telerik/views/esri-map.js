define(["require", "exports", "esri/map", "esri/graphic", "esri/symbols/SimpleMarkerSymbol", "esri/geometry/Point", 'esri/SpatialReference', 'esri/geometry/webMercatorUtils'], function (require, exports, Map, Graphic, SimpleMarkerSymbol, Point, SpatialReference, webMercatorUtils) {
    var EsriMap = (function () {
        function EsriMap() {
        }
        EsriMap.prototype.attached = function () {
            var _this = this;
            this.map = new Map("map", {
                center: [-118, 34.5],
                zoom: 8,
                basemap: "topo"
            });
            this.map.on("load", function () {
                console.log('on load: ' + _this.map);
                var pm = new SimpleMarkerSymbol();
                pm.size = 10;
                var wgs = new SpatialReference({ "wkid": 4326 });
                var p = new Point(-118, 34.5, wgs);
                var p2 = webMercatorUtils.geographicToWebMercator(p);
                var g = new Graphic(p2, pm);
                console.log(g);
                g.setGeometry(p);
                console.log(_this.map.loaded);
                _this.map.graphics.add(g);
            });
        };
        return EsriMap;
    })();
    exports.EsriMap = EsriMap;
});
//# sourceMappingURL=esri-map.js.map