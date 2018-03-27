import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import migrate from './migrations';
import Car from './models/Car';
import { initGaiagram } from './gaiagram'

class App extends Component {
  componentDidMount() {
    const gaiagram = initGaiagram()
    gaiagram.registerModel(Car)

    const models = migrate()
    console.log(models)
    console.log(gaiagram.models.car.validate({ make: 'Ford', year: '1922' }))


    // once migrate is done, we assign each item in models to the class model
    // const models =
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
