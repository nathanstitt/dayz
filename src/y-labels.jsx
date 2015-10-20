import React  from 'react';
import moment from 'moment';
import Layout from './data/layout';
import Event  from './event';
import map    from 'lodash/collection/map';

const YLabels = React.createClass({

    propTypes: {
        display: React.PropTypes.oneOf(['month', 'week', 'day']),
        date:    React.PropTypes.object.isRequired
    },

    render() {
        if (this.props.display == 'month'){
            return null;
        }

        const start = moment().startOf('day');
        const labels = [];

        for (let hour=0; hour<24; hour++){
            start.add(1, 'hour');
            labels.push(<div key={start.format('ha')} className="hour">{start.format('ha')}</div>);
        }

        return (
            <div className="y-labels">{labels}</div>
        );
    }

});

export default YLabels;
