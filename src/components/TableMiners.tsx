import React, { Component } from 'react';
// @ts-ignore
import { config } from '../config'
import { Data } from '../context/Data/Index'
import parserMarkdown from '../utils/Markdown'
// @ts-ignore
import { parse } from "himalaya";
import TableCell from '../components/TableCell'
import { PuffLoader } from "react-spinners";
import { bytesToiB } from '../utils/Filters';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { tableFilter, tableSort } from '../utils/SortFilter';

const NUMBER_OF_ROWS = 9;
interface Miner {
    id: number,
    name: string,
    location: string,
    minerId: string
    contacts: {
        id: number,
        slack: string,
        href: string
    }
}
export default class TableVerifiers extends Component {
    public static contextType = Data
    state = {
        selectedVerifier: 0,
        checks: [],
        miners: [],
        minersIds: [],
        verifiedPrice: new Array(),
        minPieceSize: new Array(),
        reputationScore: new Array(),
        loadingApiData: true,
        initialIndex: 0,
        finalIndex: NUMBER_OF_ROWS,
        pages: [],
        actualPage: 1,
        orderBy: "name",
        sortOrder: -1
    }

    columns = [
        { key: "name", name: "Miner", sort: true },
        { key: "location", name: "Location", sort: true },
        { key: "minerId", name: "Miner ID", sort: true },
        { key: "contact_info", name: "Contact Info", sort: false },
        { key: "flst_price_for_verified_deals", name: "Last Price for Verified Deals", info: true, sort: true },
        { key: "min_piece_size", name: "Min Piece Size", info: true, sort: true  },
        { key: "reputation_score", name: "Reputation Score", info: true, sort: true }
    ]


    componentDidMount() {
        this.loadData()

    }

    setPage = async (e: any) => {
        const actualPage = Number(e.target.id)
        this.setState({
            finalIndex: actualPage * NUMBER_OF_ROWS,
            initialIndex: (actualPage * NUMBER_OF_ROWS) - NUMBER_OF_ROWS,
            actualPage,
        }, () => {
            this.fetchApiData(this.state.minersIds.slice(this.state.initialIndex, this.state.finalIndex))
        })

    }

    checkIndex = (index: number) => {
        return (index >= this.state.initialIndex && index < this.state.finalIndex)
    }

    movePage = async (index: number) => {
        const page = this.state.actualPage + index
        if (page <= this.state.pages.length && page >= 1) {
            this.setState({
                finalIndex: page * NUMBER_OF_ROWS,
                initialIndex: (page * NUMBER_OF_ROWS) - NUMBER_OF_ROWS,
                actualPage: page,
            }, () => {
                this.fetchApiData(this.state.minersIds.slice(this.state.initialIndex, this.state.finalIndex))
            })
        }
    }

    loadData = async () => {
        const response = await fetch(config.minersUrl)
        const text = await response.text()

        const html = parserMarkdown.render(text)
        const json = parse(html);
        const miners = json[2].children[3].children
            .filter((ele: any) => ele.type === "element")
            .map((m: any, i: number = 0) => {
                let index = i++
                let miner: Miner = {
                    id: index,
                    name: m.children[1].children[0].content,
                    location: m.children[3].children[0].content,
                    minerId: m.children[5].children[0].content,
                    contacts: {
                        id: index,
                        slack: m.children[7].children[0].content.slice(m.children[7].children[0].content.indexOf(":") + 2, m.children[7].children[0].content.indexOf("&")),
                        href: m.children[7].children[1]?.children[0]?.content
                    }
                }
                return miner
            })

        this.setState({ miners })

        const numerOfPages = Math.ceil(this.state.miners.length / NUMBER_OF_ROWS)
        let pages = []
        for (let index = 0; index < numerOfPages; index++) {
            pages.push(index + 1)
        }
        this.setState({ pages })

        const minersIds = miners.map((miner: any) => miner.minerId)
        this.setState({ minersIds })
        await this.fetchApiData(minersIds.slice(0, NUMBER_OF_ROWS))
    }

