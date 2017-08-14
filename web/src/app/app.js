import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import LoginView from './views/LoginView';
import OwnerView from './views/OwnerView';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// TODO(fenghaolw): put appbar and some common stuffs in a main chrome view.
render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LoginView} />
      <Route exact path="/owner" component={OwnerView} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('app')
);
