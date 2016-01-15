/*global jest describe it expect */

jest.autoMockOff();

const moment    = require('moment');
const React     = require('react');
const ReactDOM  = require('react-dom');
const TestUtils = require('react-addons-test-utils');
const Dayz      = require('../src/dayz');

const date = moment('2015-09-12');

describe('Dayz', function() {

    it('renders', function() {
        const dayz = TestUtils.renderIntoDocument(
                <Dayz display='month' date={date} />
        );
        const div = ReactDOM.findDOMNode(dayz);
        expect(div.querySelectorAll('.day').length).toEqual(35);
        const labels = div.querySelectorAll('.day .label');

        expect(labels[0].textContent).toEqual('30');
        expect(labels[34].textContent).toEqual('3');
    });

});
