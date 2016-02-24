/*global jest describe it expect */

jest.autoMockOff();

const moment = require('moment');
require('moment-range');

const React       = require('react');
const ReactDOM    = require('react-dom');
const TestUtils   = require('react-addons-test-utils');

const Event       = require('data/event');
const Layout      = require('data/layout');
const EventComp   = require('event');
const EventLayout = require('data/event-layout');
const EventsCollection = require('data/events-collection');

const date = moment('2015-09-12');

describe('Dayz', function() {

    it('renders a single-day event', function() {
        const eventModel = new Event({
            content: 'test',
            range: moment.range( date.clone().add(8, 'hours'), date.clone().add(10, 'hours'))
        });
        const events = new EventsCollection([eventModel]);
        const layout = new Layout({ events, display: 'day', day: date,
                                    range: moment.range( moment(date), moment(date).endOf('day') )
                                  });
        const eventLayout = new EventLayout(layout,
                                            eventModel,
                                            moment.range(date, date.clone().add(1, 'day') ));
        const event  = TestUtils.renderIntoDocument( <EventComp layout={eventLayout} /> );
        const div    = ReactDOM.findDOMNode(event);
        expect( div.style.top ).toEqual('7.69%' );
        expect( div.style.bottom ).toEqual('76.92%' );
        expect( div.classList.contains('event') ).toBe(true);
        expect( div.classList.contains('span-1') ).toBe(true);
    });

    it('renders a multi-day event', function() {
        const eventModel = new Event({
            content: 'test',
            range: moment.range( date.clone(), date.clone().add(3, 'days'))
        });
        const events = new EventsCollection([eventModel]);
        const layout = new Layout({ events, display: 'day', day: date,
                                    range: moment.range( moment(date), moment(date).endOf('day') )
                                  });
        const eventLayout = new EventLayout(layout,
                                            eventModel,
                                            moment.range(date, date.clone().add(1, 'day') ));
        const event  = TestUtils.renderIntoDocument( <EventComp layout={eventLayout} /> );
        const div    = ReactDOM.findDOMNode(event);
        expect( eventModel.isSingleDay() ).toBe(false);
        expect( div.style.length ).toBe(0);
        expect( div.classList.contains('event') ).toBe(true);
        expect( div.classList.contains('span-1') ).toBe(true);
        expect( div.classList.contains('is-continued') ).toBe(true);
    });

});
