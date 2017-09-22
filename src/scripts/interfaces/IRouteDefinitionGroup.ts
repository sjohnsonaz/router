export interface IRouteDefinitionGroup {
    [index: string]: Function | (Function | IRouteDefinitionGroup)[];
}