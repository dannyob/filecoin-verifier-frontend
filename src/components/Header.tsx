import React, { Component } from 'react';
import Logo from '../logo.svg';
import history from '../context/History'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//@ts-ignore
import { ButtonPrimary, dispatchCustomEvent } from "slate-react-system";
import StatusModal from '../modals/StatusModal'



class Header extends Component {

    onClick = () => {
        history.push({
            pathname: "/"
        })
    }

    goBack = () => {
        history.goBack()
    }

    requestStatus = async () => {
        dispatchCustomEvent({
            name: "create-modal", detail: {
                id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5),
                modal: <StatusModal />
            }
        })
    }


    render() {
        return (
            <div className="header">
                {window.location.pathname.length === 1 ? null :
                    < div className="headerback" onClick={() => this.goBack()}>
                        <FontAwesomeIcon icon={["fas", "arrow-left"]} /> Back
                    </div>
                }
                <div className="headerlogo" onClick={() => this.onClick()}><img src={Logo} alt="Filecoin" /></div>
                <div className="headerrequest buttonnotfilled" onClick={() => this.onClick()}>
                    <ButtonPrimary onClick={this.requestStatus}>Request status</ButtonPrimary>
                </div>
            </div >
        )
    }
}

export default Header;
