import React, { Component } from 'react';
import SandTimer from './SandTimer';
import './Hourglass.css';

class Hourglass extends Component {
  constructor(props) {
    super(props);
    this.sandTimer = new SandTimer({id: this.props.id});
  }
  render() {
    const start = () => this.sandTimer.start();
    return (
      <div className="hourglass">
        <canvas id={this.props.id} width="400" height="320">Canvas not supported</canvas>
        <div>
          <button onClick={start}>Start</button>
        </div>
      </div>
    )
  }
  componentDidMount() {
    this.sandTimer.init();
  }
}

export default Hourglass;