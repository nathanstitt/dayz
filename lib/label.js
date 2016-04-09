'use strict';

var React = require('react');

var Label = React.createClass({
    displayName: 'Label',


    propTypes: {
        day: React.PropTypes.object.isRequired
    },

    render: function render() {
        return React.createElement(
            'div',
            { className: 'label' },
            this.props.day.format('D')
        );
    }
});

module.exports = Label;