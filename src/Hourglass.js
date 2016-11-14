import React, { Component } from 'react';
import SandTimer from './SandTimer';

class Hourglass extends Component {
  render() {
    return (
      <canvas id={this.props.id} width="400" height="320">Canvas not supported</canvas>
    )
  }
  componentDidMount() {
    let sandTimer = new SandTimer({id: this.props.id});
    sandTimer.start();
  }
}

export default Hourglass;