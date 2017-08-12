import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {BrowserRouter} from 'react-router-dom';
import Main from './Main';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Render the main app react component into the app div.
render(
  <BrowserRouter>
    <Main />
  </BrowserRouter>,
  document.getElementById('app')
);
