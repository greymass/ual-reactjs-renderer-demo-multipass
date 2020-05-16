import React, { Component } from 'react'
import { Button, Table } from 'semantic-ui-react';

class Debug extends Component {
  render() {
    const { activeUser, chain, users } = this.props;
    return (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell collapsing>{chain.name}</Table.HeaderCell>
            <Table.HeaderCell>Account</Table.HeaderCell>
            <Table.HeaderCell>Permission</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>
        {(users.length)
          ? (
            <Table.Body>
              {users.map((s) => {
                let actor;
                let permission;
                let key;
                let isCurrent = false;
                if (activeUser.scatter) {
                  const [ active ] = activeUser.scatter.identity.accounts;
                  const [ current ] = s.scatter.identity.accounts;
                  isCurrent = (current && current.name  === active.name && current.authority === active.authority);
                  key = [current.name, current.authority].join('-')
                  actor = current.name
                  permission = current.authority
                }
                if (activeUser.session) {
                  isCurrent = (activeUser && s.accountName === activeUser.accountName && s.requestPermission === activeUser.requestPermission)
                  key = Object.values(s).join('-')
                  actor = s.accountName
                  permission = s.requestPermission
                }
                return (
                  <Table.Row key={key}>
                    <Table.Cell collapsing>
                      <Button
                        color={isCurrent ? "blue" : "green"}
                        content={isCurrent ? "In Use" : "Use Account"}
                        disabled={isCurrent}
                        onClick={() => this.props.setSession({ actor, permission })}
                      />
                    </Table.Cell>
                    <Table.Cell>{actor}</Table.Cell>
                    <Table.Cell>{permission}</Table.Cell>
                    <Table.Cell collapsing>
                      <Button
                        color="red"
                        icon="trash"
                        onClick={() => this.props.removeSession({ actor, permission })}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          )
          : (
            <Table.Body>
              <Table.Row textAlign="center">
                <Table.Cell colSpan="4">No Accounts Imported</Table.Cell>
              </Table.Row>
            </Table.Body>
          )
        }
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4" textAlign="center">
              <Button
                basic
                content="Add Account"
                fluid
                onClick={this.props.addAccount}
                primary
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

export default Debug;
