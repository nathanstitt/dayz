import React  from 'react';
import Layout from './data/layout';
import Event  from './event';
import assign from 'lodash/object/assign';

const IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

const Day = React.createClass({

    propTypes: {
        editComponent:  React.PropTypes.func,
        labelComponent: React.PropTypes.func,
        day:            React.PropTypes.object.isRequired,
        layout:         React.PropTypes.instanceOf(Layout).isRequired,
        onClick:        React.PropTypes.func,
        onEventClick:   React.PropTypes.func,
        onEventResize:  React.PropTypes.func
    },

    getInitialState(){
        return {resize: false};
    },

    onClick(ev) {
        if (!this.props.onClick ||
            this.state.resize ||
            !IsDayClass.test(ev.target.className)){
                return;
        }
        const bounds = this.refs.events.getBoundingClientRect();
        const hours = 24 * ((ev.clientY - bounds.top) / ev.target.offsetHeight );
        this.props.onClick( ev, this.props.day.clone().startOf('day').add( hours, 'hour' ) );
    },

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
        const Label = this.props.labelComponent;
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
                    onDragStart={this.onDragStart}
                    key={layout.key()}
                    editComponent={this.props.editComponent}
                    onClick={this.props.onEventClick}
                    day={this.props.day}
                    layout={layout}
                />
            );
            (layout.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event);
        }

        return (
            <div onClick={this.onClick} className={classes.join(' ')}>
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
