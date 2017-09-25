import { IRouteGroup } from './IRouteGroup';
export interface IRoute {
    name?: string;
    regex?: RegExp;
    enter: Function;
    exit: (newHash: string) => void;
    thisArg: any;
    routeGroup?: IRouteGroup;
}