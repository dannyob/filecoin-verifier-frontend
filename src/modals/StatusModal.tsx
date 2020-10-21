import React, { Component } from 'react';
// @ts-ignore
import { ButtonPrimary, dispatchCustomEvent, Input } from "slate-react-system";

type States = {
    address: string
    email: string
};

class StatusModal extends Component<{}, States> {

    constructor(props: {}) {
        super(props);
        this.state = {
            address: '',
            email: ''
        }
    }

    handleSubmit = async (e: any) => {
        dispatchCustomEvent({ name: "delete-modal", detail: {} })
    }

    render() {
        return (
            <>
                <div className="confirmmodal">
                    <div className="title">Check your status</div>
                    <div className="description">Enter the following information to view your datacap request status(es)</div>
                    <form>
                        <div>
                            <div className="inputholder">
                                <Input
                                    description="Address"
                                    name="address"
                                    value={this.state.address}
                                    placeholder="Address"
                                />
                            </div>
                            <div className="inputholder">
                                <Input
                                    description="Email Address or Phone #"
                                    name="email"
                                    value={this.state.email}
                                    placeholder="Contact Information"
                                />
                            </div>
                    </div>
                    <div className="centerbutton">
                        <ButtonPrimary onClick={this.handleSubmit}>Continue</ButtonPrimary>
                    </div>
                </form>
                </div>
            </>
        )
    }
}

export default StatusModal;