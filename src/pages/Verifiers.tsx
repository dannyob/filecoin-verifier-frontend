import React, { Component } from 'react';
// @ts-ignore
import { ButtonPrimary } from "slate-react-system";
import { Wallet } from '../context/Index';
import Welcome from '../components/Welcome'
import TableVerifiers from '../components/TableVerifiers';
import Header from '../components/Header';
// @ts-ignore
import LoginGithub from 'react-login-github';

class Verifiers extends Component<{}> {
  public static contextType = Wallet


  child: any

  constructor(props: {}) {
    super(props);
    this.child = React.createRef();
  }


  makeRequest = () => {
    this.child.current.contactVerifier();
  }

  render() {
    return (
      <div className="landing">
        <Header />
        <div className="container">
          <Welcome
            title="Welcome to the Filecoin Plus Registry"
            description="A public request is all about Dash launched a hot deterministic wallet! Stellar is a burned exchange during lots of wash trade, so someone slept on the trusted fish. It proves many difficulty behind some cold wallet! Since IOTA counted few hot gas..."
          />
          <div className="wrapperverifiers">
            <div className="tableselects">
              <div className="tabletitle">Select Notary, Send Request</div>
            </div>
            <TableVerifiers ref={this.child} />
            <div className="started">
              <div className="doublebutton">
                <ButtonPrimary onClick={() => this.makeRequest()}>
                  Make Request
              </ButtonPrimary>
                <ButtonPrimary>Learn More</ButtonPrimary>
                <div id="githublogin">
                  <LoginGithub
                    //clientId="8e922e2845a6083ab65c"
                    clientId="Iv1.940c1b5a18b6566d"
                    scope="repo"
                    onSuccess={(response: any) => {
                      this.context.loginGithub(response.code, false)
                    }}
                    onFailure={(response: any) => {
                      console.log('failure', response)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Verifiers;