import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import RouterSetting from './Router';

injectTapEventPlugin();

// Index component
class Index extends Component {
  render() {
    return (
        <MuiThemeProvider>
          <RouterSetting/>
        </MuiThemeProvider>
    );
  }
}


ReactDOM.render(
  <Index />,
  document.getElementById('root')
);
