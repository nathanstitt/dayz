const React  = require('react');
const map    = require('lodash/map');

const XLabels = React.createClass({

    propTypes: {
        display: React.PropTypes.oneOf(['month', 'week', 'day']),
        date:    React.PropTypes.object.isRequired
    },

    render() {
        let days = [];
        if (this.props.display === 'day'){
            days.push( this.props.date );
        } else {
            const day = this.props.date.clone().startOf('week');
            for (let i=0; i<7; i++){
                days.push(day.clone().add(i, 'day'));
            }
        }
        const format = (this.props.display === 'month' ? 'dddd' : 'ddd, MMM Do');
        const labels = map( days, function(day){
            return (
                <div key={day.format('YYYYMMDD')} className="day-label">
                    {day.format(format)}
                </div>
            );
        });

        return (
            <div className="x-labels">{labels}</div>
        );

    }

});

module.exports = XLabels;
