import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
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

import queryString from 'query-string';

const currentTime = () => {
  const d = new Date();
  d.setUTCHours(0);
  return Math.floor(d.getTime() / 1000);
};

/**
 * This is an abstract data table that can be used for different places.
 *
 * In order to use this, you must pass in all of the following props:
 *   - tableFields: A list of object {name, tooltip, identifier}. Name is shown
 * in the table's header, tooltip is shown when someone hover the name, and
 * identifier is the actual field in the database.
 *   - primaryField: A primary field for a data entry. Most likely this should
 * be an identifier such as rater_id or task_id. We use this field for editing
 * or deleting entries from the table.
 *   - urls: A object {fetch, delete, add}. This contains XHR actions that
 * should be fired when a particular operation is performed.
 *   - defaultData (optional): This is the default data that should be used and
 * passed to the child component. Technically this can be an empty object or
 * undefined, but doing that raises a warning in react since it makes all the
 * downstream fields "uncontrolled". It is not affecting production though.
 *
 * This table should always contain a child that is the form used by the dialog.
 * Adding/Editing buttons will pop up a dialog containing the child component.
 * This table also implements the callbacks between child component and the XHR
 * actions in this class, so you don't need to manually invoke the XHRs again.
 */
export default class DataTable extends Component {
  state = {
    tableData: [],
    selected: [],
    currentSelectedData: this.props.defaultData,
    dialogOpened: false,
    dialogTitle: '',
    selectedField: {},
    dataForDialog: {}
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
      currentSelectedData:
        selectedRows.length > 0
          ? this.state.tableData[selectedRows[0]]
          : this.props.defaultData
    });
  };

  fetchData = () => {
    fetch(this.props.urls.fetch)
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
    const id = this.props.primaryField;
    // TODO: use batch deleted once we use multi-selectable table.
    for (let index of this.state.selected) {
      const postData = {};
      postData[id] = this.state.tableData[index][id];
      fetch(this.props.urls.delete, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        // This assume that tableData and selected are synced. This should be
        // true in general, but maybe there are some race conditions?
        body: queryString.stringify(postData)
      }).then((response) => {
        if (response.ok) {
          // TODO: A full refresh might be unnecessary?
          this.fetchData();
        }
      });
    }
  };

  openDialog = (title, isEditDialog) => {
    // For "Add" dialog, selectedField is an empty object, and we should use
    // defaultData for the initial value of the form.
    const selectedField = {};
    let dataForDialog = this.props.defaultData;
    // For "Edit" dialog, set the selectedField. This will contain the primary
    // field (for example, task_id) for the current selected row.
    // Also make a deep copy for the currentSelectedData.
    // Currently we Serialize and deserialize the object to make a deep copy.
    // Is there a better way to achieve this?
    if (isEditDialog) {
      selectedField[this.props.primaryField] = this.state.tableData[
        this.state.selected[0]
      ][this.props.primaryField];
      dataForDialog = JSON.parse(
        JSON.stringify(this.state.currentSelectedData)
      );
    }
    this.setState({
      dialogOpened: true,
      dialogTitle: title,
      selectedField: selectedField,
      dataForDialog: dataForDialog
    });
  };

  closeDialogCancel = () => {
    this.setState({
      dialogOpened: false,
      dialogTitle: '',
      selectedField: {},
      dataForDialog: {}
    });
  };

  closeDialogSubmit = () => {
    let postUrl;
    let postData;
    // Create a new object that only contains the fields defined in the
    // defaultData. dataForDialog will contains all the fields, but we should
    // not modify some of these fields.
    const entries = {};
    for (let key of Object.keys(this.props.defaultData)) {
      entries[key] = this.state.dataForDialog[key];
    }
    // TODO: Use the string comparison might be error-prone
    if (this.state.dialogTitle.toLowerCase() == 'add') {
      postUrl = this.props.urls.add;
      entries.created_timetamp = currentTime();
      entries.modified_timestamp = currentTime();
      // Add timestamp
      postData = JSON.stringify(entries);
    } else {
      postUrl = this.props.urls.update;
      entries.modified_timestamp = currentTime();
      postData = JSON.stringify({
        entries: entries,
        conditions: this.state.selectedField
      });
    }
    fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: postData
    }).then((response) => {
      if (response.ok) {
        // Refresh the table
        this.fetchData();
      }
    });
    this.setState({
      dialogOpened: false,
      dialogTitle: '',
      selectedField: {},
      dataForDialog: {}
    });
  };

  // This is a callback that will be passed into the child component. In this
  // case, child (which should be a form in the dialog) will update the state
  // so that we can collect all the data before submission.
  updateTaskDataCallback = (dataField, dataValue) => {
    this.setState((previousState) => {
      // TODO: we use a quoted string to access fields in the object.
      // This might not work with obsfucated JS. Consider using a ES6 map.
      previousState.dataForDialog[dataField] = dataValue;
      return previousState;
    });
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.closeDialogCancel}
      />,
      <FlatButton
        label="Confirm"
        primary={true}
        onTouchTap={this.closeDialogSubmit}
      />
    ];
    // TODO: Currently we always use the first selected row for editing.
    // What should we do for multi-selectable tables?
    // TODO: show requester name instead of id.
    // TODO: maybe we don't need to show id at all. Saving the id in the data
    // attribute for editing/deleting should be sufficient.
    // TODO: Edit is not working for now -- we always insert a new entry.
    // Implement EDIT once we have APIs for backend server.
    // TODO: Find a way to convert the enum to integer.
    return (
      <div>
        <Table height="300px" onRowSelection={this.handleRowSelection}>
          <TableHeader>
            <TableRow>
              {this.props.tableFields.map((field, index) =>
                <TableHeaderColumn key={index} tooltip={field.tooltip}>
                  {field.name}
                </TableHeaderColumn>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {this.state.tableData.map((row, index) =>
              <TableRow key={index} selected={this.isSelected(index)}>
                {this.props.tableFields.map((field, idx) =>
                  <TableRowColumn key={idx}>
                    {row[field.identifier]}
                  </TableRowColumn>
                )}
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
                <FlatButton
                  label="Edit"
                  onTouchTap={() => this.openDialog('Edit', true)}
                  disabled={this.state.selected.length == 0}
                />
              </TableRowColumn>
              <TableRowColumn>
                <FlatButton
                  label="Add"
                  onTouchTap={() => this.openDialog('Add', false)}
                />
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>
        <Dialog
          title={this.state.dialogTitle}
          actions={actions}
          modal={false}
          open={this.state.dialogOpened}
        >
          {React.cloneElement(this.props.children, {
            formData: this.state.dataForDialog,
            callback: this.updateTaskDataCallback
          })}
        </Dialog>
      </div>
    );
  }
}