    formatFil(val: string) {
        const n = Number(val);
        let retVal = ''
        if (val === "0") {
            return '0 FIL'
        }
        if (val.length > 18) {
            retVal = `${n / 1000000000000000000} FIL`
            // console.log("/10^18 ", `${n/1000000000000000000} FIL`)
            return retVal
        }
        if (val.length <= 18 && val.length > 6) {
            retVal = `${n / 1000000000} nanoFIL`
            // console.log("/10^9 ", `${n/1000000000} nanoFIL`)
            return retVal
        }
        if (val.length <= 6) {
            retVal = `${n / 1000} attoFIL`
            // console.log("/10^9 ", `${n/1000} attoFIL`)
            return retVal
        }

    }

    fetchApiData = async (minersIds: any[]) => {
        Promise.all(
            minersIds.map(async id => {
                let opts = {
                    headers: {
                        'mode': 'cors',
                        'Access-Control-Allow-Origin': '*'
                    }
                }
                //check if id is contained in state so I don't make the call
                const isPriceInList = this.state.verifiedPrice.includes((item: any) => item.address === id)
                const isSizeInList = this.state.minPieceSize.includes((item: any) => item.address === id)
                const isReputationScoreInList = this.state.reputationScore.includes((item: any) => item.address === id)

                if (isPriceInList && isSizeInList && isReputationScoreInList) {
                    return null
                }

                const res = await fetch(`https://api.filrep.io/api/v1/miners?search=${id}`, opts)
                const json = await res.json()

                let verPrice: any = {}
                let minSize: any = {}
                let rep: any = {}

                if (!isPriceInList) {
                    verPrice = {
                        address: id,
                        price: json.miners[0]?.verifiedPrice ? this.formatFil(json.miners[0]?.verifiedPrice) : "not found"
                    }

                    this.setState({
                        verifiedPrice: [...this.state.verifiedPrice, verPrice],
                    }, () => {
                        // console.log(this.state.minPieceSize)
                    })

                }


                if (!isSizeInList) {
                    minSize = {
                        address: id,
                        size: bytesToiB(json.miners[0]?.minPieceSize) === "NaNB" ? "not found" : bytesToiB(json.miners[0]?.minPieceSize)
                    }
                    this.setState({
                        minPieceSize: [...this.state.minPieceSize, minSize],
                    }, () => {
                        // console.log(this.state.minPieceSize)
                    })
                }

                if (!isReputationScoreInList) {
                    rep = {
                        address: id,
                        reputation: json.miners[0]?.scores !== undefined ? json.miners[0]?.scores.total : "not found",
                        color: !Number(json.miners[0]?.scores.total) ? "black" : Number(json.miners[0]?.score) < 50 ? "red" : " green",
                    }
                    this.setState({
                        reputationScore: [...this.state.reputationScore, rep],
                    }, () => {
                        // console.log(this.state.reputationScore)
                    })
                }
            })
        ).catch(error => {
            console.error(error)
            return
        })

    }

    order = async (e: any, async : boolean) => {
        if(!async){
            const { arraySorted, orderBy, sortOrder } = tableSort(e, this.state.miners as [], this.state.orderBy, this.state.sortOrder)
            this.setState({
                miners: arraySorted,
                sortOrder: sortOrder,
                orderBy: orderBy,
                minersIds: arraySorted.map((item: any) => item.minerId)
            },
                () =>
                    this.fetchApiData(this.state.minersIds.slice(this.state.initialIndex, this.state.finalIndex))
            )
        }else{
            console.log("inside else")
            await this.fetchApiData(this.state.minersIds)
        }
    }


    renderContact = (contacts: any) => {
        if (contacts.href?.includes("@")) {
            return <div className="contacvalue">
                Slack
                <FontAwesomeIcon title={contacts.slack} icon={["fas", "info-circle"]} />
                <br></br>
                <a href={`mailto:${contacts.href}`}>Email </a>
            </div>
        } else if (contacts.href === undefined) {
            return <div className="contacvalue">
                Slack
                <FontAwesomeIcon title={contacts.slack} icon={["fas", "info-circle"]} />
            </div>
        } else {
            return <div className="contacvalue">
                Slack
                <FontAwesomeIcon title={contacts.slack} icon={["fas", "info-circle"]} />
                <br></br>
                <a href={contacts.href}>Website</a>
            </div>
        }

    }




