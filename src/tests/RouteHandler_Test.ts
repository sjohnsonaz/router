import { expect } from 'chai';

import Router, { RouteHandler } from '../scripts/main';
import { wait } from '../scripts/util/TestUtils';

describe('RouteHandler', () => {
    it('should run on listen', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new RouteHandler({
            '': () => {
                runCount++;
            }
        });
        router.start();

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should handle a change from default to simple', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new RouteHandler({
            'test': () => {
                runCount++;
            }
        });
        router.start();

        await wait(0);
        window.location.hash = 'test';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should handle a change from simple to default', async () => {
        window.location.hash = 'test';
        let runCount = 0;
        let router = new RouteHandler({
            '': () => {
                runCount++;
            }
        });
        router.start(true);

        await wait(0);
        window.location.hash = '';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should ignore a change from default to default', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new RouteHandler({
            '': () => {
                runCount++;
            }
        });
        router.start(true);

        await wait(0);
        window.location.hash = '';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(0);
    });

    it('should handle a change from simple to simple', async () => {
        window.location.hash = 'abcd';
        let runCount = 0;
        let router = new RouteHandler({
            'test': () => {
                runCount++;
            }
        });
        router.start(true);

        await wait(0);
        window.location.hash = 'test';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });
});
