define(["require", "exports", "aurelia-http-client"], function(require, exports, auhc) {
    var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json";

    var Flickr = (function () {
        function Flickr(http) {
            this.http = http;
            this.heading = "Flickr";
            this.images = [];
        }
        Flickr.prototype.activate = function () {
            var _this = this;
            return this.http.jsonp(url).then(function (response) {
                _this.images = response.content.items;
            });
        };

        Flickr.prototype.canDeactivate = function () {
            return confirm("Are you sure you want to leave?");
        };
        Flickr.inject = [auhc.HttpClient];
        return Flickr;
    })();
    exports.Flickr = Flickr;
});
