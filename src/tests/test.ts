import { expect } from 'chai';

import Router from '../scripts/main';
import { wait } from '../scripts/util/TestUtils';

describe('Router', () => {
    it('should run on listen', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new Router({
            '': () => {
                runCount++;
            }
        });
        router.listen();

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should handle a change from default to simple', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new Router({
            'test': () => {
                runCount++;
            }
        });
        router.listen();

        await wait(0);
        window.location.hash = 'test';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should handle a change from simple to default', async () => {
        window.location.hash = 'test';
        let runCount = 0;
        let router = new Router({
            '': () => {
                runCount++;
            }
        });
        router.listen(true);

        await wait(0);
        window.location.hash = '';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should ignore a change from default to default', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new Router({
            '': () => {
                runCount++;
            }
        });
        router.listen(true);

        await wait(0);
        window.location.hash = '';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(0);
    });

    it('should handle a change from simple to simple', async () => {
        window.location.hash = 'abcd';
        let runCount = 0;
        let router = new Router({
            'test': () => {
                runCount++;
            }
        });
        router.listen(true);

        await wait(0);
        window.location.hash = 'test';

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });
});
