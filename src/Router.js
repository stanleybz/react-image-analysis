import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

// Page import
import Home from './Component/Home';

// Index component
class RouterSetting extends Component {

  render(){
    return (
      <Router>
        <Route exact path="/" component={Home}/>
      </Router>
    )
  }
}

export default RouterSetting
