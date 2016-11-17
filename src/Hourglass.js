import React, { Component } from 'react';
import SandTimer from './SandTimer';
import './Hourglass.css';
import HourglassButton from './HourglassButton';

class Hourglass extends Component {
  render() {
    return (
      <div className="hourglass">
        <canvas id={this.props.id} width="400" height="320">Canvas not supported</canvas>
        <div>
          <HourglassButton />
        </div>
      </div>
    )
  }
  componentDidMount() {
    let sandTimer = new SandTimer({id: this.props.id});
    sandTimer.start();
  }
}

export default Hourglass;