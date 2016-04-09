const React  = require('react');
const moment = require('moment');
const Layout = require('./data/layout');
const each   = require('lodash/each');
const range  = require('lodash/range');

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

        const day = moment();
        const labels = [];
        const hours = range(this.props.layout.displayHours[0], this.props.layout.displayHours[1]);
        each(hours, (hour) => {
            day.hour(hour);
            labels.push(<div key={hour} className="hour">{day.format('ha')}</div>);
        });

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

module.exports = YLabels;
