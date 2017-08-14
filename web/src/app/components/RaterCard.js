import React, {Component} from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaterTable from './RaterTable';

export default class RaterCard extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <Card style={this.props.style}>
        <CardTitle
          title="Manage Raters"
          subtitle="Create/Delete raters in the following table."
        />
        <CardText>
          <RaterTable />
        </CardText>
      </Card>
    );
  }
}
