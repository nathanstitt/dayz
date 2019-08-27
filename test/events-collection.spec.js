import EventsCollection from '../src/api/events-collection';
import Event from '../src/api/event';
import moment from '../src/moment-range';

describe('Events Collection', () => {
    it('creates events from object', () => {
        const collection = new EventsCollection([
            { range: moment.range('2011-10-01', '2011-10-02') },
        ]);
        expect(collection.events.length).toEqual(1);
        const event = collection.events[0];
        expect(event).toEqual(expect.any(Event));
        expect(event.range().isSame(moment.range('2011-10-01', '2011-10-02'))).toBe(true);
    });

    it('creates events from object', () => {
        const collection = new EventsCollection(
            [{ range: moment.range('2011-10-01', '2011-10-02 12:00:01') }],
            { displayAllDay: false },
        );
        expect(collection.events.length).toEqual(2);

        const event = collection.events[0];
        expect(event).toEqual(expect.any(Event));
        expect(event.range().isSame(
            moment.range('2011-10-01 00:00:00', '2011-10-01 23:59:59.999'),
        )).toBe(true);

        const event_b = collection.events[1];
        expect(event_b).toEqual(expect.any(Event));
        expect(event_b.range().isSame(
            moment.range('2011-10-02 00:00:00', '2011-10-02 12:00:01'),
        )).toBe(true);
    });
});
