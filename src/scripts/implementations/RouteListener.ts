import { IRouteCallback } from '../interfaces/IRouteCallback';

export default class RouteListener {
    callback: IRouteCallback;

    constructor(callback?: IRouteCallback) {
        this.callback = callback;
    }

    start(defer: boolean = false) {
        window.addEventListener('hashchange', this.handler);
        if (!defer) {
            this.handler();
        }
    }

    stop() {
        window.removeEventListener('hashchange', this.handler);
    }

    private handler = (event?: HashChangeEvent) => {
        let url = (event && event.newURL) ? event.newURL : window.location.href;
        let hash = this.getHash(url);
        if (this.callback && !this.callback(hash) && event) {
            event.preventDefault();
        }
    }

    private getHash(url: string) {
        var hash;
        var index = url.indexOf('#');
        if (index >= 0) {
            hash = url.substring(index + 1);
        } else {
            hash = '';
        }
        return hash;
    }
}