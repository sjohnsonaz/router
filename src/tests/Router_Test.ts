import { expect } from 'chai';

import Router from '../scripts/router';
import { wait } from '../scripts/util/TestUtils';

describe('Router', () => {
    let router = new Router();
    let changeCount = 0;
    let defaultCount = 0;
    let errorCount = 0;
    let test0Count = 0;
    let test0ExitCount = 0;
    let test1Count = 0;
    let test1ValueId = undefined;
    let test2Count = 0;
    let test2ValueId = undefined;
    let test2ValueName = undefined;
    function resetCounts() {
        changeCount = 0;
        defaultCount = 0;
        errorCount = 0;
        test0Count = 0;
        test0ExitCount = 0;
        test1Count = 0;
        test1ValueId = undefined;
        test2Count = 0;
        test2ValueId = undefined;
        test2ValueName = undefined;
    }
    router.setAfterChange(function () {
        changeCount++;
    });
    router.setDefaultRoute(function () {
        defaultCount++;
    });
    router.setErrorRoute(function () {
        errorCount++;
    });
    router.addRegex('test', function () {
        test0Count++;
    }, function () {
        test0ExitCount++;
    });
    router.addRegex('test/:id', function (id) {
        test1Count++;
        test1ValueId = id;
    });
    router.addFunction('test', function (id, name) {
        test2Count++;
        test2ValueId = id;
        test2ValueName = name;
    });

    it('should run on listen', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start();

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(changeCount).to.equal(1);
        expect(defaultCount).to.equal(1);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(0);
        expect(test0ExitCount).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test1ValueId).to.equal(undefined);
        expect(test2Count).to.equal(0);
        expect(test2ValueId).to.equal(undefined);
        expect(test2ValueName).to.equal(undefined);
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

        expect(changeCount).to.equal(2);
        expect(defaultCount).to.equal(1);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(1);
        expect(test0ExitCount).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test1ValueId).to.equal(undefined);
        expect(test2Count).to.equal(0);
        expect(test2ValueId).to.equal(undefined);
        expect(test2ValueName).to.equal(undefined);
    });

    it('should handle a change from simple to default', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = 'test';
        await wait(0);

        router.start();

        await wait(0);
        window.location.hash = '';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(changeCount).to.equal(2);
        expect(defaultCount).to.equal(1);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(1);
        expect(test0ExitCount).to.equal(1);
        expect(test1Count).to.equal(0);
        expect(test1ValueId).to.equal(undefined);
        expect(test2Count).to.equal(0);
        expect(test2ValueId).to.equal(undefined);
        expect(test2ValueName).to.equal(undefined);
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

        expect(changeCount).to.equal(0);
        expect(defaultCount).to.equal(0);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(0);
        expect(test0ExitCount).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test1ValueId).to.equal(undefined);
        expect(test2Count).to.equal(0);
        expect(test2ValueId).to.equal(undefined);
        expect(test2ValueName).to.equal(undefined);
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

        expect(changeCount).to.equal(1);
        expect(defaultCount).to.equal(0);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(1);
        expect(test0ExitCount).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test1ValueId).to.equal(undefined);
        expect(test2Count).to.equal(0);
        expect(test2ValueId).to.equal(undefined);
        expect(test2ValueName).to.equal(undefined);
    });

    it('should handle default to error', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start(true);

        await wait(0);
        window.location.hash = 'abcd';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(changeCount).to.equal(1);
        expect(defaultCount).to.equal(0);
        expect(errorCount).to.equal(1);
        expect(test0Count).to.equal(0);
        expect(test0ExitCount).to.equal(0);
        expect(test1Count).to.equal(0);
        expect(test1ValueId).to.equal(undefined);
        expect(test2Count).to.equal(0);
        expect(test2ValueId).to.equal(undefined);
        expect(test2ValueName).to.equal(undefined);
    });

    it('should handle parameters', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);
        router.start(true);

        await wait(0);
        window.location.hash = 'test';

        await wait(0);
        window.location.hash = 'test/1';

        await wait(0);
        window.location.hash = 'test/2/value with spaces';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(changeCount).to.equal(3);
        expect(defaultCount).to.equal(0);
        expect(errorCount).to.equal(0);
        expect(test0Count).to.equal(1);
        expect(test0ExitCount).to.equal(1);
        expect(test1Count).to.equal(1);
        expect(test1ValueId).to.equal('1');
        expect(test2Count).to.equal(1);
        expect(test2ValueId).to.equal('2');
        expect(test2ValueName).to.equal('value with spaces');
    });
});

describe('Router.beforeMatch', () => {
    let router = new Router();
    let testCount = 0;
    let otherCount = 0;
    function resetCounts() {
        testCount = 0;
        otherCount = 0;
    }
    router.addFunction('test', () => {
        testCount++;
    });
    router.addFunction('other', () => {
        otherCount++;
    });
    router.setBeforeMatch((hash) => {
        if (hash === 'other') {
            return 'test';
        } else {
            return undefined;
        }
    });

    it('should not cancel on return undefined', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start(true);

        await wait(0);
        window.location.hash = 'test';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(testCount).to.equal(1);
        expect(otherCount).to.equal(0);
    });

    it('should cancel on return false', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start(true);

        await wait(0);
        window.location.hash = 'other';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(testCount).to.equal(1);
        expect(otherCount).to.equal(0);
    });

    it('should change hash on return string', async () => {
        resetCounts();

        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        router.start(true);

        await wait(0);
        window.location.hash = 'another';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(testCount).to.equal(0);
        expect(otherCount).to.equal(0);
    });
});

describe('Router.addFunctionGroup', () => {
    let router = new Router();
    let route0Count = 0;
    let route0GroupChange = false
    let route1Count = 0;
    let route1GroupChange = false
    let exitCount = 0;
    let exitGroupChange = false
    function resetCounts() {
        route0Count = 0;
        route0GroupChange = false
        route1Count = 0;
        route1GroupChange = false
        exitCount = 0;
        exitGroupChange = false
    }
    router.addFunctionGroup('test', [
        () => {
            route0Count++;
            route0GroupChange = router.changedRouteGroup;
        }, (id) => {
            route1Count++;
            route1GroupChange = router.changedRouteGroup;
        }
    ], () => {
        exitCount++;
        exitGroupChange = router.changedRouteGroup;
    });
    it('should add multiple Routes into a RouteGroup', async () => {
        resetCounts();
        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);
        router.start(true);

        await wait(0);
        window.location.hash = 'test';

        await wait(0);
        window.location.hash = 'test/1';

        await wait(0);
        window.location.hash = '';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(route0Count).to.equal(1);
        expect(route0GroupChange).to.equal(true);
        expect(route1Count).to.equal(1);
        expect(route1GroupChange).to.equal(false);
        expect(exitCount).to.equal(1);
        expect(exitGroupChange).to.equal(true);
    });
});
