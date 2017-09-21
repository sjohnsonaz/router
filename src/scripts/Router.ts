import { IRoute } from './interfaces/IRoute';
//import { IRouteIndex } from './interfaces/IRouteIndex';

import RouteListener from './RouteListener';

export default class Router {
    routeListener: RouteListener;
    defaultRoute: IRoute;
    errorRoute: IRoute;
    routes: IRoute[] = [];//IRouteIndex = {};
    currentRoute: IRoute;

    constructor() {
        this.routeListener = new RouteListener((hash: string) => {
            // We have an old route
            if (this.currentRoute) {
                if (this.currentRoute.exit) {
                    this.currentRoute.exit();
                }
                this.currentRoute = undefined;
            }
            let params: RegExpMatchArray;
            // We will try and find a route
            if (hash) {
                if (this.routes) {
                    for (let index = 0, length = this.routes.length; index < length; index++) {
                        let route = this.routes[index];
                        params = hash.match(route.regex);
                        if (params) {
                            this.currentRoute = route;
                            break;
                        }
                    }
                }
            } else {
                // We must use the default route
                this.currentRoute = this.defaultRoute;
            }
            if (!this.currentRoute) {
                this.currentRoute = this.errorRoute;
            }
            if (this.currentRoute && this.currentRoute.enter) {
                this.currentRoute.enter.apply(this.currentRoute.enter, params ? params.splice(1) : []);
            }
        });
    }

    addRoute(route: IRoute) {
        this.routes.push(route);
    }

    removeRoute(route: IRoute) {
        let index = this.routes.indexOf(route);
        if (index >= 0) {
            return this.routes.splice(index, 1);
        }
    }

    setDefaultRoute(route: IRoute) {
        this.defaultRoute = route;
    }

    setErrorRoute(route: IRoute) {
        this.errorRoute = route;
    }

    start(defer: boolean = false) {
        this.routeListener.start(defer);
    }

    stop() {
        this.routeListener.stop();
    }
}