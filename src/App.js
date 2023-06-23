// React and UI components for demo
import React, { Component } from 'react'

// The required ual-reactjs-renderer with ual-anchor, ual-scatter, and ual-ledger
import { Anchor } from 'ual-anchor'
import { Ledger } from 'ual-ledger'
// import { Scatter } from 'ual-scatter'
import { UALProvider } from 'ual-reactjs-renderer'

// React components for this demo, not required
import { find } from 'lodash'
import blockchains from './assets/blockchains.json'
import Main from './Main'

// Define the app name for UAL
const appName = 'ual-reactjs-renderer-demo-multipass'

class App extends Component {
  // Demo initialization code
  constructor(props) {
    super(props)
    // Add the ability to retrieve the chainId from the URL
    const search = window.location.search
    const params = new URLSearchParams(search)
    const chainId = params.get('chainId') || '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4'
    // Set initial application state with the default chainId
    this.state = {
      chainId,
    }
  }
  getAuthenticators = (chainId) => {
    const [ chain ] = blockchains.filter((c) => c.chainId === chainId)
    /*
      Example Chain Configuration:

      {
        "chainId": "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
        "name": "EOS",
        "rpcEndpoints": [
          {
            "protocol": "https",
            "host": "eos.greymass.com",
            "port": 443
          }
        ]
      }

    */
    const anchor = new Anchor([ chain ], {
      // REQUIRED: The name of the app requesting a session
      //    This can be any string, preferably short, for wallets to display session information about.
      appName,
      // ---
      // OPTIONAL: An eosjs RPC client for ual-anchor to use
      // rpc = new JsonRpc(`https://api.somewhere.com`),
      // ---
      // OPTIONAL: An @greymass/eosio API Client for ual-anchor to use
      //    Defaults to: An APIClient instance utilizing the default API
      // client = new APIClient({ provider }),
      // ---
      // OPTIONAL: Fuel by default is used to sign transactions for users with low resources.
      //    Defaults to: false
      // disableGreymassFuel: false,
      // ---
      // OPTIONAL: Specify an account name to use as a referral for potential Fuel revenue sharing
      //    Defaults to: teamgreymass
      // fuelReferrer: 'teamgreymass',
      // ---
      // OPTIONAL: Enable the browser transport success/failure messages instead of handling yourself
      //    Defaults to: true
      // requestStatus: true,
      // ---
      // OPTIONAL: Set the callback service
      //    Defaults to: https://cb.anchor.link
      // service: 'https://cb.anchor.link',
      // ---
      // OPTIONAL: Request that the identity proofs provided are verified by anchor-link
      //    Defaults to: false
      // verifyProofs: false,
    })
    const ledger = new Ledger([chain])
    // const scatter = new Scatter([chain], {
    //   appName
    // })
    return [
      anchor,
      ledger,
    //   scatter
    ]
  }
  // React State Helper to update chainId while switching blockchains
  setChainId = (e, { value }) => this.setState({
    chainId: value
  }, () => {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('chainId', value)
    window.history.pushState(null, null, `?${searchParams.toString()}`)
  })
  render() {
    const {
      chainId,
    } = this.state
    // Find the blockchain information (rpc, name, etc) for UI purposes
    const chain = find(blockchains, { chainId })
    // Retrieve the authenticators for this chain for UAL
    const authenticators = this.getAuthenticators(chainId)
    // Return the UI
    return (
      <UALProvider
        appName={appName}
        authenticators={authenticators}
        chains={blockchains}
        key={chain.chainId}
      >
        <Main
          appName={appName}
          chain={chain}
          setChainId={this.setChainId}
          key={chain.chainId}
        />
      </UALProvider>
    )
  }
}

export default App
