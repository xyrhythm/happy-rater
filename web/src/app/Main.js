import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Login from './components/Login';
import RaterTable from './components/RaterTable';

const Main = () =>
  <main>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/rater" component={RaterTable} />
    </Switch>
  </main>;

export default Main;
