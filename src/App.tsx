import React, { Component } from 'react';
import Overview from './Overview'
import Landing from './Landing'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import Logo from './logo.svg';
import Network from './filecoin-network.svg';
import { Wallet } from './context/Index'
import { addressFilter, datacapFilter } from './Filters'
import WalletModal from './WalletModal'
import copy from 'copy-text-to-clipboard'
import './App.scss';
// @ts-ignore
import { Input, dispatchCustomEvent, Toggle, SVG, LoaderSpinner } from "slate-react-system"
import { config } from './config'
import Blockies from 'react-blockies'

library.add(fab, far, fas)

type States = {
  networkSelect: boolean
  accountSelect: boolean
}

class App extends Component<{}, States> {
  public static contextType = Wallet
  child: any

  constructor(props: {}) {
    super(props);
    this.state = {
      networkSelect: false,
      accountSelect: false
    }
    this.child = React.createRef();
  }

  componentDidMount() {

  }

  openNetworkSelect = (e: any) => {
    this.setState({
      networkSelect: this.state.networkSelect === false ? true : false
    })
  }

  openAccountSelect = (e: any) => {
    this.setState({
      accountSelect: this.state.accountSelect === false ? true : false
    })
  }

  switchNetwork = (index: number) => {
    this.context.selectNetwork(index)
    this.refresh()
  }

  switchAccount = (index: number) => {
    this.context.selectAccount(index)
  }

  switchRoot = () => {
    this.context.switchview()
  }

  openWallet = async () => {
    dispatchCustomEvent({
      name: "create-modal", detail: {
        id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
        modal: <WalletModal />
      }
    })
  }

  copyAddress = async (address: string) => {
    copy(address)
    this.context.dispatchNotification(address + ' copied to clipboard')
  }

  refresh = () => {
    this.child.current.loadData();
  }

  getVerifierAmount = (account: string) => {
    for (const verified of this.context.verified) {
      if (account === verified.verifierAccount) {
        return verified.datacap
      }
    }
    return '0'
  }

  render() {
    return (
      <div className="App">
        <div className="header">
          <div><img src={Logo} alt="Filecoin" /></div>
          <div className="networkselect" onClick={this.openNetworkSelect}>
            {this.state.networkSelect ?
              <div className="networkselectholder">
                <div className="headertitles">Network Select</div>
                {config.lotusNodes.map((node: any, index: number) => {
                  return <div key={index} style={{ color: index === this.context.networkIndex ? '#003fe3' : 'inherit' }} className="networkentry" onClick={() => this.switchNetwork(index)}>{node.name}</div>
                })}
              </div>
              : null}
            <div className="headertitles">Network selected</div>
            <div className="addressholder">{config.lotusNodes[this.context.networkIndex].name}</div>
          </div>
          <div className="datacap">
            <div className="headertitles">Datacap Amount</div>
            <div><FontAwesomeIcon icon={["far", "save"]} /> 50 TiB</div>
          </div>
          <div className="search">
            <Input
              name="search"
              placeholder="Search"
            />
            <FontAwesomeIcon icon={["fas", "search"]} />
          </div>
          <div className="refresh" onClick={() => this.refresh()}>
            <FontAwesomeIcon icon={["fas", "redo"]} flip="vertical" transform={{ rotate: 135 }} />
          </div>
          <div className="notification"><FontAwesomeIcon icon={["far", "bell"]} /></div>
          <div className="accountholder" onClick={this.openAccountSelect}>
            {this.state.accountSelect ?
              <div className="accountselectholder">
                <div className="headertitles">Select Account Type</div>
                <div>
                  <div className="accounttype">{this.context.viewroot ? 'Rootkey Holder' : 'Approved Verifier'}</div>
                  <div className="viewswitch">
                    <Toggle
                      active={this.context.viewroot}
                      name="accountview"
                      onChange={this.switchRoot}
                    />
                  </div>
                </div>
                {this.context.accounts.map((account: any, index: number) => {
                  return <div key={index} className="accountentry" style={{ backgroundColor: index === this.context.walletIndex ? '#C7C7C7' : 'inherit' }}>
                    <div>
                      <div className="datacapdata">
                        {this.context.viewroot === false ? <span className="datacap">Datacap: {datacapFilter(this.getVerifierAmount(account))}</span> : <span className="datacap"></span>}
                        <img src={Network} alt="network"/>
                      </div>
                      <div className="accountdata">
                        <span className="accountaddress" onClick={() => this.switchAccount(index)} >{addressFilter(account)}</span>
                        <span className="copyaddress" onClick={() => this.copyAddress(account)}><SVG.CopyAndPaste height='15px' /></span>
                      </div>
                    </div>
                  </div>
                })}
                {this.context.wallet !== 'ledger' ?
                  <div className="importseedphrase" onClick={() => { this.openWallet() }}>Import Address</div>
                  : null
                }
              </div>
              : null}
            <div className="headertitles">{this.context.viewroot ? 'Rootkey Holder ID' : 'Approved Verifier ID'}</div>
            <div>{addressFilter(this.context.activeAccount)}</div>
          </div>
          <div className="wallet">
            <div className="WalletMenu">
              <Blockies
                seed={this.context.activeAccount}
                size={10}
                scale={4}
                color="#dfe"
                bgColor="#ffe"
                spotColor="#abc"
              />
            </div>
          </div>
        </div>
        { this.context.isLoading === true ?
          <div className="walletpicker"><LoaderSpinner /></div>
          : this.context.isLogged === false ?
            <Landing />
            :
            <Overview ref={this.child} />
        }
      </div>
    );
  }
}

export default App;
