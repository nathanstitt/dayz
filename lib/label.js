'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Label = _react2['default'].createClass({
    displayName: 'Label',

    propTypes: {
        day: _react2['default'].PropTypes.object.isRequired
    },

    render: function render() {
        return _react2['default'].createElement(
            'div',
            { className: 'label' },
            this.props.day.format('D')
        );
    }

});

exports['default'] = Label;
module.exports = exports['default'];