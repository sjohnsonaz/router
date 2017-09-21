import { expect } from 'chai';

import Router, { RouteBuilder } from '../scripts/main';
import { wait } from '../scripts/util/TestUtils';

describe('Router', () => {
    let router = new Router();
    let defaultCount = 0;
    let errorCount = 0;
    let test0Count = 0;
    let test1Count = 0;
    let test2Count = 0;
    function resetCounts() {
        defaultCount = 0;
        errorCount = 0;
        test0Count = 0;
        test1Count = 0;
        test2Count = 0;
    }
    router.setDefaultRoute(RouteBuilder.build('', function () {
        defaultCount++;
    }));
    router.setErrorRoute(RouteBuilder.build('', function () {
        defaultCount++;
    }));
    router.addRoute(RouteBuilder.build('test', function () {
        test0Count++;
    }));
    router.addRoute(RouteBuilder.build('test/:id', function () {
        test1Count++;
    }));
    router.addRoute(RouteBuilder.build('test/:id/:name', function () {
        test2Count++;
    }));

    it('should run on listen', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start();

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(defaultCount).to.equal(1);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test2Count).to.equal(0);
    });

    it('should handle a change from default to simple', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start();

        await wait(0);
        window.location.hash = 'test';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(defaultCount).to.equal(1);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(1);
        expect(test1Count).to.equal(0);
        expect(test2Count).to.equal(0);
    });

    it('should handle a change from simple to default', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = 'test';
        await wait(0);

        router.start(true);

        await wait(0);
        window.location.hash = '';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(defaultCount).to.equal(1);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test2Count).to.equal(0);
    });

    it('should ignore a change from default to default', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start(true);

        await wait(0);
        window.location.hash = '';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(defaultCount).to.equal(0);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test2Count).to.equal(0);
    });

    it('should handle a change from simple to simple', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = 'abcd';
        await wait(0);

        router.start(true);

        await wait(0);
        window.location.hash = 'test';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(defaultCount).to.equal(0);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(1);
        expect(test1Count).to.equal(0);
        expect(test2Count).to.equal(0);
    });
});
