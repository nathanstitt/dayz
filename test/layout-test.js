// i'm not a fan.  takes way to long to figure out what's going on and then you miss one mock and it blows up
jest.autoMockOff()

const moment = require('moment');
const range  = require('moment-range');
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
                startsBefore: false,
                endsAfter: false,
                span: 1,
                event: event
            }]);
        });

        it('events end after it', function(){
            const {layout, event} = TestEventDay('2015-10-15', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-15') ) ).toEqual([{
                startsBefore: false, endsAfter: true, span: 1, event: event
            }]);
        });

        it('events starts before it', function(){
            const {layout, event} = TestEventDay('2015-10-20', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-20') ) ).toEqual([{
                startsBefore: true, endsAfter: false, span: 1, event: event
            }]);
        });

        it('events elapses around it', function(){
            const {layout, event} = TestEventDay('2015-10-18', '2015-10-15', '2015-10-20');
            expect( layout.forDay( moment('2015-10-18') ) ).toEqual([{
                startsBefore: true, endsAfter: true, span: 1, event: event
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

});
