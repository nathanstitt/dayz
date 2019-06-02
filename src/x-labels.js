import React  from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

export default class XLabels extends React.Component {

    static propTypes = {
        display: PropTypes.oneOf(['month', 'week', 'day']),
        date:    PropTypes.object.isRequired,
        dateFormat: PropTypes.string,
    }

    get days() {
        const days = [];
        if ('day' === this.props.display) {
            days.push(moment(this.props.date));
        } else {
            const day = moment(this.props.date).startOf('week');
            for (let i = 0; i < 7; i += 1) {
                days.push(day.clone().add(i, 'day'));
            }
        }
        return days;
    }

    render() {
        let format = this.props.dateFormat || 'ddd, MMM Do';
        if ('month' === this.props.display) {
            format = 'dddd';
        }

        return (
            <div className="x-labels">{this.days.map(day => <div key={day.format('YYYYMMDD')} className="day-label">
                {day.format(format)}
            </div>)}
            </div>
        );
    }

}
