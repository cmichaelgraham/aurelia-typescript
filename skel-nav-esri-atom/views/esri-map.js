define(["require", "exports", "esri/map"], function (require, exports, map_1) {
    var EsriMap = (function () {
        function EsriMap() {
        }
        EsriMap.prototype.attached = function () {
            var map = new map_1.default("map", {
                center: [-118, 34.5],
                zoom: 8,
                basemap: "topo"
            });
        };
        return EsriMap;
    })();
    exports.EsriMap = EsriMap;
});
