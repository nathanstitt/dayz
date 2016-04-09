'use strict';

var React = require('react');
var moment = require('moment');
var Layout = require('./data/layout');
var each = require('lodash/each');
var range = require('lodash/range');

var YLabels = React.createClass({
    displayName: 'YLabels',


    propTypes: {
        display: React.PropTypes.oneOf(['month', 'week', 'day']),
        date: React.PropTypes.object.isRequired,
        layout: React.PropTypes.instanceOf(Layout).isRequired
    },

    render: function render() {
        if (this.props.display === 'month') {
            return null;
        }

        var day = moment();
        var labels = [];
        var hours = range(this.props.layout.displayHours[0], this.props.layout.displayHours[1]);
        each(hours, function (hour) {
            day.hour(hour);
            labels.push(React.createElement(
                'div',
                { key: hour, className: 'hour' },
                day.format('ha')
            ));
        });

        var multiDay = React.createElement(
            'div',
            this.props.layout.propsForAllDayEventContainer(),
            'All Day'
        );

        return React.createElement(
            'div',
            null,
            React.createElement(
                'div',
                { className: 'y-labels' },
                multiDay,
                labels
            )
        );
    }
});

module.exports = YLabels;