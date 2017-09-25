# Cubex Router

[![Build Status](https://travis-ci.org/Cubex30/router.svg?branch=master)](https://travis-ci.org/Cubex30/router) [![npm version](https://badge.fury.io/js/@cubex/router.svg)](https://badge.fury.io/js/@cubex/router)

```` TypeScript
import Router from '@cubex/router';

class Application {
    router: Router = new Router();

    constructor() {
        /*
         * Sets Default Route
         */
        this.router.setDefaultRoute(function () {
            console.log('Route: Default');
        });

        /*
         * Set Error Route
         */
        this.router.setErrorRoute(function () {
            console.log('Route: Default');
        });

        /*
         * Set Route and exit function
         */
        this.router.addRegex('test', function () {
            console.log('Route: Test');
        }, function() {
            console.log('Route Exit: Test');
        });

        /*
         * Set Route with parameter
         */
        this.router.addRegex('test/:id', function (id) {
            console.log('Route: Test, id: ' + id);
        });

        /*
         * Set Route with two parameters defined by function
         */
        this.router.addFunction('test', function (id, name) {
            console.log('Route: Test, id: ' + id + ', name: ' + name);
        });
    }

    /*
     * Start Router, with option to defer run until route change
     */
    start(defer: boolean = false) {
        this.router.start(defer);
    }

    /*
     * Stop Router
     */
    stop() {
        this.router.stop();
    }
}
````