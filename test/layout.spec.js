import React from 'react'; // eslint-disable-line no-unused-vars
import moment from '../src/moment-range';
import Layout from '../src/api/layout';
import Event from '../src/api/event';
import EventsCollection from '../src/api/events-collection';

const testEventRange = function(startAtDate, endAtDate) {
    const startAt = moment(startAtDate);
    const endAt = moment(endAtDate).endOf('day');
    const event  = new Event({ range: moment.range(moment(startAt), moment(endAt)) });
    const events = new EventsCollection([event]);
    const layout = new Layout({
        events,
        range: moment.range(event.range().start.startOf('month'),
            event.range().end.endOf('month')),
        display: 'month',
        day: startAt,
    });
    return { events, layout, event };
};

const testEventDay = function(date, startAt, endAt) {
    const events = new EventsCollection();
    const event  = events.add({ range: moment.range(moment(startAt), moment(endAt)) });
    const layout = new Layout({
        events,
        range: moment.range(moment(date), moment(date).endOf('day')),
        display: 'day',
        day: startAt,
    });

    return { events, layout, event };
};

describe('Layout calculations', () => {
    describe('day layout', () => {
        it('lays out a single day', () => {
            const { layout, event } = testEventDay('2015-10-10', '2015-10-10T08:00:00.000Z', '2015-10-10T12:00:00.000Z');
            expect(layout.forDay(event.range().start)).toEqual([expect.objectContaining({
                first: true, startsBefore: false, endsAfter: false, span: 1, event, stack: 0,
            })]);
        });

        it('events end after it', () => {
            const { layout, event } = testEventDay('2015-10-15', '2015-10-15', '2015-10-20');
            expect(layout.forDay(moment('2015-10-15'))).toEqual([expect.objectContaining({
                startsBefore: false, endsAfter: true, span: 1, event, stack: 0,
            })]);
        });

        it('events starts before it', () => {
            const { layout, event } = testEventDay('2015-10-20', '2015-10-15', '2015-10-20 10:15:00');
            expect(layout.forDay(moment('2015-10-20'))).toEqual([expect.objectContaining({
                startsBefore: true, endsAfter: false, span: 1, event, stack: 0,
            })]);
        });

        it('events elapses around it', () => {
            const { layout, event } = testEventDay('2015-10-18', '2015-10-15', '2015-10-20');
            expect(layout.forDay(moment('2015-10-18'))).toEqual([expect.objectContaining({
                startsBefore: true, endsAfter: true, span: 1, event, stack: 0,
            })]);
        });
    });

    describe('week or month layout', () => {
        it('can exactly span a week', () => {
            const { layout, event } = testEventRange('2015-10-11', '2015-10-17');
            expect(layout.forDay(moment('2015-10-11'))).toEqual([expect.objectContaining({
                startsBefore: false,
                endsAfter: false,
                span: 7,
                event,
                stack: 0,
            })]);
        });

        it('can start before but end on a week', () => {
            const { layout, event } = testEventRange('2015-10-10', '2015-10-17');
            expect(layout.forDay(moment('2015-10-10'))).toEqual([expect.objectContaining({
                startsBefore: false,
                endsAfter: true,
                span: 1,
                event,
                stack: 0,
            })]);

            expect(layout.forDay(moment('2015-10-11'))).toEqual([expect.objectContaining({
                startsBefore: true,
                endsAfter: false,
                span: 7,
                event,
                stack: 0,
            })]);
        });

        it('can start on a week, but end past it', () => {
            const { layout, event } = testEventRange('2015-10-11', '2015-10-18');
            expect(layout.forDay(event.range().start)).toEqual([expect.objectContaining({
                startsBefore: false,
                endsAfter: true,
                span: 7,
                event,
                stack: 0,
            })]);
            expect(layout.forDay(moment('2015-10-18'))).toEqual([expect.objectContaining({
                startsBefore: true,
                endsAfter: false,
                span: 1,
                event,
                stack: 0,
            })]);
        });

        it('can span past a month', () => {
            const { layout, event } = testEventRange('2015-09-28', '2015-11-03');
            expect(layout.forDay(moment('2015-09-28'))).toEqual([expect.objectContaining({
                span: 6, event, stack: 0, startsBefore: false, endsAfter: true,
            })]);
            ['2015-10-04', '2015-10-11', '2015-10-18', '2015-10-25'].forEach((date) => {
                expect(layout.forDay(moment(date))).toEqual([expect.objectContaining({
                    span: 7, startsBefore: true, endsAfter: true, event, stack: 0,
                })]);
            });
            expect(layout.forDay(moment('2015-11-01'))).toEqual([expect.objectContaining({
                span: 3, startsBefore: true, endsAfter: false, event, stack: 0,
            })]);
        });
    });

    describe('event stacking', () => {
        let events;
        let date;
        let layout;

        beforeEach(() => {
            date   = moment('2015-09-11');
            events = new EventsCollection([
                { content: 'A short event',
                    range: moment.range(date.clone(), moment(date).add(1, 'day')) },
                { content: 'Two Hours ~ 8-10',
                    range: moment.range(date.clone().hour(8), date.clone().hour(10)) },
                { content: 'A Longer Event',
                    range: moment.range(date.clone().subtract(2, 'days'),
                        moment(date).add(8, 'days')) },
                { content: 'Another Event',
                    range: moment.range(date.clone().subtract(2, 'days'),
                        moment(date).add(1, 'hour')) },
            ]);
            layout = new Layout({
                events,
                display: 'week',
                range: moment.range(moment(date).startOf('week'),
                    moment(date).endOf('week')),
            });
        });

        it('calculates stacking', () => {
            expect(events).toHaveLength(4);
            expect(layout.forDay(moment('2015-09-09'))).toHaveLength(2);
            events = layout.forDay(date);
            expect(events).toHaveLength(2);
            expect(events[0].event.attributes.content).toEqual('A short event');
            expect(events[1].event.attributes.content).toEqual('Two Hours ~ 8-10');
            expect(events[0].stack).toBe(2);
            expect(events[1].stack).toBe(0);
        });

        it('calculates stacking for a multi-day plus singles', () => {
            layout = new Layout({
                display: 'month',
                range: moment.range(
                    '2018-10-28T13:00:00.000Z',
                    '2018-12-01T13:00:00.000Z',
                ),
                events: new EventsCollection([
                    {
                        content: '3-day',
                        range: moment.range(
                            '2018-11-14T13:00:00.000Z',
                            '2018-11-16T13:00:00.000Z',
                        ),
                    }, {
                        content: '1-day',
                        range: moment.range(
                            '2018-11-16T13:00:00.000Z',
                            '2018-11-16T13:00:00.000Z',
                        ),
                    }, {
                        content: '1-day',
                        range: moment.range(
                            '2018-11-16T13:00:00.000Z',
                            '2018-11-16T13:00:00.000Z',
                        ),
                    },
                ]),
            });

            const forWeek = layout.getEventsForWeek(
                moment('2018-11-11T13:00:00.000Z'),
            );
            expect(forWeek).toHaveLength(3);
            expect(forWeek[0].event.content).toEqual('3-day');
            expect(forWeek[0].stack).toEqual(0);
            expect(forWeek[1].event.content).toEqual('1-day');
            expect(forWeek[1].stack).toEqual(1);
            expect(forWeek[2].stack).toEqual(0);
        });
    });

    describe('hour ranges', () => {
        it('min/max', () => {
            const { layout, event } = testEventDay(
                '2015-10-15', '2015-10-15 06:15:00', '2015-10-20 21:12:11',
            );
            const range = layout.hourRange();
            expect(range[0]).toEqual(event.start.hour());
            expect(range[1]).toEqual(event.end.hour() + 1);
        });

        it('sets a default min/max', () => {
            const { layout } = testEventDay(
                '2015-10-15', '2015-10-15 12:15:00', '2015-10-20 13:12:11',
            );
            const range = layout.hourRange();
            expect(layout.events).toHaveLength(1);
            expect(range[0]).toEqual(7);
            expect(range[1]).toEqual(20);
        });
    });
});
