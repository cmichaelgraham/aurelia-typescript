import settings from './settings';

export class ListViewModel {
    router;
    route;
    service;
    entities = [];
    pageSize = settings.pageSize;
    pageCount = 0;
    pageIndex = 0;
    isLoading = false;

    constructor(route, router, service) {
        this.route = route;
        this.router = router;
        this.service = service;
    }

    activate() {
        this.load();
    }

    load() {
        this.isLoading = true;
        this.service.getPage(this.pageIndex)
            .then(result => {
                this.entities = result.entities;
                this.pageCount = result.pageCount;
                this.isLoading = false;
            });
    }

    setPage(index) {
        this.pageIndex = index;
        this.load();
    }

    open(id) {
        this.router.navigate(this.route + '/' + id);
    }
}