import { IRoute } from '../interfaces/IRoute';
import { IRouteDefinitionGroup } from '../interfaces/IRouteDefinitionGroup';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export default class RouteUtils {
    static getParameterNames(functionHandle: Function) {
        let definition = functionHandle.toString().replace(STRIP_COMMENTS, '');
        if (definition.startsWith('function')) {
            // We have a standard function
            return definition.slice(definition.indexOf('(') + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
        } else {
            // We have an arrow function
            let arrowIndex = definition.indexOf('=>');
            let parenthesisIndex = definition.indexOf('(');
            if (parenthesisIndex > -1 && parenthesisIndex < arrowIndex) {
                return definition.slice(parenthesisIndex + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
            } else {
                return definition.slice(0, arrowIndex).match(/([^\s,]+)/g) || [];
            }
        }
    }

    static stringToRegex(definition: string): RegExp {
        return new RegExp('^' + definition.replace(/\//g, '\\/').replace(/\?:(\w*)/g, '\\?(.*)').replace(/:(\w*)/g, '([^\/\?]*)') + '$');
    }

    static functionToRegex(prefix: string, enter: Function): RegExp {
        var params = RouteUtils.getParameterNames(enter);
        params.unshift(prefix);
        return RouteUtils.stringToRegex(params.join('/:'));
    }

    static build(definition: string | RegExp, enter: Function, exit?: (newHash: string) => void, thisArg?: any): IRoute {
        if (typeof definition === 'string') {
            var regex = RouteUtils.stringToRegex(definition);
            var name = definition;
        } else {
            var regex = definition;
            var name = definition.toString();
        }
        return {
            name: name,
            regex: regex,
            enter: enter,
            exit: exit,
            thisArg: thisArg
        };
    }

    static buildFromFunction(prefix: string, enter: Function, exit?: (newHash: string) => void): IRoute {
        var params = RouteUtils.getParameterNames(enter);
        params.unshift(prefix);
        var definition = params.join('/:');
        return RouteUtils.build(definition, enter, exit);
    }

    static buildDefinitionGroup(prefix: string, definitionGroup: IRouteDefinitionGroup, routes?: IRoute[]) {
        routes = routes || [];
        for (var subPrefix in definitionGroup) {
            if (definitionGroup.hasOwnProperty(subPrefix)) {
                var definitions = definitionGroup[subPrefix];
                var fullPrefix = prefix ? prefix + '/' + subPrefix : subPrefix;
                if (definitions instanceof Array) {
                    for (var index = 0, length = definitions.length; index < length; index++) {
                        var definition = definitions[index];
                        if (typeof definition === 'function') {
                            routes.push(RouteUtils.buildFromFunction(fullPrefix, definition as any));
                        } else {
                            RouteUtils.buildDefinitionGroup(fullPrefix, definition as any, routes);
                        }
                    }
                } else {
                    routes.push(RouteUtils.buildFromFunction(fullPrefix, definitions));
                }
            }
        }
        return routes;
    }

    static createUrl(...parts: any[]) {
        var joined = parts.join('/');
        return RouteUtil.normalize(joined);
    }

    static normalize(str: string) {

        // make sure protocol is followed by two slashes
        str = str.replace(/:\//g, '://');

        // remove consecutive slashes
        str = str.replace(/([^:\s])\/+/g, '$1/');

        // remove trailing slash before parameters or hash
        str = str.replace(/\/(\?|&|#[^!])/g, '$1');

        // replace ? in parameters with &
        str = str.replace(/(\?.+)\?/g, '$1&');

        return str;
    }

    static objectToQueryString(obj: Object) {
        var values = [];
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                var value = obj[name];
                if (value instanceof Array) {
                    for (var index = 0, length = value.length; index < length; index++) {
                        values.push(name + '[]=' + encodeURIComponent(value[index]));
                    }
                } else if (value !== undefined) {
                    values.push(name + '=' + encodeURIComponent(value));
                }
            }
        }
        return values.join('&');
    }

    static createRoute(...args: string[]) {
        return args.map(value => encodeURIComponent(value)).join('/');
    }
}