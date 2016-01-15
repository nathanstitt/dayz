/*global jest jasmine describe it expect */

jest.autoMockOff();

const EventsCollection = require('data/events-collection');
const Event = require('data/event');
const moment = require('moment');
require('moment-range'); // needed in order to for range to install itself

describe( 'Events Collection', function() {

    it('creates events from object', function(){
        const collection = new EventsCollection([
            { range: moment.range( '2011-10-01', '2011-10-02') }
        ]);
        expect(collection.events.length).toEqual(1);
        const event = collection.events[0];
        expect(event).toEqual(jasmine.any(Event));
        expect( event.range().isSame(moment.range('2011-10-01', '2011-10-02')) ).toBe(true);
    });

});
