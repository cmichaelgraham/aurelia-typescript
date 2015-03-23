import {HttpClient} from "aurelia-http-client";

var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json";

export class Flickr {
    public heading: string;
    public images: Array<any>;
    static inject = [HttpClient];
    constructor(private http: HttpClient) {
        this.heading = "Flickr";
        this.images = [];
    }

    activate() {
        return this.http.jsonp(url).then(response => {
            this.images = response.content.items;
        });
    }

    canDeactivate() {
        return confirm("Are you sure you want to leave?");
    }
}
