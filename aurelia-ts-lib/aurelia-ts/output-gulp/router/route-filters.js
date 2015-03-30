import { Container } from 'aurelia-dependency-injection';
export class RouteFilterContainer {
    constructor(container) {
        this.container = container;
        this.filters = {};
        this.filterCache = {};
    }
    static inject() {
        return [
            Container
        ];
    }
    addStep(name, step, index = -1) {
        var filter = this.filters[name];
        if (!filter) {
            filter = this.filters[name] = [];
        }
        if (index === -1) {
            index = filter.length;
        }
        filter.splice(index, 0, step);
        this.filterCache = {};
    }
    getFilterSteps(name) {
        if (this.filterCache[name]) {
            return this.filterCache[name];
        }
        var steps = [];
        var filter = this.filters[name];
        if (!filter) {
            return steps;
        }
        for (var i = 0, l = filter.length; i < l; i++) {
            if (typeof filter[i] === 'string') {
                steps.push(...this.getFilterSteps(filter[i]));
            }
            else {
                steps.push(this.container.get(filter[i]));
            }
        }
        return this.filterCache[name] = steps;
    }
}
export function createRouteFilterStep(name) {
    function create(routeFilterContainer) {
        return new RouteFilterStep(name, routeFilterContainer);
    }
    ;
    create["inject"] = function () {
        return [
            RouteFilterContainer
        ];
    };
    return create;
}
export class RouteFilterStep {
    constructor(name, routeFilterContainer) {
        this.name = name;
        this.routeFilterContainer = routeFilterContainer;
        this.isMultiStep = true;
    }
    getSteps() {
        return this.routeFilterContainer.getFilterSteps(this.name);
    }
}
