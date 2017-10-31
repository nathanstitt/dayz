const moment = require('moment');

// an event layout describes how an event is displayed.
// A event may be split into one or more layouts in order to be split across week boundaries
export default class EventLayout {

    constructor(layout, event, displayRange) {
        this.layout = layout;
        this.event = event;
        this.stack = 0;
        this.displayRange = displayRange;
        this.startsBefore = event.start().isBefore(displayRange.start);
        this.endsAfter = event.end().isAfter(displayRange.end);
        this.range = moment.range(
            moment.max(displayRange.start, event.start()),
            moment.min(displayRange.end, event.end()),
        );
        const latest = moment.min(displayRange.end, event.end());
        this.span = Math.max(
            1, Math.round(latest.diff(displayRange.start, 'day', true)),
        );
    }

    isEditing() {
        return this.first && this.event.isEditing();
    }

    startsOnWeek() {
        return 0 === this.event.start().day();
    }

    adjustEventTime(startOrEnd, position, height) {
        if (position < 0 || position > height) { return; }
        const time = this.event[startOrEnd]()
            .startOf('day')
            .add(this.layout.displayHours[0], 'hours')
            .add(this.layout.minutesInDay() * (position / height), 'minutes');
        const { step } = this.event.get('resizable');
        if (step) {
            const rounded = Math.round(time.minute() / step) * step;
            time.minute(rounded).second(0);
        }
        this.event.emit('change');
    }

    inlineStyles() {
        if ('month' === this.layout.displayingAs() || !this.event.isSingleDay()) {
            return {};
        }
        let { start, end } = this.event.daysMinuteRange();
        const startOffset = this.layout.displayHours[0] * 60;
        start -= startOffset;
        end -= startOffset;
        const inday = this.layout.minutesInDay();
        const top = `${((start / inday) * 100).toFixed(2)}%`;
        const bottom = `${(100 - ((end / inday) * 100)).toFixed(2)}%`;
        return { top, bottom };
    }

    isResizable() {
        return (this.layout.displayingAs() !== 'month' && this.event.get('resizable'));
    }

    key() {
        return this.displayRange.start.format('YYYYMMDD') + this.event.key;
    }
    setIsResizing(val) {
        this.isResizing = val;
    }
    classNames() {
        const classes = ['event', `span-${this.span}`, `color-${this.event.colorIndex()}`];
        if (this.isResizing) classes.push('is-resizing');
        if (this.startsBefore) classes.push('is-continuation');
        if (this.endsAfter) classes.push('is-continued');
        if (this.stack) classes.push(`stack-${this.stack}`);
        if (this.isEditing()) classes.push('is-editing');
        if (this.isResizable()) classes.push('is-resizable');
        return classes.join(' ');
    }

}
