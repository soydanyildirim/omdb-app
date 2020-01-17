import React, { Component } from 'react';
import './app.scss';
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from './Home';

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      name: "soydan"
    }
  }
  render() {
    return (
      <Router>
        <div className="App">
          <main className="d-flex justify-content-center align-items-center p-3 p-sm-5">
            <Route exact path="/" component={Home} />
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
