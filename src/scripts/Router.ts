import { IRoute } from './interfaces/IRoute';

import RouteListener from './RouteListener';
import RouteBuilder from './RouteBuilder';

export default class Router {
    routeListener: RouteListener;
    defaultRoute: IRoute;
    errorRoute: IRoute;
    routes: IRoute[] = [];//IRouteIndex = {};
    routeHash: {
        [index: string]: IRoute
    } = {};
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
        let oldRoute = this.routeHash[route.name];
        if (oldRoute) {
            let index = this.routes.indexOf(oldRoute);
            this.routes.splice(index, 1);
        }
        this.routeHash[route.name] = route;
        this.routes.push(route);
    }

    addRegex(definition: string | RegExp, enter: Function, exit?: Function) {
        this.addRoute(RouteBuilder.build(definition, enter, exit));
    }

    addFunction(prefix: string, enter: Function, exit?: Function) {
        this.addRoute(RouteBuilder.buildFromFunction(prefix, enter, exit));
    }

    removeRoute(route: IRoute) {
        let index = this.routes.indexOf(route);
        if (index >= 0) {
            return this.routes.splice(index, 1);
        }
    }

    setDefaultRoute(enter: Function, exit?: Function) {
        this.defaultRoute = RouteBuilder.build('', enter, exit);;
    }

    setErrorRoute(enter: Function, exit?: Function) {
        this.errorRoute = RouteBuilder.build('', enter, exit);;
    }

    start(defer: boolean = false) {
        this.routeListener.start(defer);
    }

    stop() {
        this.routeListener.stop();
    }

    static goToRoute(...args: string[]) {
        window.location.hash = args.join('/');
    }

    static goToPage(href: string) {
        window.location.href = href;
    }
}