// React and UI components for demo
import React, { Component } from 'react'
import { Button, Container, Header, Segment } from 'semantic-ui-react'

// The required ual includes
import { withUAL } from 'ual-reactjs-renderer'

// React components for this demo, not required
import Accounts from './Accounts.js'
import Blockchains from './Blockchains.js'
import Response from './Response.js'

class App extends Component {
  // Demo initialization code
  constructor(props) {
    super(props)
    console.log(props)
    // Set initial blank application state
    this.state = {
      response: undefined,
      session: undefined,
      sessions: [],
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.state.chainId !== prevState.chainId) {
      console.log("chainId change")
    }
    if (this.props.ual.activeUser !== prevProps.ual.activeUser) {
      console.log("activeUser change")
    }
  }
  addAccount = () => {
    this.props.ual.showModal()
  }
  signTransaction = async () => {
    // Retrieve current session from state
    const { ual: { activeUser } } = this.props
    try {
      // Reset our response state to clear any previous transaction data
      this.setState({ response: undefined })
      // Determine our auth from the current authenticator
      let actor;
      let permission;
      if (activeUser.scatter) {
        const [ current ] = activeUser.scatter.identity.accounts;
        actor = current.name
        permission = current.authority
      }
      if (activeUser.session) {
        actor = activeUser.accountName
        permission = activeUser.requestPermission
      }
      // Call transact on the session
      const result = await activeUser.signTransaction({
        actions: [
          {
            account: 'eosio',
            name: 'voteproducer',
            authorization: [{
              actor,
              permission,
            }],
            data: {
              producers: [],
              proxy: 'greymassvote',
              voter: activeUser.accountName
            }
          }
        ]
      }, {
        // Optional: Whether anchor-link should broadcast this transaction
        //    For this demo, anchor-link will not broadcast the transaction after receiving it
        broadcast: false,
        // Optional: TAPOS values
        blocksBehind: 3,
        expireSeconds: 120,
      })
      // Update application state with the results of the transaction
      console.log(result)
      this.setState({ response: result.transaction })
    } catch(e) {
      console.log(e)
    }
  }
  // React State Helper to update sessions while switching accounts
  setSession = async (auth) => {
    // Restore a specific session based on appName and auth
    const session = await this.link.restoreSession(this.props.appName, auth)
    // Update application state with new session and reset response data
    this.setState({
      response: undefined,
      session,
    })
  }
  // React State Helper to remove/delete a session
  removeSession = async (auth) => {
    const { ual: { logout } } = this.props
    logout();
    // // Remove from local storage based on appName and auth
    // await this.link.removeSession(this.props.appName, auth)
    // // Remove from local application state
    // const { session, sessions } = this.state
    // // If this was the currently active account, remove the session
    // if (session && session.auth.actor === auth.actor && session.auth.permission === auth.permission) {
    //   this.setState({ session: undefined });
    // }
    // this.setState({
    //   sessions: sessions.filter(s => !(s.actor === auth.actor && s.permission === auth.permission))
    // })
  }
  render() {
    // Load state for rendering
    const {
      session,
      sessions,
      response,
    } = this.state
    const {
      chain,
    } = this.props
    const { ual: { activeUser } } = this.props
    const { ual: { users } } = this.props
    console.log(users)
    // Return the UI
    return (
      <Container
        style={{ paddingTop: '2em' }}
      >
        <Header attached="top" block size="huge">
          ual-reactjs-renderer-demo-multipass
          <Header.Subheader>
            <p>An UAL demo that allows multiple persistent logins from different wallets, blockchains, and accounts.</p>
            <p>Source code: <a href="https://github.com/greymass/ual-reactjs-renderer-demo-multipass">https://github.com/greymass/ual-reactjs-renderer-demo-multipass</a></p>
          </Header.Subheader>
        </Header>
        <Segment attached padded>
          <p>Switch to a specific blockchain.</p>
          <Blockchains
            chain={chain}
            onChange={this.props.setChainId}
          />
        </Segment>
        <Segment attached padded>
          <Header>Available Accounts</Header>
          <Accounts
            activeUser={activeUser}
            addAccount={this.addAccount}
            chain={chain}
            setSession={this.setSession}
            removeSession={this.removeSession}
            users={users}
          />
        </Segment>
        <Segment attached={response ? true : 'bottom'} padded>
          <Header>Transact with anchor-link</Header>
          <Button
            content="Sign Test Transaction"
            disabled={!activeUser}
            icon="external"
            onClick={this.signTransaction}
            primary
            size="huge"
          />
          {(!activeUser)
            ? <p style={{ marginTop: '0.5em'}}>Login using UAL to sign a test transaction.</p>
            : false
          }
        </Segment>
        {(response)
          ? (
            <Segment attached="bottom" padded>
              <Header>Transaction Response</Header>
              <Response
                response={response}
              />
            </Segment>
          )
          : false
        }
      </Container>
    )
  }
}

// ensure this component is exported withUAL
export default withUAL(App)
