/*global jest jasmine describe it expect beforeEach */

// I'm not a fan.
// takes way to long to figure out what's going on and then you miss one mock and it blows up
jest.autoMockOff();

const moment = require('moment');
require('moment-range');

const Layout = require('data/layout');
const Event  = require('data/event');
const EventsCollection = require('data/events-collection');

const testEventRange = function(startAt, endAt){
    startAt = moment(startAt); endAt = moment(endAt).endOf('day');
    const event  = new Event({ range: moment.range( moment(startAt), moment(endAt) ) });
    const events = new EventsCollection([event]);
    const layout = new Layout({ events,
                                range: moment.range(event.range().start.startOf('month'),
                                            event.range().end.endOf('month') ),
                                display: 'month', day: startAt
                              });
    return {events, layout, event};
};

const testEventDay = function(date, startAt, endAt){
    const events = new EventsCollection();
    const event  = events.add({ range: moment.range( moment(startAt), moment(endAt) ) });
    const layout = new Layout({ events,
                                range: moment.range( moment(date), moment(date).endOf('day') ),
                                display: 'day', day: startAt
                               });

    return {events, layout, event};
};

describe( 'Event Layout calculations', function() {

    describe('day layout', function(){
        it('lays out a single day', function() {
            const {layout, event} = testEventDay('2015-10-10', '2015-10-10', '2015-10-10');
            expect( layout.forDay(event.range().start) ).toEqual([jasmine.objectContaining({
                first: true, startsBefore: false, endsAfter: false, span: 1, event: event, stack: 0
            })]);
        });

        it('events end after it', function(){
            const {layout, event} = testEventDay('2015-10-15', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-15') ) ).toEqual([jasmine.objectContaining({
                startsBefore: false, endsAfter: true, span: 1, event: event, stack: 0
            })]);
        });

        it('events starts before it', function(){
            const {layout, event} = testEventDay('2015-10-20', '2015-10-15', '2015-10-20 10:15:00');
            expect( layout.forDay( moment('2015-10-20') ) ).toEqual([jasmine.objectContaining({
                startsBefore: true, endsAfter: false, span: 1, event: event, stack: 0
            })]);
        });

        it('events elapses around it', function(){
            const {layout, event} = testEventDay('2015-10-18', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-18') ) ).toEqual([jasmine.objectContaining({
                startsBefore: true, endsAfter: true, span: 1, event: event, stack: 0
            })]);
        });
    });

    describe('week or month layout', function(){
        it ('can exactly span a week', function(){
            const {layout, event} = testEventRange('2015-10-11', '2015-10-17');
            expect(layout.forDay(moment('2015-10-11') )).toEqual([jasmine.objectContaining({
                startsBefore: false, endsAfter: false,
                span: 7, event: event, stack: 0
            })]);
        });

        it ('can start before but end on a week', function(){
            const {layout, event} = testEventRange('2015-10-10', '2015-10-17');
            expect(layout.forDay(moment('2015-10-10'))).toEqual([jasmine.objectContaining({
                startsBefore: false, endsAfter: true,
                span: 1, event: event, stack: 0
            })]);

            expect(layout.forDay(moment('2015-10-11'))).toEqual([jasmine.objectContaining({
                startsBefore: true, endsAfter: false,
                span: 7, event: event, stack: 0
            })]);

        });

        it ('can start on a week, but end past it', function(){
            const {layout, event} = testEventRange('2015-10-11', '2015-10-18');
            expect( layout.forDay(event.range().start) ).toEqual([jasmine.objectContaining({
                startsBefore: false, endsAfter: true,
                span: 7, event: event, stack: 0
            })]);
            expect(layout.forDay(moment('2015-10-18'))).toEqual([jasmine.objectContaining({
                startsBefore: true, endsAfter: false,
                span: 1, event: event, stack: 0
            })]);
        });

        it ('can span past a month', function(){
            const {layout, event} = testEventRange('2015-09-28', '2015-11-03');
            expect(layout.forDay(moment('2015-09-28'))).toEqual([jasmine.objectContaining({
                span: 6, event: event, stack: 0, startsBefore: false, endsAfter: true
            })]);
            for (const date of ['2015-10-04', '2015-10-11', '2015-10-18', '2015-10-25']){
                expect(layout.forDay(moment(date))).toEqual([jasmine.objectContaining({
                    span: 7, startsBefore: true, endsAfter: true, event: event, stack: 0
                })]);
            }
            expect(layout.forDay(moment('2015-11-01'))).toEqual([jasmine.objectContaining({
                span: 3, startsBefore: true, endsAfter: false, event: event, stack: 0
            })]);
        });
    });

    describe('event stacking', function(){

        beforeEach(function(){
            const date   = moment("2015-09-11");
            this.events = new EventsCollection([
                { content: 'A short event',
                  range: moment.range( date.clone(), moment(date).add(1, 'day') ) },
                { content: 'Two Hours ~ 8-10',
                  range: moment.range( date.clone().hour(8), date.clone().hour(10) ) },
                { content: 'A Longer Event',
                  range: moment.range( date.clone().subtract(2,'days'),
                                       moment(date).add(8,'days') ) },
                { content: 'Another Event',
                  range: moment.range( date.clone().subtract(2,'days'),
                                       moment(date).add(1,'hour') ) }
            ]);
            this.layout = new Layout({ events: this.events, display: 'week',
                                       range: moment.range( moment(date).startOf('week'),
                                                   moment(date).endOf('week') )
                                     });
            this.date = date;
        });

        it( 'calculates stacking', function(){
            expect(this.events.length()).toEqual(4);
            expect(this.layout.forDay(moment('2015-09-09')).length).toEqual(2);
            const events = this.layout.forDay(this.date);
            expect(events.length).toEqual(2);

            expect(events[0].event.attributes.content).toEqual('A short event');
            expect(events[1].event.attributes.content).toEqual('Two Hours ~ 8-10');

            expect(events[0].stack).toBe(2);
            expect(events[1].stack).toBe(0);
        });

    });

    describe('hour ranges', function(){

        it( 'min/max', function(){
            const {layout, event} = testEventDay(
                '2015-10-15', '2015-10-15 06:15:00', '2015-10-20 21:12:11'
            );
            const range = layout.hourRange();
            expect(range[0]).toEqual(event.start().hour());
            expect(range[1]).toEqual(event.end().hour()+1);
        });

        it('sets a default min/max', function(){
            const {layout} = testEventDay(
                '2015-10-15', '2015-10-15 12:15:00', '2015-10-20 13:12:11'
            );
            const range = layout.hourRange();
            expect(range[0]).toEqual(7);
            expect(range[1]).toEqual(20);
        });

    });

});
