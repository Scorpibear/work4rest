import React, { Component } from 'react';
import SandTimer from './SandTimer';
import './Hourglass.css';

class Hourglass extends Component {
  render() {
    return (
      <div id="hourglass">
        <canvas id={this.props.id} width="400" height="320">Canvas not supported</canvas>
        <div>
          <button>Start</button>
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