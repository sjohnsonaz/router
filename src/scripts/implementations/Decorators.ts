import Router from './Router';
import {IRouteGroup } from '../interfaces/IRouteGroup';

function router<T extends { new(...args: any[]): {} }>(cstr: T) {
    return class extends cstr {
        routeGroup: IRouteGroup;
        constructor(...args:any[]) {
            super(...args);
            this.routeGroup = undefined;
        }
    }
}

let staticRouter = new Router();
function route(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method = target[propertyKey];
    descriptor
    if (method) {
        //router.
    }
};