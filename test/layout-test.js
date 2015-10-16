// i'm not a fan.  takes way to long to figure out what's going on and then you miss one mock and it blows up
jest.autoMockOff()

const moment = require('moment');
const Range  = require('moment-range');
const Layout = require('../src/layout');
const Event  = require('../src/event');
const EventsCollection = require('../src/events-collection');

const TestEventRange = function(startAt, endAt){
    startAt = moment(startAt); endAt = moment(endAt).endOf('day');
    const event  = new Event({ range: moment.range( moment(startAt), moment(endAt) ) });
    const events = new EventsCollection([event]);
    const layout = new Layout( events,
                               moment.range(event.range().start.startOf('month'),
                                            event.range().end.endOf('month') ),
                               {display: 'month', day: startAt});
    return {events, layout, event};
}

const TestEventDay = function(date, startAt, endAt){
    const event  = new Event({ range: moment.range( moment(startAt), moment(endAt).endOf('day') ) })
    const events = new EventsCollection([event]);
    const layout = new Layout( events,
                               moment.range( moment(date), moment(date).endOf('day') ),
                               {display: 'day', day: event.range().start}
                             );

    return {events, layout, event};
}

describe( 'Event Layout calculations', function() {

    describe('day layout', function(){
        it('lays out a single day', function() {
            const {layout, event} = TestEventDay('2015-10-10', '2015-10-10', '2015-10-10');
            expect( layout.forDay(event.range().start) ).toEqual([{
                startsBefore: false, endsAfter: false, span: 1, event: event, stack: 0
            }]);
        });

        it('events end after it', function(){
            const {layout, event} = TestEventDay('2015-10-15', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-15') ) ).toEqual([{
                startsBefore: false, endsAfter: true, span: 1, event: event, stack: 0
            }]);
        });

        it('events starts before it', function(){
            const {layout, event} = TestEventDay('2015-10-20', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-20') ) ).toEqual([{
                startsBefore: true, endsAfter: false, span: 1, event: event, stack: 0
            }]);
        });

        it('events elapses around it', function(){
            const {layout, event} = TestEventDay('2015-10-18', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-18') ) ).toEqual([{
                startsBefore: true, endsAfter: true, span: 1, event: event, stack: 0
            }]);
        });
    })

    describe('week or month layout', function(){
        it ('can exactly span a week', function(){
            const {layout, event} = TestEventRange('2015-10-11', '2015-10-17');
            expect([{
                startsBefore: false, endsAfter: false,
                span: 7, event: event, stack: 0
            }]).toEqual( layout.forDay(moment('2015-10-11') ) )
        })

        it ('can start before but end on a week', function(){
            const {layout, event} = TestEventRange('2015-10-10', '2015-10-17');
            expect([{
                startsBefore: false, endsAfter: true,
                span: 1, event: event, stack: 0
            }]).toEqual(layout.forDay(moment('2015-10-10')));

            expect([{
                startsBefore: true, endsAfter: false,
                span: 7, event: event, stack: 0
            }]).toEqual(layout.forDay(moment('2015-10-11')));

        });

        it ('can start on a week, but end past it', function(){
            const {layout, event} = TestEventRange('2015-10-11', '2015-10-18');
            expect( layout.forDay(event.range().start) ).toEqual([{
                startsBefore: false, endsAfter: true,
                span: 7, event: event, stack: 0
            }])
            expect(layout.forDay(moment('2015-10-18'))).toEqual([{
                startsBefore: true, endsAfter: false,
                span: 1, event: event, stack: 0
            }]);
        });

        it ('can span past a month', function(){
            const {layout, event} = TestEventRange('2015-09-28', '2015-11-03');
            expect(layout.forDay(moment('2015-09-28'))).toEqual([{
                span: 6, event: event, stack: 0, startsBefore: false, endsAfter: true,
            }])
            for (const date of ['2015-10-04', '2015-10-11', '2015-10-18', '2015-10-25']){
                expect(layout.forDay(moment('2015-10-04'))).toEqual([{
                    span: 7, startsBefore: true, endsAfter: true, event: event, stack: 0
                }])
            }
            expect(layout.forDay(moment('2015-11-01'))).toEqual([{
                span: 3, startsBefore: true, endsAfter: false, event: event, stack: 0
            }])
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
                  range: moment.range( date.clone().subtract(2,'days'), moment(date).add(8,'days') ) },
                { content: 'Another Event',
                  range: moment.range( date.clone().subtract(2,'days'), moment(date).add(1,'hour') ) }
            ]);
            this.layout = new Layout(this.events,
                                     moment.range( moment(date).startOf('week'), moment(date).endOf('week') ),
                                     {display: 'week'});
            this.date = date;
        });

        it( 'calculates stacking', function(){
            expect(this.events.length()).toEqual(4)
            expect(this.layout.forDay(moment('2015-09-09')).length).toEqual(2)
            const events = this.layout.forDay(this.date);
            expect(events.length).toEqual(2);

            expect(events[0].event.attributes.content).toEqual('A short event')
            expect(events[1].event.attributes.content).toEqual('Two Hours ~ 8-10')

            expect(events[0].stack).toBe(2)
            expect(events[1].stack).toBe(1)
        });

    });
});
