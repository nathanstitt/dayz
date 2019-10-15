import Duration from './duration';
import C from './constants';
import moment from '../moment-range';
import EventsCollection from './events-collection';

function cacheKey(day) {
    return day.format('YYYYMMDD');
}

function highlightedDaysFinder(days) {
    const highlighted = Object.create(null);
    days.forEach((d) => { highlighted[cacheKey(moment(d))] = true; });
    return day => (highlighted[cacheKey(day)] ? 'highlight' : false);
}

// a layout describes how the calendar is displayed.
export default class Layout {

    constructor(options) {
        this.cache = Object.create(null);
        options.date = moment(options.date);
        Object.assign(this, options);
        const cacheMethod = (
            ('day' === this.display) ? 'addtoDaysCache' : 'calculateDurations'
        );
        this.calculateRange();
        if (!this.isDisplayingAsMonth && !this.displayHours) {
            this.displayHours = this.hourRange();
        } else {
            this.displayHours = this.displayHours || [0, 24];
        }
        if (options.highlightDays) {
            this.isDayHighlighted = ('function' === typeof options.highlightDays)
                ? options.highlightDays : highlightedDaysFinder(options.highlightDays);
        }
        let multiDayCount = 0;

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
    }

    calculateRange() {
        if (this.range) {
            return;
        }

        const start = moment(this.date).locale(this.locale);
        const end = moment(this.date).locale(this.locale);

        if ('week' === this.display) {
            if (this.weekStartsOn !== undefined) {
                start.startOf('isoWeek');
                end.endOf('isoWeek');
                if (0 === this.weekStartsOn && 1 === start.isoWeekday()) {
                    start.subtract(1, 'day');
                    end.subtract(1, 'day');
                }
            } else {
                start.startOf(this.display);
                end.endOf(this.display);
            }
        } else {
            start.startOf(this.display);
            end.endOf(this.display);
        }

        this.range = moment.range(
            start,
            end,
        );

        if (this.isDisplayingAsMonth) {
            let startWeekday;
            let maxWeekday = 6;
            if (this.weekStartsOn !== undefined) {
                startWeekday = this.range.start.isoWeekday();
                if (1 === this.weekStartsOn) {
                    startWeekday -= 1;
                    maxWeekday += 1;
                }
            } else {
                startWeekday = this.range.start.weekday();
            }
            this.range.start.subtract(
                startWeekday, 'days',
            );
            this.range.end.add(
                maxWeekday - this.range.end.isoWeekday(), 'days',
            );
        }
    }

    minutesInDay() {
        return (this.displayHours[1] - this.displayHours[0]) * 60;
    }

    propsForDayContainer({ day, position }) {
        const classes = ['day'];
        const date = moment(day);
        if (moment(date).isBefore(this.date)) {
            classes.push('before');
        } else if (moment(date).isAfter(this.date)) {
            classes.push('after');
        } else {
            classes.push('current');
        }

        if (this.isDateOutsideRange(date)) {
            classes.push('outside');
        }
        const higlight = this.isDayHighlighted(date, this);
        if (higlight) {
            classes.push(higlight);
        }
        const handlers = {};
        Object.keys(this.dayEventHandlers || {}).forEach((k) => {
            handlers[k] = ev => this.dayEventHandlers[k](date, ev);
        });
        return {
            className: classes.join(' '),
            'data-date': cacheKey(day),
            style: { order: position },
            ...handlers,
        };
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
            this.forDay(day).forEach((duration) => {
                range[0] = Math.min(duration.event.start.hour(), range[0]);
                range[1] = Math.max(duration.event.end.hour(), range[1]);
            });
        });
        range[1] += 1;
        return range;
    }

    getEventsForWeek(start) {
        const day = start.clone();
        const weeklyEvents = [];
        for (let i = 0; i < 7; i++) {
            const durations = this.forDay(day);
            for (let li = 0, { length } = durations; li < length; li += 1) {
                weeklyEvents.push(durations[li]);
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
            for (let durationIndex = 0; durationIndex < weeklyEvents.length; durationIndex++) {
                const duration = weeklyEvents[durationIndex];
                // loop through each duration that is before this one
                let ceilingIndex = 0;
                for (let pi = durationIndex - 1; pi >= 0; pi--) {
                    const prevDuration = weeklyEvents[pi];
                    if (prevDuration.range.start.isSame(duration.range.start, 'd')) {
                        ceilingIndex = pi + 1;
                        break;
                    }
                }

                for (let pi = ceilingIndex; pi < durationIndex; pi++) {
                    const prevDuration = weeklyEvents[pi];

                    if (duration.range.overlaps(prevDuration.range)) {
                        duration.stack += 1;
                    }
                }
            }
            firstOfWeek.add(7, 'day');
        } while (!firstOfWeek.isAfter(this.range.end));
    }

    // This is the default implementation.
    // It will be overwritten if highlightDays option is provided
    isDayHighlighted() { return false; }

    isDateOutsideRange(date) {
        return (this.isDisplayingAsMonth && !this.date.isSame(date, 'month'));
    }

    forDay(day) {
        return this.cache[cacheKey(day)] || [];
    }

    // a single day is easy, just add the event to that day
    addtoDaysCache(event) {
        const duration = new Duration(this, event, this.range);
        this.addToCache(this.range.start, duration);
    }

    // other durations must break at week boundaries, with indicators if they were/are continuing
    calculateDurations(event) {
        const end = moment.min(this.range.end, event.range().end);
        const start = moment.max(this.range.start, event.range().start).clone();
        do {
            const range = moment.range(start, start.clone().endOf('week'));
            const duration = new Duration(this, event, range);
            this.addToCache(start, duration);
            // go to first day of next week
            start.add(7 - start.weekday(), 'day');
        } while (!start.isAfter(end));
    }

    addToCache(date, duration) {
        let found = false;
        const keys = Object.keys(this.cache);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (this.cache[key].event === duration.event) {
                found = true;
                break;
            }
        }
        if (!found) {
            duration.first = true; // eslint-disable-line no-param-reassign
        }
        const dayCache = this.cache[cacheKey(date)] || (this.cache[cacheKey(date)] = []);
        dayCache.push(duration);
    }

    displayingAs() {
        return this.display;
    }

    get isDisplayingAsMonth() {
        return 'month' === this.display;
    }

}
