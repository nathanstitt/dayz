import moment from 'moment'
import EventLayout from './event-layout'
import C from './constants'

function cacheKey(day){
    return day.format('YYYYMMDD')
}

class Layout {

    constructor(events, range, options) {
        this.options = options
        this.cache = Object.create(null)
        this.range = range
        this.events = events
        let multiDayCount = 0
        const cacheMethod = (
            ('day' === options.display) ? 'addtoDaysCache' : 'calculateSpanningLayout'
        )
        if (! events){ return }
        events.each( function(event){
            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())){
                this[cacheMethod](event)
                if (!event.isSingleDay()){
                    multiDayCount += 1
                }
            }
        }, this)
        this.multiDayCount = multiDayCount
        this.calculateStacking()
    }

    propsForAllDayEventContainer() {
        const style = (
            this.multiDayCount ? {flexBasis: this.multiDayCount*C.eventHeight} : {display: 'none'}
        )
        return { className: 'all-day', style }
    }

    hourRangeForWeek(firstDay){
        const day = firstDay.clone()
        const range = [7, 19]
        for (let d = 0; d < 7; d++){
            const layouts = this.forDay(day)
            for (let i=0; i < layouts.length; i++){
                range[0] = Math.min( layouts[i].event.start().hour(), range[0] )
                range[1] = Math.max( layouts[i].event.end().hour(), range[1] )
            }
            day.add(1, 'day')
        }
        return range
    }

    getEventsForWeek(day){
        day = day.clone()
        const weeklyEvents = []
        for (let i=0; i<7; i++){
            const layouts = this.forDay(day)
            if (layouts.length){
                this.cache[ cacheKey(day) ] = layouts
                for (const layout of layouts){
                    if (layout.event.isSingleDay()){ continue }
                    weeklyEvents.push(layout)
                }
            }
            day.add(1, 'day')
        }
        return weeklyEvents
    }

    calculateStacking(){
        const firstOfWeek = this.range.start.clone().startOf('week')
        do {
            const weeklyEvents = this.getEventsForWeek(firstOfWeek)
            for (let i=0; i < weeklyEvents.length; i++){
                const layout = weeklyEvents[i]
                layout.stack = 0
                // loop through eacy layouts are before this one
                for (let pi=i-1; pi>=0; pi--){
                    const prevLayout = weeklyEvents[pi]
                    // if the previous layout starts on the same cell then we don't need
                    // to stack it to clear previous layouts
                    if ( (prevLayout.startsBefore && layout.startsBefore ) ||
                         (prevLayout.event.start().isSame(layout.event.start(),'d')) ||
                         (layout.startsBefore && prevLayout.startsOnWeek()) ||
                         (prevLayout.startsBefore && layout.startsOnWeek()) ) {
                        break
                    } else {
                        layout.stack++
                    }
                }
            }
            firstOfWeek.add(7, 'day')
        } while(!firstOfWeek.isAfter(this.range.end))
    }

    isDateOutsideRange(date){
        return ('month' === this.options.display && !this.range.contains(date))
    }

    forDay(day){
        return this.cache[ cacheKey(day) ] || []
    }

    // a single day is easy, just add the event to that day
    addtoDaysCache(event){
        const layout = new EventLayout(this, event, this.range)
        this.addToCache(this.range.start, layout)
    }

    // other layouts must break at week boundaries, with indicators if they were/are continuing
    calculateSpanningLayout(event){
        const end = moment.min(this.range.end, event.range().end)
        const start = moment.max(this.range.start, event.range().start).clone()
        do {
            const range = moment.range(start, start.clone().endOf('week'))
            const layout = new EventLayout(this, event, range)
            this.addToCache(start, layout )
            // go to first day of next week
            start.add(7-start.day(), 'day')
        } while (!start.isAfter(end))

    }

    addToCache(date, eventLayout){
        date = date.clone()
        let found = false
        outer_block: {
            for (let key in this.cache ){
                for (let layout of this.cache[key]){
                    if (layout.event === eventLayout.event){
                        found = true
                        break outer_block
                    }
                }
            }
        }
        if (!found){
            eventLayout.first = true
        }
        const dayCache = this.cache[ cacheKey(date) ] || (this.cache[ cacheKey(date) ]=[])
        dayCache.push(eventLayout)
    }

    displayingAs(){
        return this.options.display
    }

}


export default Layout
