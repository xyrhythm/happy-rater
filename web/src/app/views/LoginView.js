import React, {Component} from 'react';
import {Card, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
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
  },
  // This is to ensure that showing/hiding the error message does not affect
  // the layout. The caveat is that this is not working with multi-line errors.
  error: {
    float: 'left'
  }
};

const emailRe = /^[A-Z0-9._-]+@[A-Z0-9.-]+\.[A-Z0-9.-]+$/i;

const currentTime = () => {
  const d = new Date();
  d.setUTCHours(0);
  return Math.floor(d.getTime() / 1000);
};

export default class LoginView extends Component {
  state = {
    type: 1,
    account: '',
    accountErr: '',
    password: '',
    passwordErr: '',
    isValid: false
  };

  validateAccount = (account) => {
    return account.match(emailRe);
  };

  validatePassword = (password) => {
    return password.length >= 8;
  };

  accountTypeChanged = (e, idx, v) => {
    this.setState({type: v});
  };

  accountFieldChanged = (e) => {
    if (this.validateAccount(e.target.value)) {
      this.setState({
        account: e.target.value,
        accountErr: '',
        isValid: this.validatePassword(this.state.password)
      });
    } else {
      this.setState({
        account: e.target.value,
        accountErr: 'Invalid email address.',
        isValid: false
      });
    }
  };

  passwordFieldChanged = (e) => {
    if (this.validatePassword(e.target.value)) {
      this.setState({
        password: e.target.value,
        passwordErr: '',
        isValid: this.validateAccount(this.state.account)
      });
    } else {
      this.setState({
        password: e.target.value,
        passwordErr: 'Invalid password. Must be longer than 8.',
        isValid: false
      });
    }
  };

  // TODO(xyrhythm): Use HTTPS.
  sendLoginRequest = () => {
    this.loginHelper('/login')
      .then((response) => {
        if (response.ok) {
          // TODO: redirect to corresponding view.
          alert('Successful!');
        }
        return response.json();
      })
      .then((body) => {
        // TODO: show reasonable error message in the UI.
        alert(body.error);
      });
  };

  // TODO(xyrhythm): Use HTTPS.
  sendSignUpRequest = () => {
    this.loginHelper('/signup')
      .then((response) => {
        if (response.ok) {
          // TODO: redirect to corresponding view.
          alert('Successful!');
        }
        return response.json();
      })
      .then((body) => {
        // TODO: show reasonable error message in the UI.
        alert(body.error);
      });
  };

  loginHelper = (url) => {
    const timestamp = currentTime();
    const postData = JSON.stringify({
      type: this.state.type,
      account: this.state.account,
      password: this.state.password,
      created_timestamp: timestamp,
      modified_timestamp: timestamp
    });
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: postData
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Card style={{paddingBottom: 60}}>
            <br />
            <h1>Log in to Happy Rater</h1>
            <CardText>
              <TextField
                hintText="Email or user id"
                floatingLabelText="Email or user id"
                errorText={this.state.accountErr}
                errorStyle={styles.error}
                value={this.state.account}
                onChange={this.accountFieldChanged}
              />
              <br />
              <TextField
                type="password"
                floatingLabelText="Password"
                errorText={this.state.passwordErr}
                errorStyle={styles.error}
                value={this.state.password}
                onChange={this.passwordFieldChanged}
              />
              <br />
              <SelectField
                floatingLabelText="Account Type"
                value={this.state.type}
                onChange={this.accountTypeChanged}
                // This style is required, otherwise the layout is broken
                style={{textAlign: 'left'}}
              >
                <MenuItem value={1} primaryText="Rater" />
                <MenuItem value={2} primaryText="Requester" />
                <MenuItem value={3} primaryText="Owner" />
              </SelectField>
            </CardText>
            <CardActions>
              <RaisedButton
                label="LOG IN"
                primary={true}
                style={{marginRight: 40}}
                onTouchTap={this.sendLoginRequest}
                disabled={!this.state.isValid}
              />
              <RaisedButton
                label="SIGN UP"
                secondary={true}
                style={{marginLeft: 40}}
                onTouchTap={this.sendSignUpRequest}
                disabled={!this.state.isValid}
              />
            </CardActions>
          </Card>
        </div>
      </MuiThemeProvider>
    );
  }
}
