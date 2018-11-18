import moment from '../src/moment-range';
import EventLayout from '../src/api/event-layout';
import Layout from '../src/api/layout';
import Event from '../src/api/event';

describe('Event Layout calculations', () => {
    describe('day layout', () => {
        let event;
        let layout;

        beforeEach(() => {
            event = new Event({
                content: 'test event',
                resizable: { step: 10 },
                range: moment.range(
                    '2018-11-16T13:00:00.000Z',
                    '2018-11-16T13:00:00.000Z',
                ),
            });

            layout = new EventLayout(
                new Layout({
                    display: 'week',
                    range: moment.range(
                        '2018-10-28T13:00:00.000Z',
                        '2018-12-01T13:00:00.000Z',
                    ),

                }), event, moment.range(
                    moment.range(
                        '2018-11-13T13:00:00.000Z',
                        '2018-11-19T13:00:00.000Z',
                    ),
                ),
            );
        });

        it('can adjust time', () => {
            const hour = layout.event.start.hour();
            layout.adjustEventTime('start', hour + 1, 100);
            expect(layout.event.start.hour()).toBeGreaterThan(hour);
        });
    });
});
