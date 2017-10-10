import { expect } from 'chai';

import { RouteUtils } from '../scripts/router';
import { wait } from '../scripts/util/TestUtils';

describe('RouteUtils.getParameterNames', () => {
    it('should return an empty array for no parameters', () => {
        let params = RouteUtils.getParameterNames(function () { });
        expect(params.length).to.equal(0);
    });

    it('should return an array of one parameter for one parameters', () => {
        let params = RouteUtils.getParameterNames(function (param0) { });
        expect(params.length).to.equal(1);
        expect(params[0]).to.equal('param0');
    });

    it('should return an array of many parameters for many parameters', () => {
        let params = RouteUtils.getParameterNames(function (param0, param1, param2) { });
        expect(params.length).to.equal(3);
        expect(params[0]).to.equal('param0');
        expect(params[1]).to.equal('param1');
        expect(params[2]).to.equal('param2');
    });
});

describe('RouteUtils.stringToRegex', () => {
    it('should return a regex with no parameters for a string with no parameters', () => {
        let regex = RouteUtils.stringToRegex('test');
        let match = 'test'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(1);
    });

    it('should return a regex with one parameter for a string with one parameters', () => {
        let regex = RouteUtils.stringToRegex('test/:id');
        let match = 'test/1'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(2);
        expect(match[1]).to.equal('1');
    });

    it('should return a regex with many parameters for a string with many parameters', () => {
        let regex = RouteUtils.stringToRegex('test/:id/:name/:value');
        let match = 'test/1/thing/a value'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(4);
        expect(match[1]).to.equal('1');
        expect(match[2]).to.equal('thing');
        expect(match[3]).to.equal('a value');
    });
});

describe('RouteUtils.functionToRegex', () => {
    it('should return a regex with no parameters for a function with no parameters', () => {
        let regex = RouteUtils.functionToRegex('test', function () { });
        let match = 'test'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(1);
    });

    it('should return a regex with one parameter for a function with one parameters', () => {
        let regex = RouteUtils.functionToRegex('test', function (id) { });
        let match = 'test/1'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(2);
        expect(match[1]).to.equal('1');
    });

    it('should return a regex with many parameters for a function with many parameters', () => {
        let regex = RouteUtils.functionToRegex('test', function (id, name, value) { });
        let match = 'test/1/thing/a value'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(4);
        expect(match[1]).to.equal('1');
        expect(match[2]).to.equal('thing');
        expect(match[3]).to.equal('a value');
    });
});
/*
describe('RouteUtils.build', () => {
    it('should create a route', async () => {

    });
});
*/