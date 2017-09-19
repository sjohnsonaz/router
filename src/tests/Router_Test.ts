import { expect } from 'chai';

import { Router } from '../scripts/main';
import { wait } from '../scripts/util/TestUtils';

describe('Route', () => {
    class SimpleRouter extends Router {
        runCount: number = 0;
        currentRoute: string;
        route(hash: string) {
            this.runCount++;
            this.currentRoute = hash;
        }
    }

    it('should run on start', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new SimpleRouter();
        router.start();

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should not run on start if deferred', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new SimpleRouter();
        router.start(true);

        await wait(0);
        router.stop();
        expect(runCount).to.equal(0);
    });

    it('should handle a change after start', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new SimpleRouter();
        router.start(false);

        await wait(0);
        window.location.hash = 'test';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });
});
