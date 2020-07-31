import React, { Component } from 'react';
import { Wallet } from './context/Index'
// @ts-ignore
import { Table, H1, H2, H3, H4, P, UL, OL, LI } from "slate-react-system";

export default class Verifiers extends Component {
    public static contextType = Wallet

    columns = [
        { key: "a", name: "Verifier" },
        { key: "b", name: "Datacap" }
    ]

    state = {
        verifiers: [],
    }

    componentDidMount() {
        this.startApi()
    }

    startApi = async () => {
        let listverifiers = await this.context.api.listVerifiers()
        let ver:any = []
        for (let [k,v] of listverifiers) {
            ver.push({a:k, b:v.toString(10)})
        }
        this.setState({verifiers:ver})
    }

    public render(){
        return (
            <div>
                <H1>Verifiers</H1>
                <Table data={{rows: this.state.verifiers, columns: this.columns}}/>
            </div>
        )
    }
}