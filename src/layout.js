import moment from 'moment'
import sortBy from 'lodash/collection/sortby'
import range  from 'moment-range';

function cacheKey(day){
    return day.format('YYYYMMDD');
}

class Layout {

    constructor(events, range, options) {
        this.options = options;
        this.cache = Object.create(null);
        this.range = range;
        const cacheMethod = ('day' === options.display) ? 'addtoDaysCache' : 'calculateSpanningLayout';
        // console.log("Events: " , events);
        events.each(function(event){

            // console.log('Range: ', `${range.start.toString()} : ${range.end.toString()}`);
            // console.log('Event: ', `${event.range().start.toString()} : ${event.end.toString()}`);
            // console.log( range.overlaps(event.range) );

            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())){
                this[cacheMethod](event);
            }
        }, this);

        if ('month' === options.display) {
            this.calculateStacking();
        }
    }

    calculateStacking(){
        const day = this.range.start.clone().startOf('week');
        do {
            const weeklyEvents = [];
            for (let i=0; i<7; i++){
                const layouts = this.forDay(day) || [];
                for (const layout of layouts){
                    weeklyEvents.push(layout);
                }
                day.add(1, 'day')
            }

            const sortedEvents = sortBy(weeklyEvents, function(layout){
                layout.event.range().start.diff(layout.event.range().end);
            });

            for (let i=0; i<sortedEvents.length; i++){
                sortedEvents[i].stack=i;
            }

            // console.log('Range: ', `${day.toString()} : ${this.range.end.toString()}`);

        } while(!day.isAfter(this.range.end));
    }

    isDateOutsideRange(date){
        return ('month' === this.options.display && !this.range.contains(date));
    }

    forDay(day){
        return this.cache[ cacheKey(day) ] || [];
    }

    // a single day is easy, just add the event to that day
    addtoDaysCache(event){
        // console.log(`${event.range().start.toString()} isBefore: ${startAt.toString()}`);
        this.addToCache(this.range.start, { startsBefore: this.range.start.isAfter( event.range().start ),
                                            endsAfter: this.range.end.isBefore(event.range().end),
                                            event, span: 1 });
    }

    // other layouts must break at week boundaries, with indicators if they were/are continuing
    calculateSpanningLayout(event){

        const end = moment.min(this.range.end, event.range().end);
        const start = moment.max(this.range.start, event.range().start);

        do {
            //console.log(`isBefore: ${event.range().start.toString()} isBefore ${start.toString()} == ${event.range().start.isBefore(start)}`);
            // console.log("Start: ", start);

            const endOfWeek = start.clone().endOf('week')

            const startsBefore  = event.range().start.isBefore(start);
            const endsAfter = event.range().end.isAfter(endOfWeek);

            //console.log(`${endOfWeek.toString()} : ${event.range().end.toString()}`);
            //console.log(`span: ${moment.min(endOfWeek, event.range().end).day()+1}`)

            this.addToCache(start, { startsBefore, endsAfter, event,
                                     span: moment.min(endOfWeek, event.range().end).diff(start, 'day')+1
                                   });
            // go to first day of next week
            start.add(7-start.day(), 'day');
            //            console.log(`Moved to ${start.format('ddd DD')} -> ${start.toString()} isBefore ${endOfWeek.toString()} == ${start.isBefore(end)}`);
        } while (!start.isAfter(end));

    }


    addToCache(date, attributes){
        //console.log(`Added for date: ${date.toString()}`)
        const dayCache = this.cache[ cacheKey(date) ] || (this.cache[ cacheKey(date) ]=[]);
        dayCache.push(attributes);
    }

}


export default Layout;
