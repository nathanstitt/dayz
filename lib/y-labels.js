var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import moment from './moment-range';
import Layout from './data/layout';

var YLabels = function (_React$PureComponent) {
    _inherits(YLabels, _React$PureComponent);

    function YLabels() {
        _classCallCheck(this, YLabels);

        return _possibleConstructorReturn(this, (YLabels.__proto__ || Object.getPrototypeOf(YLabels)).apply(this, arguments));
    }

    _createClass(YLabels, [{
        key: 'renderLabels',
        value: function renderLabels() {
            var _this2 = this;

            var day = moment();
            return this.hours.map(function (hour) {
                return React.createElement(
                    'div',
                    { key: hour, className: 'hour' },
                    day.hour(hour).format(_this2.props.timeFormat)
                );
            });
        }
    }, {
        key: 'render',
        value: function render() {
            if ('month' === this.props.display) {
                return null;
            }
            return React.createElement(
                'div',
                null,
                React.createElement(
                    'div',
                    { className: 'y-labels' },
                    React.createElement(
                        'div',
                        this.props.layout.propsForAllDayEventContainer(),
                        'All Day'
                    ),
                    this.renderLabels()
                )
            );
        }
    }, {
        key: 'hours',
        get: function get() {
            var _props$layout$display = _slicedToArray(this.props.layout.displayHours, 2),
                start = _props$layout$display[0],
                end = _props$layout$display[1];

            return Array(end - start).fill().map(function (_, i) {
                return i + start;
            });
        }
    }]);

    return YLabels;
}(React.PureComponent);

YLabels.propTypes = {
    display: PropTypes.oneOf(['month', 'week', 'day']).isRequired,
    date: PropTypes.object.isRequired,
    layout: PropTypes.instanceOf(Layout).isRequired,
    timeFormat: PropTypes.string
};
YLabels.defaultProps = {
    timeFormat: 'ha'
};
export default YLabels;