const assign = require('lodash/assign');
const each   = require('lodash/each');
const moment = require('moment');
const EventLayout = require('./event-layout');
const C = require('./constants');

function cacheKey(day){
    return day.format('YYYYMMDD');
}

// a layout describes how the calendar is displayed.
class Layout {

    constructor(options) {
        assign(this, options);
        this.cache = Object.create(null);

        let multiDayCount = 0;
        const cacheMethod = (
            ('day' === this.display) ? 'addtoDaysCache' : 'calculateSpanningLayout'
        );
        if (! this.events){ return; }
        const range = this.range;

        this.events.each( (event) => {
            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())){
                this[cacheMethod](event);
                if (!event.isSingleDay()){
                    multiDayCount += 1;
                }
            }
        });
        this.multiDayCount = multiDayCount;
        this.calculateStacking();
        if (!this.isDisplayingAsMonth() && !this.displayHours){
            this.displayHours = this.hourRange();
        } else {
            this.displayHours = this.displayHours || [0, 24];
        }
    }

    minutesInDay() {
        return (this.displayHours[1] - this.displayHours[0]) * 60;
    }

    propsForDayContainer(props){
        const classes = ['day'];
        if (this.isDateOutsideRange(props.day)){
            classes.push('outside');
        }
        return {className: classes.join(' '), style: {order: props.position}};
    }

    propsForAllDayEventContainer() {
        const style = (
            this.multiDayCount ? {flexBasis: this.multiDayCount*C.eventHeight} : {display: 'none'}
        );
        return { className: 'all-day', style };
    }

    hourRange(){
        const range = [7, 19];
        this.range.by('days', (day) => {
            each(this.forDay(day), (layout) => {
                range[0] = Math.min( layout.event.start().hour(), range[0] );
                range[1] = Math.max( layout.event.end().hour(), range[1] );
            });
        });
        range[1] += 1;
        return range;
    }

    getEventsForWeek(start){
        const day = start.clone();
        const weeklyEvents = [];
        for (let i=0; i<7; i++){
            const layouts = this.forDay(day);
            each( layouts, (layout) => {
                weeklyEvents.push(layout);
            } );
            day.add(1, 'day');
        }
        const minLong = (range) => {
            return moment.max(start, range.start).diff( moment.min(day, range.end), 'minutes' );
        };
        return weeklyEvents.sort( (a,b) =>{
            a = minLong(a.event.range()); b = minLong(b.event.range());
            return a === b ? 0 : a > b ? 1 : -1;
        });
    }

    calculateStacking(){
        const firstOfWeek = this.range.start.clone().startOf('week');
        do {
            const weeklyEvents = this.getEventsForWeek(firstOfWeek);
            for (let layoutIndex=0; layoutIndex < weeklyEvents.length; layoutIndex++){
                const layout = weeklyEvents[layoutIndex];
                // loop through each layout that is before this one
                let ceilingIndex = 0;
                for (let pi=layoutIndex-1; pi>=0; pi--){
                    const prevLayout = weeklyEvents[pi];
                    if (prevLayout.range.start.isSame(layout.range.start,'d')){
                        ceilingIndex = pi+1;
                        break;
                    }
                }
                for (let pi=ceilingIndex; pi < layoutIndex; pi++){
                    const prevLayout = weeklyEvents[pi];
                    if (layout.range.overlaps(prevLayout.range) ){
                        layout.stack++;
                    }
                }
            }
            firstOfWeek.add(7, 'day');
        } while(!firstOfWeek.isAfter(this.range.end));
    }

    isDateOutsideRange(date){
        return (this.isDisplayingAsMonth() && this.date.month() !== date.month());
    }

    forDay(day){
        return this.cache[ cacheKey(day) ] || [];
    }

    // a single day is easy, just add the event to that day
    addtoDaysCache(event){
        const layout = new EventLayout(this, event, this.range);
        this.addToCache(this.range.start, layout);
    }

    // other layouts must break at week boundaries, with indicators if they were/are continuing
    calculateSpanningLayout(event){
        const end = moment.min(this.range.end, event.range().end);
        const start = moment.max(this.range.start, event.range().start).clone();
        do {
            const range = moment.range(start, start.clone().endOf('week'));
            const layout = new EventLayout(this, event, range);
            this.addToCache(start, layout );
            // go to first day of next week
            start.add(7-start.day(), 'day');
        } while (!start.isAfter(end));

    }

    addToCache(date, eventLayout){
        date = date.clone();
        let found = false;
        each(this.cache, (key, layout) => {
            if (layout.event === eventLayout.event){
                found = true;
                return false;
            }
        });
        if (!found){
            eventLayout.first = true;
        }
        const dayCache = this.cache[ cacheKey(date) ] || (this.cache[ cacheKey(date) ]=[]);
        dayCache.push(eventLayout);
    }

    displayingAs(){
        return this.display;
    }

    isDisplayingAsMonth(){
        return 'month' === this.display;
    }

}


module.exports = Layout;
