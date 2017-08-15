import React, {Component} from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import DataTable from './DataTable';
import RaterForm from './RaterForm';

export default class RaterCard extends Component {
  render() {
    const defaultData = {rater_account: '', rater_username: ''};
    const raterTable = (
      <DataTable
        defaultData={defaultData}
        tableFields={[
          {
            name: 'ID',
            tooltip: 'Unique identifier',
            identifier: 'rater_id'
          },
          {
            name: 'Account',
            tooltip: 'Account information',
            identifier: 'rater_account'
          },
          {
            name: 'User Name',
            tooltip: 'User name',
            identifier: 'rater_username'
          },
          {
            name: 'Registration time',
            tooltip: 'The timestamp when the rater was created',
            identifier: 'rater_registration_timetamp'
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
