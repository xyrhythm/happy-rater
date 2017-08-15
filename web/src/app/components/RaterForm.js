import React, {Component} from 'react';

import TextField from 'material-ui/TextField';

const formStyle = {
  margin: 10
};

export default class RaterForm extends Component {
  state = {
    raterAccount: this.props.formData ? this.props.formData.rater_account : '',
    raterUsername: this.props.formData ? this.props.formData.rater_username : ''
  };

  onRaterAccountChange = (e) => {
    this.setState({raterAccount: e.target.value});
    if (this.props.callback) {
      this.props.callback('rater_account', e.target.value);
    }
  };

  onRaterUserNameChange = (e) => {
    this.setState({raterUsername: e.target.value});
    if (this.props.callback) {
      this.props.callback('rater_username', e.target.value);
    }
  };

  render() {
    return (
      <div style={formStyle}>
        <TextField
          id="raterAccount"
          floatingLabelText="Rater Account"
          fullWidth={true}
          value={this.state.raterAccount}
          onChange={this.onRaterAccountChange}
        />
        <br />
        <TextField
          id="raterUsername"
          floatingLabelText="Rater User Name"
          fullWidth={true}
          value={this.state.raterUsername}
          onChange={this.onRaterUserNameChange}
        />
      </div>
    );
  }
}
