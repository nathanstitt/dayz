import moment from 'moment';
import range  from 'moment-range';

class EventLayout {

    constructor(event, displayRange) {

        this.event = event;
        this.startsBefore = event.start().isBefore( displayRange.start );
        this.endsAfter    = event.end().isAfter(    displayRange.end   );

        this.span = moment.min(displayRange.end, event.end()).diff(displayRange.start, 'day')+1
    }

}


export default EventLayout;
