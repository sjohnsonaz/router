import { expect } from 'chai';

import Router from '../scripts/main';
import { wait } from '../scripts/util/TestUtils';

describe('Router', () => {
    it('should handle the default route', async () => {
        window.location.hash = '';
        let runCount = 0;
        let router = new Router({
            '': () => {
                runCount++;
            }
        });
        router.listen(true);

        await wait(0);
        router.stop();
        expect(runCount).to.equal(1);
    });

    it('should handle a simple route', async () => {
        window.location.hash = 'abc';
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
});