    public render() {
        return (
            <div className="verifiers">
                <div className="tableverifiers miners">
                    <table>
                        <thead>
                            <tr>
                                {this.columns.map((item: any) =>
                                    item.info ?
                                        <td style={{ "textAlign": "center" }}>
                                            {item.name}
                                            {
                                            <FontAwesomeIcon icon={["fas", "sort"]} id={item.key} onClick={ async (e) => this.order(e, true)} />}
                                            <FontAwesomeIcon title={"This information is coming from filrep.io"} icon={["fas", "info-circle"]} />
                                        </td> :  item.sort ?
                                            <td style={{ "textAlign": "center" }}>
                                                {item.name}
                                                <FontAwesomeIcon icon={["fas", "sort"]} id={item.key} onClick={async (e) => this.order(e, false)} />
                                            </td> :
                                            <td style={{ "textAlign": "center" }}>
                                                {item.name}
                                            </td>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.miners.map((miner: Miner, i) =>

                                this.checkIndex(i) ?

                                    <tr key={i} id={miner?.id.toString()}>
                                        <td style={{ "textAlign": "center" }}>
                                            {miner?.name}
                                        </td>
                                        <td style={{ "textAlign": "center" }}>
                                            {miner?.location.split(',')[0]}<br></br>{miner.location.split(',')[1]}
                                        </td>
                                        <td style={{ "textAlign": "center" }}>
                                            {miner?.minerId}
                                        </td>
                                        <td style={{ "textAlign": "center" }} >

                                            {this.renderContact(miner?.contacts)}
                                        </td>
                                        {/* <td>
                                            <TableCell
                                                text={miner.children[11].children[0].content} />
                                        </td> */}
                                        <td style={{ "textAlign": "center" }}>
                                            {this.state.verifiedPrice.find(item => item.address === miner.minerId) !== undefined ?
                                                this.state.verifiedPrice?.find(item => item.address === miner.minerId)?.price
                                                :
                                                <PuffLoader speedMultiplier={0.8} size={30} color={"rgb(24,160,237)"} />
                                            }
                                        </td>
                                        <td style={{ "textAlign": "center" }}>
                                            {this.state.minPieceSize.find(item => item.address === miner.minerId) !== undefined ?
                                                this.state.minPieceSize?.find(item => item.address === miner.minerId)?.size
                                                :
                                                <PuffLoader speedMultiplier={0.8} size={30} color={"rgb(24,160,237)"} />
                                            }
                                        </td>
                                        {this.state.reputationScore.find(item => item.address === miner.minerId) !== undefined ?
                                            <td style=
                                                {{
                                                    "textAlign": "center",
                                                    "color": this.state.reputationScore?.find(item => item.address === miner.minerId)?.color
                                                }}
                                            >
                                                {this.state.reputationScore?.find(item => item.address === miner.minerId)?.reputation}
                                            </td>
                                            :
                                            <td style={{ "textAlign": "center" }}>
                                                <PuffLoader speedMultiplier={0.8} size={30} color={"rgb(24,160,237)"} />
                                            </td>
                                        }
                                    </tr>
                                    : null
                            )
                            }
                        </tbody>
                    </table>
                </div>
                <div className="pagination paginationminers">
                    <div className="pagenumber paginator" onClick={e => this.movePage(-1)}>{"<"}</div>
                    {this.state.pages.map((page: any, i) =>
                        <div className="pagenumber"
                            style={this.state.actualPage === i + 1 ? { backgroundColor: "#33A7FF", color: 'white' } : {}}
                            id={(i + 1).toString()}
                            onClick={e => this.setPage(e)}>
                            {page}
                        </div>
                    )}
                    <div className="pagenumber paginator" onClick={e => this.movePage(1)}>{">"}</div>
                </div>
            </div>
        )
    }
}