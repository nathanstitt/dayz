jest.autoMockOff()

const EventsCollection = require('../src/events-collection');
const Event = require('../src/event');
const moment = require('moment');
const Range  = require('moment-range');


describe( 'Events Collection', function() {

    it('creates events from object', function(){
        const collection = new EventsCollection([
            { range: new Range( '2011-10-01', '2011-10-02') }
        ]);
        expect(collection.events.length).toEqual(1);
        const event = collection.events[0];
        expect(event).toEqual(jasmine.any(Event));
        expect( event.range().isSame(new Range('2011-10-01', '2011-10-02')) ).toBe(true)
    });

});
