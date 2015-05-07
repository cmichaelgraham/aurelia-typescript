if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'aurelia-framework', 'aurelia-http-client'], function (require, exports, aurelia_framework_1, aurelia_http_client_1) {
    //@autoinject
    var Flickr = (function () {
        function Flickr(http) {
            this.heading = 'Flickr';
            this.images = [];
            this.url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json';
            this.http = http;
        }
        Flickr.prototype.activate = function () {
            var _this = this;
            return this.http.jsonp(this.url).then(function (response) {
                _this.images = response.content.items;
            });
        };
        Flickr.prototype.canDeactivate = function () {
            return confirm('Are you sure you want to leave?');
        };
        Flickr = __decorate([
            aurelia_framework_1.inject(aurelia_http_client_1.HttpClient)
        ], Flickr);
        return Flickr;
    })();
    exports.Flickr = Flickr;
});
//# sourceMappingURL=flickr.js.map