import { expect } from 'chai';

import { RouteBuilder } from '../scripts/main';
import { wait } from '../scripts/util/TestUtils';

describe('RouteBuilder.getParameterNames', () => {
    it('should return an empty array for no parameters', async () => {
        let params = RouteBuilder.getParameterNames(function () { });
        expect(params.length).to.equal(0);
    });

    it('should return an array of one parameter for one parameters', async () => {
        let params = RouteBuilder.getParameterNames(function (param0) { });
        expect(params.length).to.equal(1);
        expect(params[0]).to.equal('param0');
    });

    it('should return an array of many parameters for many parameters', async () => {
        let params = RouteBuilder.getParameterNames(function (param0, param1, param2) { });
        expect(params.length).to.equal(3);
        expect(params[0]).to.equal('param0');
        expect(params[1]).to.equal('param1');
        expect(params[2]).to.equal('param2');
    });
});

describe('RouteBuilder.stringToRegex', () => {
    it('should return a regex with no parameters for a string with no parameters', async () => {
        let regex = RouteBuilder.stringToRegex('test');
        let match = 'test'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(1);
    });

    it('should return a regex with one parameter for a string with one parameters', async () => {
        let regex = RouteBuilder.stringToRegex('test/:id');
        let match = 'test/1'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(2);
        expect(match[1]).to.equal('1');
    });

    it('should return a regex with many parameters for a string with many parameters', async () => {
        let regex = RouteBuilder.stringToRegex('test/:id/:name/:value');
        let match = 'test/1/thing/a value'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(4);
        expect(match[1]).to.equal('1');
        expect(match[2]).to.equal('thing');
        expect(match[3]).to.equal('a value');
    });
});

describe('RouteBuilder.functionToRegex', () => {
    it('should return a regex with no parameters for a function with no parameters', async () => {
        let regex = RouteBuilder.functionToRegex('test', function () { });
        let match = 'test'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(1);
    });

    it('should return a regex with one parameter for a function with one parameters', async () => {
        let regex = RouteBuilder.functionToRegex('test', function (id) { });
        let match = 'test/1'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(2);
        expect(match[1]).to.equal('1');
    });

    it('should return a regex with many parameters for a function with many parameters', async () => {
        let regex = RouteBuilder.functionToRegex('test', function (id, name, value) { });
        let match = 'test/1/thing/a value'.match(regex);
        expect(match).to.be.instanceof(Array);
        expect(match.length).to.equal(4);
        expect(match[1]).to.equal('1');
        expect(match[2]).to.equal('thing');
        expect(match[3]).to.equal('a value');
    });
});
/*
describe('RouteBuilder.build', () => {
    it('should create a route', async () => {

    });
});
*/