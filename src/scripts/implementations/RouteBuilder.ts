export default class RouteBuilder {
    parent: RouteBuilder;
    entries: Function[] = [];

    constructor(parent?: RouteBuilder) {
        this.parent = parent;
    }

    static getRoutebuilder(target: any) {
        if (target._routeBuilder) {
            if (!target.hasOwnProperty('_routeBuilder')) {
                target._routeBuilder = new RouteBuilder(target._routeBuilder);
            }
        } else {
            target._routeBuilder = new RouteBuilder();
        }
        return target._routeBuilder;
    }
}