import React, {Component} from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Appbar from '../components/Appbar';
import RaterCard from '../components/RaterCard';
import TaskCard from '../components/TaskCard';
import {muiTheme} from '../components/theme';

const cardStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: 32,
  marginBottom: 32,
  width: '80%',
  height: '50%',
  maxHeight: '50%'
};

export default class OwnerView extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Appbar title="Welcome Foo Bar!" />
          <TaskCard style={cardStyle} />
          <RaterCard style={cardStyle} />
        </div>
      </MuiThemeProvider>
    );
  }
}
