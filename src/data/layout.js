import moment from 'moment';
import range  from 'moment-range';
import EventLayout from './event-layout';

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
        if (! events){ return }
        events.each( function(event){

            // console.log('Range: ', `${range.start.toString()} : ${range.end.toString()}`);
            // console.log('Event: ', `${event.range().start.toString()} : ${event.range().end.toString()}`);
            // console.log( range.overlaps(event.range()) );

            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())){
                this[cacheMethod](event);
            }
        }, this);

        this.calculateStacking();
    }

    hourRangeForWeek(firstDay){
        const day = firstDay.clone();
        const range = [7, 19];
        for (let i=0; i<7; i++){
            const layouts = this.forDay(day);
            for (let i=0; i < layouts.length; i++){

                range[0] = Math.min( layouts[i].event.start().hour(), range[0] );
                range[1] = Math.max( layouts[i].event.end().hour(),   range[1] );
            }
            day.add(1, 'day');
        }
        return range;
    }

    calculateStacking(){
        const day = this.range.start.clone().startOf('week');
        do {
            const weeklyEvents = [];
            for (let i=0; i<7; i++){
                const layouts = this.forDay(day);
                if (layouts.length){
                    this.cache[ cacheKey(day) ] = layouts;
                    for (const layout of layouts){
                        weeklyEvents.push(layout);
                    }
                }
                day.add(1, 'day')
            }

            for (let i=0; i < weeklyEvents.length; i++){
                const layout = weeklyEvents[i];
                layout.stack = 0;
                // find out how many layouts are before this one
                for (let pi=i-1; pi>=0; pi--){
                    const se = weeklyEvents[pi];

                    if (se.event.range().start.isSame(layout.event.range().start,'d')){
                        layout.stack=1;  // the one right before this has the same day so we only stack one high
                        break;
                    } else {
                        layout.stack++;
                    }
                }
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
        const layout = new EventLayout(event, this.range);
        this.addToCache(this.range.start, layout);
        // this.addToCache(this.range.start, { startsBefore: this.range.start.isAfter( event.range().start ),
        //                                     endsAfter: this.range.end.isBefore(event.range().end),
        //                                     event, span: 1 });
    }

    // other layouts must break at week boundaries, with indicators if they were/are continuing
    calculateSpanningLayout(event){

        const end = moment.min(this.range.end, event.range().end);
        const start = moment.max(this.range.start, event.range().start);

        do {
            const layout = new EventLayout(event, moment.range(start, start.clone().endOf('week')) );

            this.addToCache(start, layout );

            // { startsBefore, endsAfter, event,
            //                          span: moment.min(endOfWeek, event.range().end).diff(start, 'day')+1

            // go to first day of next week
            start.add(7-start.day(), 'day');

        } while (!start.isAfter(end));

    }


    addToCache(date, attributes){
        //console.log(`Added for date: ${date.toString()}`)
        const dayCache = this.cache[ cacheKey(date) ] || (this.cache[ cacheKey(date) ]=[]);
        dayCache.push(attributes);
    }

}


export default Layout;
