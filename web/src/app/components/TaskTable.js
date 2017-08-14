import React, {Component} from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableFooter,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import TaskDialog, {defaultTaskData} from './TaskDialog';

import queryString from 'query-string';

// TODO(fenghaolw): Reuse code among this table and other tables.
// Maybe create an intermediate class for code sharing. We should also do
// similar things for the cards.
// While table structures might be significantly different, the data fetching
// and editing/deleting workflows should be largely the same.
export default class TaskTable extends Component {
  state = {
    tableData: [],
    selected: [],
    currentSelectedTaskData: defaultTaskData
  };

  // Callbacks that are used for communicating among components.
  callbacks = {
    fetchData: () => this.fetchData()
  };

  componentWillMount = () => {
    this.fetchData();
  };

  isSelected = (index) => {
    return this.state.selected.indexOf(index) != -1;
  };

  handleRowSelection = (selectedRows) => {
    this.setState({
      selected: selectedRows,
      currentSelectedTaskData:
        selectedRows.length > 0
          ? this.state.tableData[selectedRows[0]]
          : defaultTaskData
    });
  };

  fetchData = () => {
    fetch('/getTasks')
      .then((response) => {
        return response.ok ? response.text() : [];
      })
      .then((data) => {
        const dataFromServer = JSON.parse(data);
        this.setState({
          tableData: dataFromServer
        });
      });
  };

  deleteSelected = () => {
    // TODO: use batch deleted once we use multi-selectable table.
    for (let index of this.state.selected) {
      fetch('/deleteTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        // This assume that tableData and selected are synced. This should be
        // true in general, but maybe there are some race conditions?
        body: queryString.stringify({
          task_id: this.state.tableData[index].task_id
        })
      }).then((response) => {
        if (response.ok) {
          // TODO: A full refresh might be unnecessary?
          this.fetchData();
        }
      });
    }
  };

  render() {
    // TODO: Currently we always use the first selected row for editing.
    // What should we do for multi-selectable tables?
    // TODO: show requester name instead of id.
    // TODO: maybe we don't need to show id at all. Saving the id in the data
    // attribute for editing/deleting should be sufficient.
    // TODO: Edit is not working for now -- we always insert a new entry.
    // Implement EDIT once we have APIs for backend server.
    // TODO: Find a way to convert the enum to integer.
    return (
      <Table height="300px" onRowSelection={this.handleRowSelection}>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn tooltip="Unique identifier">
              ID
            </TableHeaderColumn>
            <TableHeaderColumn tooltip="Requester id">
              Requester
            </TableHeaderColumn>
            <TableHeaderColumn tooltip="Name">Name</TableHeaderColumn>
            <TableHeaderColumn tooltip="Type">Type</TableHeaderColumn>
            <TableHeaderColumn tooltip="Instruction">
              Instruction
            </TableHeaderColumn>
            <TableHeaderColumn tooltip="Question">Question</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {this.state.tableData.map((row, index) =>
            <TableRow key={index} selected={this.isSelected(index)}>
              <TableRowColumn>
                {row.task_id}
              </TableRowColumn>
              <TableRowColumn>
                {row.task_requester_id}
              </TableRowColumn>
              <TableRowColumn>
                {row.task_name}
              </TableRowColumn>
              <TableRowColumn>
                {row.task_type}
              </TableRowColumn>
              <TableRowColumn>
                {row.task_instruction}
              </TableRowColumn>
              <TableRowColumn>
                {row.task_question_string}
              </TableRowColumn>
            </TableRow>
          )}
        </TableBody>
        <TableFooter adjustForCheckbox={false}>
          <TableRow>
            <TableRowColumn>
              <FlatButton label="Refresh" onTouchTap={this.fetchData} />
            </TableRowColumn>
            <TableRowColumn />
            <TableRowColumn />
            <TableRowColumn>
              <FlatButton
                label="Delete"
                onTouchTap={this.deleteSelected}
                disabled={this.state.selected.length == 0}
              />
            </TableRowColumn>
            <TableRowColumn>
              <TaskDialog
                label="Edit"
                title="Edit a task"
                taskData={this.state.currentSelectedTaskData}
                callbacks={this.callbacks}
                disabled={this.state.selected.length == 0}
              />
            </TableRowColumn>
            <TableRowColumn>
              <TaskDialog
                label="Add Task"
                title="Add a task"
                taskData={defaultTaskData}
                callbacks={this.callbacks}
              />
            </TableRowColumn>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }
}
