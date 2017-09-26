import { IRoute } from '../interfaces/IRoute';
import { IRouteGroup } from '../interfaces/IRouteGroup';

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
    previousRoute: IRoute;
    changedRouteGroup: boolean = false;

    constructor() {
        this.routeListener = new RouteListener((hash: string) => {
            this.previousRoute = this.currentRoute;
            this.currentRoute = undefined;

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

            this.changedRouteGroup = !this.previousRoute ||
                !this.previousRoute.routeGroup ||
                this.previousRoute.routeGroup !== this.currentRoute.routeGroup;

            // We have an old route, the route has an exit, and we are changing routeGroups
            if (this.previousRoute && this.previousRoute.exit && (
                !this.previousRoute.routeGroup || (
                    this.currentRoute && this.previousRoute.routeGroup !== this.currentRoute.routeGroup
                )
            )) {
                if (this.previousRoute.thisArg) {
                    this.previousRoute.exit.call(this.previousRoute.thisArg, hash);
                } else {
                    this.previousRoute.exit(hash);
                }
            }

            if (this.currentRoute && this.currentRoute.enter) {
                this.currentRoute.enter.apply(this.currentRoute.thisArg || this.currentRoute.enter, params ? params.splice(1) : []);
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
        return route;
    }

    addRegex(definition: string | RegExp, enter: Function, exit?: (newHash: string) => void) {
        return this.addRoute(RouteBuilder.build(definition, enter, exit));
    }

    addFunction(prefix: string, enter: Function, exit?: (newHash: string) => void) {
        return this.addRoute(RouteBuilder.buildFromFunction(prefix, enter, exit));
    }

    addFunctionGroup(prefix: string, enterFunctions: Function[], exit?: (newHash: string) => void) {
        let routeGroup: IRouteGroup = {
            routes: []
        };
        if (enterFunctions) {
            enterFunctions.forEach(enter => {
                let route = this.addFunction(prefix, enter, exit);
                route.routeGroup = routeGroup;
                routeGroup.routes.push(route);
            });
        }
    }

    removeRoute(route: IRoute) {
        let index = this.routes.indexOf(route);
        if (index >= 0) {
            return this.routes.splice(index, 1);
        }
    }

    setDefaultRoute(enter: Function, exit?: (newHash: string) => void) {
        this.defaultRoute = RouteBuilder.build('', enter, exit);
    }

    setErrorRoute(enter: Function, exit?: (newHash: string) => void) {
        this.errorRoute = RouteBuilder.build('', enter, exit);
    }

    start(defer: boolean = false) {
        this.routeListener.start(defer);
    }

    stop() {
        this.routeListener.stop();
        this.currentRoute = undefined;
    }

    static goToRoute(...args: string[]) {
        window.location.hash = args.join('/');
    }

    static goToPage(href: string) {
        window.location.href = href;
    }
}