import React  from 'react';
import Layout from './data/layout';
import Event  from './event';
import Label  from './label';
import assign from 'lodash/object/assign';

const IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

const Day = React.createClass({

    propTypes: {
        day:            React.PropTypes.object.isRequired,
        layout:         React.PropTypes.instanceOf(Layout).isRequired,
        onClick:        React.PropTypes.func,
        onDoubleClick:  React.PropTypes.func,
        onEventClick:   React.PropTypes.func,
        onEventResize:  React.PropTypes.func,
        editComponent:  React.PropTypes.func,
        onEventDoubleClick: React.PropTypes.func
    },

    getInitialState(){
        return {resize: false};
    },

    _onClickHandler(ev, handler) {
        if (!handler || !IsDayClass.test(ev.target.className)){ return; }
        const bounds = this.refs.events.getBoundingClientRect();
        const perc = ((ev.clientY - bounds.top) / ev.target.offsetHeight );
        const hours = this.props.layout.displayHours[0] +
                      ((this.props.layout.minutesInDay() * perc) / 60);
        handler.call( this, ev, this.props.day.clone().startOf('day').add( hours, 'hour' ) );
    },
    onClick(ev) { this._onClickHandler(ev, this.props.onClick); },
    onDoubleClick(ev) { this._onClickHandler(ev, this.props.onDoubleClick); },

    onDragStart(resize, eventLayout) {
        const bounds = this.refs.events.getBoundingClientRect();
        assign(resize, {eventLayout, height: bounds.height, top: bounds.top });
        this.setState({resize});
    },

    onMouseMove(ev) {
        if (!this.state.resize){ return; }
        const coord = ev.clientY - this.state.resize.top;
        this.state.resize.eventLayout.adjustEventTime(
            this.state.resize.type, coord, this.state.resize.height
        );
        this.forceUpdate();

    },

    onMouseUp(ev){
        if (!this.state.resize){ return; }
        setTimeout(() => this.setState({resize: false}), 1);
        if (this.props.onEventResize){
            this.props.onEventResize(ev, this.state.resize.eventLayout.event);
        }
    },

    render() {
        const classes=['day'];
        if (this.props.layout.isDateOutsideRange(this.props.day)){
            classes.push('outside');
        }
        const singleDayEvents = [];
        const allDayEvents    = [];
        const onMouseMove = this.props.layout.isDisplayingAsMonth() ? null : this.onMouseMove;
        for( const layout of this.props.layout.forDay(this.props.day) ){
            const event = (
                <Event
                    layout={layout}
                    key={layout.key()}
                    day={this.props.day}
                    onDragStart={this.onDragStart}
                    onClick={this.props.onEventClick}
                    editComponent={this.props.editComponent}
                    onDoubleClick={this.props.onEventDoubleClick}
                />
            );
            (layout.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event);
        }

        return (
            <div
                onClick={this.onClick}
                className={classes.join(' ')}
                onDoubleClick={this.onDoubleClick}
            >
                <Label day={this.props.day} className="label">{this.props.day.format('D')}</Label>
                <div {...this.props.layout.propsForAllDayEventContainer()}>{allDayEvents}</div>
                <div ref="events"
                     className="events"
                     onMouseMove={onMouseMove}
                     onMouseUp={this.onMouseUp}
                >
                    {singleDayEvents}
                </div>
            </div>
        );
    }

});

export default Day;
