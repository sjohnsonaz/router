export abstract class RouteListener {
    start(defer: boolean = false) {
        window.addEventListener('hashchange', this.handler);
        if (!defer) {
            this.handler();
        }
    }

    stop() {
        window.removeEventListener('hashchange', this.handler);
    }

    abstract route(hash: string): void | boolean;

    private handler = (event?: HashChangeEvent) => {
        let url = (event && event.newURL) ? event.newURL : window.location.href;
        let hash = this.getHash(url);
        if (!this.route(hash) && event) {
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