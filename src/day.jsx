import React  from 'react';
import Layout from './data/layout';
import Event  from './event';
import map    from 'lodash/collection/map';

class Day extends React.Component {

    static propTypes = {
        labelComponent: React.PropTypes.func,
        day:            React.PropTypes.object.isRequired,
        layout:         React.PropTypes.instanceOf(Layout),
        onClick:        React.PropTypes.func,
        onEventClick:   React.PropTypes.func
    }

    onClick(ev) {
        if (!this.props.onClick){ return }
        const hours = 24 * ( (ev.pageY - ev.target.offsetTop) / ev.target.offsetHeight );
        this.props.onClick( this.props.day.clone().startOf('day').add( hours, 'hour' ), ev.target );
    }

    render() {
        const Label = this.props.labelComponent;
        const classes=['day'];

        if (this.props.layout.isDateOutsideRange(this.props.day)){
            classes.push('outside');
        }

        const events = map( this.props.layout.forDay(this.props.day), (layout) =>
            <Event
                onClick={this.props.onEventClick}
                key={layout.event.key}
                layout={layout} day={this.props.day} />
        );

        return (
            <div onClick={ (e) => this.onClick(e) }
                 className={classes.join(' ')}
                 key={this.props.day.format('YYYYMMDD')}
            >
                <Label day={this.props.day} className="label">{this.props.day.format('D')}</Label>
                {events}
            </div>
        );

    }

}

export default Day;
