export interface IRouteCallback {
    (hash: string): void | boolean;
}