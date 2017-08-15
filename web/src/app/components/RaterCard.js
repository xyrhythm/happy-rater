import React, {Component} from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import DataTable from './DataTable';
import RaterForm from './RaterForm';

export default class RaterCard extends Component {
  render() {
    const defaultData = {account: '', username: ''};
    const raterTable = (
      <DataTable
        defaultData={defaultData}
        tableFields={[
          {
            name: 'Account',
            tooltip: 'Account information',
            identifier: 'account'
          },
          {
            name: 'User Name',
            tooltip: 'User name',
            identifier: 'username'
          },
          {
            name: 'Registration time',
            tooltip: 'The timestamp when the rater was created',
            identifier: 'created_timetamp'
          },
          {
            name: 'Modified time',
            tooltip: 'The timestamp when the rater was modified',
            identifier: 'modified_timestamp'
          }
        ]}
        primaryField="rater_id"
        urls={{
          fetch: '/getRaters',
          delete: '/deleteRater',
          add: '/addRater',
          update: '/updateRater'
        }}
      >
        <RaterForm />
      </DataTable>
    );

    return (
      <Card style={this.props.style}>
        <CardTitle
          title="Manage Raters"
          subtitle="Create/Delete raters in the following table."
        />
        <CardText>
          {raterTable}
        </CardText>
      </Card>
    );
  }
}
