'use strict';

var React = require('react');
var map = require('lodash/map');

var XLabels = React.createClass({
    displayName: 'XLabels',


    propTypes: {
        display: React.PropTypes.oneOf(['month', 'week', 'day']),
        date: React.PropTypes.object.isRequired
    },

    render: function render() {
        var days = [];
        if (this.props.display === 'day') {
            days.push(this.props.date);
        } else {
            var day = this.props.date.clone().startOf('week');
            for (var i = 0; i < 7; i++) {
                days.push(day.clone().add(i, 'day'));
            }
        }
        var format = this.props.display === 'month' ? 'dddd' : 'ddd, MMM Do';
        var labels = map(days, function (day) {
            return React.createElement(
                'div',
                { key: day.format('YYYYMMDD'), className: 'day-label' },
                day.format(format)
            );
        });

        return React.createElement(
            'div',
            { className: 'x-labels' },
            labels
        );
    }
});

module.exports = XLabels;