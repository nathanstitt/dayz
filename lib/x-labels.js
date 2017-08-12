var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';

var XLabels = function (_React$PureComponent) {
    _inherits(XLabels, _React$PureComponent);

    function XLabels() {
        _classCallCheck(this, XLabels);

        return _possibleConstructorReturn(this, (XLabels.__proto__ || Object.getPrototypeOf(XLabels)).apply(this, arguments));
    }

    _createClass(XLabels, [{
        key: 'render',
        value: function render() {
            var format = 'month' === this.props.display ? 'dddd' : 'ddd, MMM Do';

            return React.createElement(
                'div',
                { className: 'x-labels' },
                this.days.map(function (day) {
                    return React.createElement(
                        'div',
                        { key: day.format('YYYYMMDD'), className: 'day-label' },
                        day.format(format)
                    );
                })
            );
        }
    }, {
        key: 'days',
        get: function get() {
            var days = [];
            if ('day' === this.props.display) {
                days.push(this.props.date);
            } else {
                var day = this.props.date.clone().startOf('week');
                for (var i = 0; i < 7; i += 1) {
                    days.push(day.clone().add(i, 'day'));
                }
            }
            return days;
        }
    }]);

    return XLabels;
}(React.PureComponent);

XLabels.propTypes = {
    display: PropTypes.oneOf(['month', 'week', 'day']),
    date: PropTypes.object.isRequired
};
export default XLabels;