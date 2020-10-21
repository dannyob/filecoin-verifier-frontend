import React, { Component } from 'react';
import Sent from './svg/sent.svg'
import Approve from './svg/request-approved.svg'
import Failed from './svg/request-failed.svg'
import NotFound from './svg/request-not-found.svg'
import Pending from './svg/request-pending.svg'

// @ts-ignore
import { ButtonPrimary, dispatchCustomEvent } from "slate-react-system";

type VerificationModalProps = {
    title: string,
    subtitle: string,
    status: string
}

class VerificationModal extends Component<VerificationModalProps> {

    handleSubmit = async (e: any) => {
        dispatchCustomEvent({ name: "delete-modal", detail: {} })
    }

    constructor(props: VerificationModalProps) {
        super(props);
    }

    conditionalRender = () => {
        switch (this.props.status) {
            case "approve":
                return <img src={Approve} alt={"Approve"} />;
            case "failed":
                return <img src={Failed} alt={"Failed"} />;
            case "notfound":
                return <img src={NotFound} alt={"Not found"} />;
            case "pending":
                return <img src={Pending} alt={"Pending"} />;
        }
    };


    buttonText = () => {
        switch (this.props.status) {
            case "approve":
                return "Collect Datacap";
            case "failed":
                return "Go Back";
            case "notfound":
                return "Return Home";
            case "pending":
                return "Go Back";
        }
    };

    render() {
        return (
            <>
                <div className="confirmmodal">
                    <div className="title">{this.props.title}</div>
                    <div className="description">{this.props.subtitle}</div>
                    <div className="img">{this.conditionalRender}</div>
                    <div className="button"><ButtonPrimary onClick={this.handleSubmit}>{this.buttonText}</ButtonPrimary></div>
                </div>
            </>
        )
    }
}

export default VerificationModal;