const React  = require('react');
const Layout = require('./data/layout');
const Event  = require('./event');
const Label  = require('./label');
const assign = require('lodash/assign');
const each   = require('lodash/each');
const ReactDOM = require('react-dom');

const IsDayClass = new RegExp('(\\s|^)(events|day|label)(\\s|$)');

const Day = React.createClass({

    propTypes: {
        day:            React.PropTypes.object.isRequired,
        layout:         React.PropTypes.instanceOf(Layout).isRequired,
        position:       React.PropTypes.number.isRequired,
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

    getBounds(){
        return ReactDOM.findDOMNode(
            this.refs.events || this.refs.root
        ).getBoundingClientRect();
    },

    _onClickHandler(ev, handler) {
        if (!handler || !IsDayClass.test(ev.target.className) ||
            ( this.lastMouseUp &&
                (this.lastMouseUp < (new Date()).getMilliseconds() + 100 )
            )){
                return;
        }
        this.lastMouseUp = 0;
        const bounds = this.getBounds();
        const perc = ((ev.clientY - bounds.top) / ev.target.offsetHeight );
        const hours = this.props.layout.displayHours[0] +
                      ((this.props.layout.minutesInDay() * perc) / 60);
        handler.call( this, ev, this.props.day.clone().startOf('day').add( hours, 'hour' ) );
    },
    onClick(ev) { this._onClickHandler(ev, this.props.onClick); },
    onDoubleClick(ev) { this._onClickHandler(ev, this.props.onDoubleClick); },

    onDragStart(resize, eventLayout) {
        eventLayout.setIsResizing(true);
        const bounds = this.getBounds();
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
        this.state.resize.eventLayout.setIsResizing(false);
        setTimeout(() => this.setState({resize: false}), 1);
        if (this.props.onEventResize){
            this.props.onEventResize(ev, this.state.resize.eventLayout.event);
        }
        this.lastMouseUp = (new Date()).getMilliseconds();
    },

    renderEvents(){
        const asMonth = this.props.layout.isDisplayingAsMonth();
        const singleDayEvents = [];
        const allDayEvents    = [];
        const onMouseMove = asMonth ? null : this.onMouseMove;
        each(this.props.layout.forDay(this.props.day), (layout) => {
            const event = (
                <Event
                    layout={layout}
                    key={layout.key()}
                    day={this.props.day}
                    parent={this}
                    onDragStart={this.onDragStart}
                    onClick={this.props.onEventClick}
                    editComponent={this.props.editComponent}
                    onDoubleClick={this.props.onEventDoubleClick}
                />
            );
            (layout.event.isSingleDay() ? singleDayEvents : allDayEvents).push(event);
        });
        const events = [];
        if (allDayEvents.length || !asMonth){
            events.push(
                <div key="allday" {...this.props.layout.propsForAllDayEventContainer()}>
                    {allDayEvents}
                </div>
            );
        }
        if (singleDayEvents.length){
            events.push(
                <div key="events" ref="events" className="events"
                     onMouseMove={onMouseMove} onMouseUp={this.onMouseUp}>
                    {singleDayEvents}
                </div>
            );
        }
        return events;
    },

    render() {
        const props = this.props.layout.propsForDayContainer(this.props);

        return (
            <div ref="root"
                {...props}
                onClick={this.onClick}
                onDoubleClick={this.onDoubleClick}
            >
                <Label day={this.props.day} className="label">
                    {this.props.day.format('D')}
                </Label>
                {this.renderEvents()}
            </div>
        );
    }

});

module.exports = Day;
