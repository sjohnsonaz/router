export interface IRoute {
    name?: string;
    regex?: RegExp;
    enter: Function;
    exit: Function;
}