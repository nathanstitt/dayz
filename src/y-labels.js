import React     from 'react';
import PropTypes from 'prop-types';
import moment    from './moment-range';
import Layout    from './api/layout';

export default class YLabels extends React.Component {

    static propTypes = {
        display:    PropTypes.oneOf(['month', 'week', 'day']).isRequired,
        date:       PropTypes.object.isRequired,
        layout:     PropTypes.instanceOf(Layout).isRequired,
        timeFormat: PropTypes.string,
    }

    static defaultProps = {
        timeFormat: 'ha',
    }

    get hours() {
        const [start, end] = this.props.layout.displayHours;
        return Array(end - start).fill().map((_, i) => i + start);
    }

    renderLabels() {
        const day = moment().startOf('hour');
        return this.hours.map(hour => <div key={hour} className="hour">{day.hour(hour).format(this.props.timeFormat)}</div>);
    }

    render() {
        if ('month' === this.props.display) {
            return null;
        }
        return (
            <div>
                <div className="y-labels">
                    <div {...this.props.layout.propsForAllDayEventContainer()}>All Day</div>
                    {this.renderLabels()}
                </div>
            </div>
        );
    }

}
