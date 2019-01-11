import moment from '../src/moment-range';
import Duration from '../src/api/duration';
import Layout from '../src/api/layout';
import Event from '../src/api/event';

describe('Event Layout calculations', () => {
    describe('day layout', () => {
        let event;
        let duration;

        beforeEach(() => {
            event = new Event({
                content: 'test event',
                resizable: { step: 10 },
                className: 'foo',
                range: moment.range(
                    '2018-11-16T13:00:00.000Z',
                    '2018-11-16T13:00:00.000Z',
                ),
            });

            duration = new Duration(
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
            const hour = duration.event.start.hour();
            duration.adjustEventTime('start', hour + 1, 100);
            expect(duration.event.start.hour()).not.toEqual(hour);
        });
        it('renders className', () => {
            expect(duration.classNames()).toEqual(
                'event span-1 is-continuation is-resizable foo',
            );
        });
    });
});
