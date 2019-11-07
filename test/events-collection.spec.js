import EventsCollection from '../src/api/events-collection';
import Event from '../src/api/event';
import moment from '../src/moment-range';

describe('Events Collection', () => {
    describe('display events as all day events', () => {
        it('creates events from object', () => {
            const collection = new EventsCollection([
                { range: moment.range('2011-10-01', '2011-10-02') },
            ]);
            expect(collection.events.length).toEqual(1);
            const event = collection.events[0];
            expect(event).toEqual(expect.any(Event));
            expect(event.range().isSame(moment.range('2011-10-01', '2011-10-02'))).toBe(true);
        });
    });

    describe('display events as multiple NOT all day events', () => {
        describe('range is more than one day', () => {
            const range = moment.range('2011-10-01', '2011-10-02 12:00:01');

            describe('displayLabelForAllDays is any other then false', () => {
                it('creates events from object', () => {
                    const collection = new EventsCollection(
                        [{ content: 'Test Label', range }],
                        { displayAllDay: false },
                    );
                    expect(collection.events.length).toEqual(2);

                    const event = collection.events[0];
                    expect(event).toEqual(expect.any(Event));
                    expect(event.range().isSame(
                        moment.range('2011-10-01 00:00:00', '2011-10-01 23:59:59.999'),
                    )).toBe(true);
                    expect(event.content).toBe('Test Label');

                    const event_b = collection.events[1];
                    expect(event_b).toEqual(expect.any(Event));
                    expect(event_b.range().isSame(
                        moment.range('2011-10-02 00:00:00', '2011-10-02 12:00:01'),
                    )).toBe(true);
                    expect(event_b.content).toBe('Test Label');
                });
            });

            describe('displayLabelForAllDays is false', () => {
                it('creates events from object', () => {
                    const collection = new EventsCollection(
                        [{ content: 'Test Label', range }],
                        { displayAllDay: false, displayLabelForAllDays: false },
                    );
                    expect(collection.events.length).toEqual(2);

                    const event = collection.events[0];
                    expect(event).toEqual(expect.any(Event));
                    expect(event.range().isSame(
                        moment.range('2011-10-01 00:00:00', '2011-10-01 23:59:59.999'),
                    )).toBe(true);
                    expect(event.content).toBe('Test Label');

                    const event_b = collection.events[1];
                    expect(event_b).toEqual(expect.any(Event));
                    expect(event_b.range().isSame(
                        moment.range('2011-10-02 00:00:00', '2011-10-02 12:00:01'),
                    )).toBe(true);
                    expect(event_b.content).toBe(' ');
                });
            });
        });

        describe('range is less than one day', () => {
            it('creates events from object', () => {
                const collection = new EventsCollection(
                    [{ range: moment.range('2011-10-01 20:00:00', '2011-10-02 08:00:00') }],
                    { displayAllDay: false },
                );
                expect(collection.events.length).toEqual(2);

                const event = collection.events[0];
                expect(event).toEqual(expect.any(Event));
                expect(event.range().isSame(
                    moment.range('2011-10-01 20:00:00', '2011-10-01 23:59:59.999'),
                )).toBe(true);

                const event_b = collection.events[1];
                expect(event_b).toEqual(expect.any(Event));
                expect(event_b.range().isSame(
                    moment.range('2011-10-02 00:00:00', '2011-10-02 08:00:00'),
                )).toBe(true);
            });
        });
    });
});
