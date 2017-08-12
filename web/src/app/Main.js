import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './Login';
import RaterTable from './RaterTable';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {deepOrange500} from 'material-ui/styles/colors';

const Main = () =>
  <main>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/rater" component={RaterTable} />
    </Switch>
  </main>;

export const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
});

export default Main;
