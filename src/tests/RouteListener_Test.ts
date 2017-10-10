import { expect } from 'chai';

import { RouteListener } from '../scripts/router';
import { wait } from '../scripts/util/TestUtils';

describe('RouteListener', () => {
    class SimpleRouter extends RouteListener {
        runCount: number = 0;
        currentRoute: string;

        constructor() {
            super((hash: string) => {
                this.runCount++;
                this.currentRoute = hash;
            });
        }
    }

    it('should run on start', async () => {
        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        let router = new SimpleRouter();
        router.start();

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(router.runCount).to.equal(1);
    });

    it('should not run on start if deferred', async () => {
        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        let router = new SimpleRouter();
        router.start(true);

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(router.runCount).to.equal(0);
    });

    it('should handle a change after start', async () => {
        // Reset hash and wait for events to clear
        window.location.hash = '';
        await wait(0);

        let router = new SimpleRouter();
        router.start();

        await wait(0);
        window.location.hash = 'test';

        // Wait for events to clear and stop
        await wait(0);
        router.stop();

        expect(router.runCount).to.equal(2);
    });
});
