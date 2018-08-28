import EventLayout from './event-layout';
import C from './constants';
import moment from '../moment-range';
import EventsCollection from './events-collection';

function cacheKey(day) {
    return day.format('YYYYMMDD');
}

// a layout describes how the calendar is displayed.
export default class Layout {

    constructor(options) {
        Object.assign(this, options);
        this.cache = Object.create(null);
        if (options.highlightDays) {
            this.highlightDays = options.highlightDays.map(d => moment(d));
        }
        let multiDayCount = 0;
        const cacheMethod = (
            ('day' === this.display) ? 'addtoDaysCache' : 'calculateSpanningLayout'
        );
        if (!this.events) { this.events = new EventsCollection(); }
        const { range } = this;

        this.events.forEach((event) => {
            // we only care about events that are in the range we were provided
            if (range.overlaps(event.range())) {
                this[cacheMethod](event);
                if (!event.isSingleDay()) {
                    multiDayCount += 1;
                }
            }
        });
        this.multiDayCount = multiDayCount;
        this.calculateStacking();
        if (!this.isDisplayingAsMonth() && !this.displayHours) {
            this.displayHours = this.hourRange();
        } else {
            this.displayHours = this.displayHours || [0, 24];
        }
    }

    minutesInDay() {
        return (this.displayHours[1] - this.displayHours[0]) * 60;
    }

    propsForDayContainer(props) {
        const classes = ['day'];
        if (this.isDateOutsideRange(props.day)) {
            classes.push('outside');
        }
        if (this.isDayHighlighted(props.day)) {
            classes.push('highlight');
        }
        return { className: classes.join(' '), style: { order: props.position } };
    }

    propsForAllDayEventContainer() {
        const style = (
            this.multiDayCount ? { flexBasis: this.multiDayCount * C.eventHeight } : { display: 'none' }
        );
        return { className: 'all-day', style };
    }

    hourRange() {
        const range = [7, 19];
        Array.from(this.range.by('days')).forEach((day) => {
            this.forDay(day).forEach((layout) => {
                range[0] = Math.min(layout.event.start().hour(), range[0]);
                range[1] = Math.max(layout.event.end().hour(), range[1]);
            });
        });
        range[1] += 1;
        return range;
    }

    getEventsForWeek(start) {
        const day = start.clone();
        const weeklyEvents = [];
        for (let i = 0; i < 7; i++) {
            const layouts = this.forDay(day);
            for (let li = 0, { length } = layouts; li < length; li += 1) {
                weeklyEvents.push(layouts[li]);
            }
            day.add(1, 'day');
        }
        const minLong = range => moment.max(start, range.start).diff(moment.min(day, range.end), 'minutes');
        return weeklyEvents.sort((al, bl) => {
            const a = minLong(al.event.range());
            const b = minLong(bl.event.range());
            return a === b ? 0 : a > b ? 1 : -1; // eslint-disable-line no-nested-ternary
        });
    }

    calculateStacking() {
        const firstOfWeek = this.range.start.clone().startOf('week');
        do {
            const weeklyEvents = this.getEventsForWeek(firstOfWeek);
            for (let layoutIndex = 0; layoutIndex < weeklyEvents.length; layoutIndex++) {
                const layout = weeklyEvents[layoutIndex];
                // loop through each layout that is before this one
                let ceilingIndex = 0;
                for (let pi = layoutIndex - 1; pi >= 0; pi--) {
                    const prevLayout = weeklyEvents[pi];
                    if (prevLayout.range.start.isSame(layout.range.start, 'd')) {
                        ceilingIndex = pi + 1;
                        break;
                    }
                }
                for (let pi = ceilingIndex; pi < layoutIndex; pi++) {
                    const prevLayout = weeklyEvents[pi];
                    if (layout.range.overlaps(prevLayout.range)) {
                        layout.stack += 1;
                    }
                }
            }
            firstOfWeek.add(7, 'day');
        } while (!firstOfWeek.isAfter(this.range.end));
    }

    isDayHighlighted(date) {
        return Boolean(
            this.highlightDays && this.highlightDays.find(d => d.isSame(date, 'day')),
        );
    }

    isDateOutsideRange(date) {
        return (this.isDisplayingAsMonth() && this.date.month() !== date.month());
    }

    forDay(day) {
        return this.cache[cacheKey(day)] || [];
    }

    // a single day is easy, just add the event to that day
    addtoDaysCache(event) {
        const layout = new EventLayout(this, event, this.range);
        this.addToCache(this.range.start, layout);
    }

    // other layouts must break at week boundaries, with indicators if they were/are continuing
    calculateSpanningLayout(event) {
        const end = moment.min(this.range.end, event.range().end);
        const start = moment.max(this.range.start, event.range().start).clone();
        do {
            const range = moment.range(start, start.clone().endOf('week'));
            const layout = new EventLayout(this, event, range);
            this.addToCache(start, layout);
            // go to first day of next week
            start.add(7 - start.day(), 'day');
        } while (!start.isAfter(end));
    }

    addToCache(date, eventLayout) {
        let found = false;
        for (const key in this.cache) { // eslint-disable-line no-restricted-syntax
            if (this.cache[key].event === eventLayout.event) {
                found = true;
                break;
            }
        }
        if (!found) {
            eventLayout.first = true; // eslint-disable-line no-param-reassign
        }
        const dayCache = this.cache[cacheKey(date)] || (this.cache[cacheKey(date)] = []);
        dayCache.push(eventLayout);
    }

    displayingAs() {
        return this.display;
    }

    isDisplayingAsMonth() {
        return 'month' === this.display;
    }

}
