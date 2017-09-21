import { IRoute } from './interfaces/IRoute';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

export default class RouteBuilder {
    static getParameterNames(functionHandle: Function) {
        var definition = functionHandle.toString().replace(STRIP_COMMENTS, '');
        return definition.slice(definition.indexOf('(') + 1, definition.indexOf(')')).match(/([^\s,]+)/g) || [];
    }

    static stringToRegex(definition: string): RegExp {
        return new RegExp('^' + definition.replace(/\//g, '\\/').replace(/:(\w*)/g, '([\^S\^\/]*)') + '$');
    }

    static functionToRegex(prefix: string, enter: Function): RegExp {
        var params = RouteBuilder.getParameterNames(enter);
        params.unshift(prefix);
        return RouteBuilder.stringToRegex(params.join('/:'));
    }

    static build(definition: string | RegExp, enter: Function, exit?: Function): IRoute {
        if (typeof definition === 'string') {
            var regex = RouteBuilder.stringToRegex(definition);
            var name = definition;
        } else {
            var regex = definition;
            var name = definition.toString();
        }
        return {
            name: name,
            regex: regex,
            enter: enter,
            exit: exit
        };
    }
}