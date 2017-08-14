import React, {Component} from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TaskTable from './TaskTable';

export default class TaskCard extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Card style={this.props.style}>
        <CardTitle title="Manage Tasks" />
        <CardText>
          <TaskTable />
        </CardText>
      </Card>
    );
  }
}
