import React, { Component } from 'react';
import Hourglass from './Hourglass';
import './App.css';

class App extends Component {
  render() {
    const html = (
      <div className="App">
        <div className="App-header">
          <h2>Deserve time for rest by work</h2>
        </div>
        <Hourglass id="hourglass" />
      </div>
    );
    return html;
  }
}

export default App;
