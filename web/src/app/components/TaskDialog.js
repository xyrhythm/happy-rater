import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TaskForm from './TaskForm';
import queryString from 'query-string';

// We need a default task data. If we use an empty object, the react thought
// all the text fields in the form are "uncontrolled" and will issue a warning.
export const defaultTaskData = {
  // TODO: For now, hard-coded task requester id to be 1.
  // Hook this up with the login logic in the future.
  task_requester_id: 1,
  task_name: '',
  task_type: 0,
  task_instruction: '',
  task_question_string: ''
};

// TODO: Make this a generic dialog and reuse it.
// This is rendered as a button, and click it will pop up a dialog.
export default class TaskDialog extends Component {
  state = {
    open: false,
    taskData: this.props.taskData
  };

  handleOpen = () => {
    this.setState({
      open: true,
      // This is required -- re-read the taskData from the attribute whenever
      // we open the dialog. Without this, edit button won't work since the
      // state is only initialized once.
      taskData: this.props.taskData
    });
  };

  handleCancel = () => {
    this.setState({
      open: false,
      // Drop all the data in the form
      taskData: defaultTaskData
    });
  };

  handleSubmit = () => {
    fetch('/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: queryString.stringify(this.state.taskData)
    }).then((response) => {
      if (response.ok) {
        // Refresh the table
        this.props.callbacks.fetchData();
      }
    });
    this.setState({
      open: false,
      taskData: defaultTaskData
    });
  };

  // This is a callback that will be passed into the child component. In this
  // case, child (TaskForm) will update the state so that we can collect all
  // the data before submission.
  updateTaskDataCallback = (dataField, dataValue) => {
    const data = this.state.taskData;
    // TODO: we use a quoted string to access fields in the object.
    // This might not work with obsfucated JS. Consider using a ES6 map instead.
    data[dataField] = dataValue;
    this.setState({taskData: data});
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.handleSubmit}
      />
    ];
    return (
      <div>
        <FlatButton
          label={this.props.label}
          onTouchTap={this.handleOpen}
          disabled={this.props.disabled}
        />
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          open={this.state.open}
        >
          <TaskForm
            taskData={this.state.taskData}
            callback={this.updateTaskDataCallback}
          />
        </Dialog>
      </div>
    );
  }
}
