import React  from 'react';
import moment from 'moment';
import Layout from './data/layout';

const YLabels = React.createClass({

    propTypes: {
        display: React.PropTypes.oneOf(['month', 'week', 'day']),
        date:    React.PropTypes.object.isRequired,
        layout:  React.PropTypes.instanceOf(Layout).isRequired
    },

    render() {
        if (this.props.display === 'month'){
            return null;
        }

        const start = moment();
        const labels = [];
        for (let hour=1; hour<25; hour++){
            start.hour(hour);
            labels.push(<div key={hour} className="hour">{start.format('ha')}</div>);
        }
        const multiDay = <div {...this.props.layout.propsForAllDayEventContainer()}>All Day</div>;

        return (
            <div>
                <div className="y-labels">
                    {multiDay}
                    {labels}
                </div>
            </div>
        );
    }

});

export default YLabels;
