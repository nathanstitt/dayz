// __tests__/CheckboxWithLabel-test.js

jest.dontMock('moment')
    .dontMock('lodash')
    .dontMock('../src/dayz');

//jest.autoMockOff();

const moment = require('moment');


// describe('Dayz', function() {

//     it('changes the text after click', function() {

//         const React = require('react/addons');

//         const Dayz = require('../src/dayz');

//         const TestUtils = React.addons.TestUtils;
//         const today = moment();

//         const Comp = TestUtils.renderIntoDocument(
//                 <Dayz display='month' date={today} />
//         );

//         const div = TestUtils.findRenderedDOMComponentWithTag(Comp, 'div');
//         console.log(React.findDOMNode(div).textContent);

//         expect(React.findDOMNode(div).textContent).toEqual('hi');

//     });
// });
