import React, {Component} from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import DataTable from './DataTable';
import TaskForm from './TaskForm';

export default class TaskCard extends Component {
  render() {
    const defaultData = {
      // TODO: For now, hard-coded task requester id to be 1.
      // Hook this up with the login logic in the future.
      task_requester_id: 1,
      task_name: '',
      task_type: 0,
      task_instruction: '',
      task_question_string: ''
    };
    const taskTable = (
      <DataTable
        defaultData={defaultData}
        tableFields={[
          {
            name: 'ID',
            tooltip: 'Unique identifier',
            identifier: 'task_id'
          },
          {
            name: 'Requester',
            tooltip: 'Requester identifier',
            identifier: 'task_requester_id'
          },
          {
            name: 'Name',
            tooltip: 'Task name',
            identifier: 'task_name'
          },
          {
            name: 'Type',
            tooltip: 'Task type',
            identifier: 'task_type'
          },
          {
            name: 'Instruction',
            tooltip: 'Task instruction',
            identifier: 'task_instruction'
          },
          {
            name: 'Question',
            tooltip: 'Task question',
            identifier: 'task_question_string'
          }
        ]}
        primaryField="task_id"
        urls={{
          fetch: '/getTasks',
          delete: '/deleteTask',
          add: '/addTask',
          update: '/updateTask'
        }}
      >
        <TaskForm />
      </DataTable>
    );
    return (
      <Card style={this.props.style}>
        <CardTitle
          title="Manage Tasks"
          subtitle="Create/Delete tasks in the following table."
        />
        <CardText>
          {taskTable}
        </CardText>
      </Card>
    );
  }
}
