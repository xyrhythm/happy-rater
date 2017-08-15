import React, {Component} from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Link} from 'react-router-dom';
import {muiTheme} from '../components/theme';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
    width: '600px',
    marginRight: 'auto',
    marginLeft: 'auto'
  }
};

export default class LoginView extends Component {
  // TODO(xyrhythm): Implement login logic.
  handleLoginRequest = () => {};

  // TODO(xyrhythm): Implement signup logic.
  handleSignUpRequest = () => {};

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Card style={{paddingBottom: 60}}>
            <br />
            <h1>Log in to Happy Rater</h1>
            <CardText>
              <h1 />
              <br />
              <TextField
                hintText="Email or user id"
                floatingLabelText="Email or user id"
              />
              <br />
              <TextField type="password" floatingLabelText="Password" />
              <br />
              <br />
            </CardText>
            <CardActions>
              <RaisedButton
                label="LOG IN"
                primary={true}
                style={{marginRight: 40}}
                onTouchTap={this.handleLoginRequest}
                containerElement={<Link to="/owner" />}
              />
              <RaisedButton
                label="SIGN UP"
                secondary={true}
                style={{marginLeft: 40}}
                onTouchTap={this.handleSignUpRequest}
                containerElement={<Link to="/owner" />}
              />
            </CardActions>
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}
