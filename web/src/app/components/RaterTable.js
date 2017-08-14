import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import queryString from 'query-string';

export default class RaterTable extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tableData: [],
      newRaterAccount: '',
      newRaterUserName: ''
    };
    this.handleDeleteRater = this.handleDeleteRater.bind(this);
    this.handleAddRater = this.handleAddRater.bind(this);
    this.updateNewRaterAccount = this.updateNewRaterAccount.bind(this);
    this.updateNewRaterUserName = this.updateNewRaterUserName.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    fetch('/getRater')
      .then((response) => {
        return response.ok ? response.text() : [];
      })
      .then((data) => {
        const dataFromServer = JSON.parse(data);
        this.setState({
          tableData: dataFromServer
        });
      });
  }

  handleDeleteRater(id) {
    fetch('/deleteRater', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // ID is enough for deletion since id is primary key
      body: queryString.stringify({rater_id: id})
    }).then((response) => {
      if (response.ok) {
        const newData = this.state.tableData;
        for (let [index, value] of newData.entries()) {
          if (value.rater_id == id) {
            newData.splice(index, 1);
            break;
          }
        }
        this.setState({
          tableData: newData
        });
      }
    });
  }

  handleAddRater() {
    const formData = {
      rater_account: this.state.newRaterAccount,
      rater_username: this.state.newRaterUserName,
      // TODO: This is hacky -- find a better way to convert from JS date
      // format to mysql timestamp.
      rater_registration_timetamp: new Date()
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ')
    };
    fetch('/addRater', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: queryString.stringify(formData)
    }).then((response) => {
      if (response.ok) {
        this.setState({
          newRaterAccount: '',
          newRaterUserName: ''
        });
        this.fetchData();
      }
    });
  }

  updateNewRaterAccount(event, newValue) {
    this.setState({
      newRaterAccount: newValue
    });
  }

  updateNewRaterUserName(event, newValue) {
    this.setState({
      newRaterUserName: newValue
    });
  }

  render() {
    return (
      <Table height="300px">
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn tooltip="Unique identifier">
              ID
            </TableHeaderColumn>
            <TableHeaderColumn tooltip="Account information">
              Account
            </TableHeaderColumn>
            <TableHeaderColumn tooltip="User name">Username</TableHeaderColumn>
            <TableHeaderColumn tooltip="When did the rater register">
              Register time
            </TableHeaderColumn>
            <TableHeaderColumn>
              <FlatButton label="Refresh" onTouchTap={this.fetchData} />
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.state.tableData.map((row, index) =>
            <TableRow key={index}>
              <TableRowColumn>
                {row.rater_id}
              </TableRowColumn>
              <TableRowColumn>
                {row.rater_account}
              </TableRowColumn>
              <TableRowColumn>
                {row.rater_username}
              </TableRowColumn>
              <TableRowColumn>
                {row.rater_registration_timetamp}
              </TableRowColumn>
              <TableRowColumn>
                <FlatButton
                  label="Delete"
                  onTouchTap={() => this.handleDeleteRater(row.rater_id)}
                />
              </TableRowColumn>
            </TableRow>
          )}
        </TableBody>
        <TableFooter adjustForCheckbox={false}>
          <TableRow>
            <TableRowColumn />
            <TableRowColumn>
              <TextField
                id="newRaterAccount"
                value={this.state.newRaterAccount}
                onChange={this.updateNewRaterAccount}
              />
            </TableRowColumn>
            <TableRowColumn>
              <TextField
                id="newRaterUserName"
                value={this.state.newRaterUserName}
                onChange={this.updateNewRaterUserName}
              />
            </TableRowColumn>
            <TableRowColumn />
            <TableRowColumn>
              <FlatButton label="Add" onTouchTap={this.handleAddRater} />
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}
