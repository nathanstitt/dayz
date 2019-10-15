import React from 'react'; // eslint-disable-line no-unused-vars
import moment from '../src/moment-range';
import { testEventMonth, testEventRange, testEventDay, testWeekStartsOn } from './testing-layouts';

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
            const { layout, event } = testEventRange('2015-10-10', '2015-10-11');
            const forDay = layout.forDay(moment('2015-10-10'))[0];
            expect(forDay).toMatchObject({
                first: true,
                startsBefore: false,
                endsAfter: true,
                span: 1,
                stack: 0,
                event,
            });
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
        let layout;
        beforeEach(() => {
            layout = testEventMonth();
        });

        it('calculates stacking for a multi-day plus singles', () => {
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

    describe('highlighting days', () => {
        it('can use a list of days', () => {
            const layout = testEventMonth({
                date: '2018-11-01',
                highlightDays: ['2018-11-11', '2018-11-20'],
            });
            expect(layout.propsForDayContainer({
                day: moment('2018-10-10'),
            })).toMatchObject({ className: 'day before outside' });
            expect(layout.propsForDayContainer({
                day: moment('2018-11-11'),
            })).toMatchObject({ className: 'day after highlight' });
        });
        it('can use a function', () => {
            const layout = testEventMonth({
                date: '2018-11-01',
                highlightDays: d => (
                    10 === moment(d).month() ? 'tenth' : false
                ),
            });
            expect(layout.propsForDayContainer({
                day: moment('2018-10-10'),
            })).toMatchObject({ className: 'day before outside' });
            expect(layout.propsForDayContainer({
                day: moment('2018-11-12'),
            })).toMatchObject({ className: 'day after tenth' });
        });
    });

    describe('weekStartsOn', () => {
        describe('month layout', () => {
            describe('default', () => {
                it('starts the week on Sunday for "en" locale', () => {
                    const layout = testWeekStartsOn({ locale: 'en' });
                    expect(layout.range.start.isoWeekday()).toBe(7);
                });

                it('starts the week on Monday for "de" locale', () => {
                    const layout = testWeekStartsOn({ locale: 'de' });
                    expect(layout.range.start.isoWeekday()).toBe(1);
                });
            });

            describe('weekStartsOn set', () => {
                it('starts the week on Sunday when 0', () => {
                    const layout = testWeekStartsOn({ locale: 'de', weekStartsOn: 0 });
                    expect(layout.range.start.isoWeekday()).toBe(7);
                });

                it('starts the week on Monday when 1', () => {
                    const layout = testWeekStartsOn({ locale: 'en', weekStartsOn: 1 });
                    expect(layout.range.start.isoWeekday()).toBe(1);
                });
            });
        });

        describe('week layout', () => {
            describe('default', () => {
                it('starts the week on Sunday for "en" locale', () => {
                    const layout = testWeekStartsOn({ locale: 'en' });
                    expect(layout.range.start.isoWeekday()).toBe(7);
                });

                it('starts the week on Monday for "de" locale', () => {
                    const layout = testWeekStartsOn({ locale: 'de' });
                    expect(layout.range.start.isoWeekday()).toBe(1);
                });
            });

            describe('weekStartsOn set', () => {
                it('starts the week on Sunday when 0', () => {
                    const layout = testWeekStartsOn({ locale: 'de', weekStartsOn: 0 });
                    expect(layout.range.start.isoWeekday()).toBe(7);
                });

                it('starts the week on Monday when 1', () => {
                    const layout = testWeekStartsOn({ locale: 'en', weekStartsOn: 1 });
                    expect(layout.range.start.isoWeekday()).toBe(1);
                });
            });
        });
    });
});
