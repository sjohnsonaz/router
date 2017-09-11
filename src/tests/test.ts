import { expect } from 'chai';

import Router from '../scripts/main';

describe('Router', () => {
    it('should handle the default route', () => {
        let runCount = 0;
        let router = new Router({
            '': () => {
                runCount++;
            }
        });
        router.listen();
        expect(runCount).to.equal(1);
    });
});