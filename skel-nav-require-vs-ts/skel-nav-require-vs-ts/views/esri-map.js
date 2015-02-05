//$(document).ready(() =>
//{
//    require(["esri/map", "dojo/domReady!"], function (Map) {
//    var map = new Map("map", {
//        center: [-118, 34.5],
//        zoom: 8,
//        basemap: "topo"
//    });
//})});
define(["require", "exports", "esri/map"], function (require, exports, Map) {
    var EsriMap = (function () {
        function EsriMap() {
        }
        EsriMap.prototype.attached = function () {
            var map = new Map("map", {
                center: [-118, 34.5],
                zoom: 8,
                basemap: "topo"
            });
        };
        return EsriMap;
    })();
    exports.EsriMap = EsriMap;
});
//# sourceMappingURL=esri-map.js.map