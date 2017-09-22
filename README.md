# Cubex Router

[![Build Status](https://travis-ci.org/Cubex30/router.svg?branch=master)](https://travis-ci.org/Cubex30/router) [![npm version](https://badge.fury.io/js/@cubex/router.svg)](https://badge.fury.io/js/@cubex/router)

```` TypeScript
import Router from '@cubex/router';

class Application {
    router: Router = new Router();

    constructor() {
        this.router.setDefaultRoute(function () {
            console.log('Route: Default');
        });
        this.router.setErrorRoute(function () {
            console.log('Route: Default');
        });
        this.router.addRegex('test', function () {
            console.log('Route: Test');
        });
        this.router.addRegex('test/:id', function (id) {
            console.log('Route: Test, id: ' + id);
        });
        this.router.addFunction('test', function (id, name) {
            console.log('Route: Test, id: ' + id + ', name: ' + name);
        });
    }

    start() {
        this.router.start();
    }

    stop() {
        this.router.stop();
    }
}
````