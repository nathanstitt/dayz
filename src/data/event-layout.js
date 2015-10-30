import moment from 'moment';
import range  from 'moment-range';

const MINUTES_IN_DAY = 1440;

class EventLayout {

    constructor(layout, event, displayRange) {
        this.layout = layout;
        this.event = event;
        this.startsBefore = event.start().isBefore( displayRange.start );
        this.endsAfter    = event.end().isAfter(    displayRange.end   );
        const latest = moment.min( displayRange.end.clone(), event.end() );
        this.span = Math.max(
            1, Math.round(latest.diff(displayRange.start, 'day', true))
        );
    }

    isEditing() {
        return this.first && this.event.isEditing();
    }

    inlineStyles() {
        if (this.layout.displayingAs() == 'month' || !this.event.isSingleDay()){
            return {};
        } else {
            const {start, end} = this.event.daysMinuteRange();
            const top    = ( ( start /  MINUTES_IN_DAY ) * 100).toFixed(2) + '%';
            const bottom = ( 100 - ( ( end / MINUTES_IN_DAY ) * 100 ) ).toFixed(2) + '%';
            return { top, bottom };
        }
    }
}


export default EventLayout;
