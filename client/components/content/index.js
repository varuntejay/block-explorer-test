import React, { Component } from 'react';
import './style.css'
import axios from 'axios';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdRefresh
} from "react-icons/md";
import {
    Tooltip
} from '@material-ui/core';

export default class Content extends Component {
    constructor() {
        super();
        this.state = {
            blocksHeight: 0,
            blocksDetails: [],
            trasactionDetailsMarkup: "",
            viewBlockMarkup: true,
            viewTransactionMarkup: false,
            transactionsTableMarkup: "",
            row: ""
        }
    }

    componentDidMount() {
        this.refreshBlockDetails();
    }

    refreshBlockDetails = async () => {
        try {
            // this.getPeersCount();
            // this.getChaincodesCount();
            // let blocksHeight = await this.getBlockHeight();
            // let fromBlockNumber = blocksHeight - 1;
            // let toBlockNumber = (fromBlockNumber > 9) ? (fromBlockNumber - 9) : 0
            // let blocksDetails = await this.getBlockDetails(fromBlockNumber, toBlockNumber)
            // this.prepareBlocksTableMarkup(blocksDetails);
            // this.setState({
            //     blocksHeight: blocksHeight,
            //     blocksDetails: blocksDetails,
            //     fromBlockNumber: fromBlockNumber,
            //     toBlockNumber: toBlockNumber
            // })

            let blocksDetails = [{
                "blockNumber": 1,
                "timestamp": "02/12/2020",
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3",
                "txnCount": 2
            },
            {
                "blockNumber": 2,
                "timestamp": "02/12/2020",
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3",
                "txnCount": 2
            },
            {
                "blockNumber": 3,
                "timestamp": "02/12/2020",
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3",
                "txnCount": 2
            },
            {
                "blockNumber": 4,
                "timestamp": "02/12/2020",
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3",
                "txnCount": 2
            },
            {
                "blockNumber": 5,
                "timestamp": "02/12/2020",
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3",
                "txnCount": 2
            },
            {
                "blockNumber": 6,
                "timestamp": "02/12/2020",
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3",
                "txnCount": 2
            },
            {
                "blockNumber": 1,
                "timestamp": "02/12/2020",
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3",
                "txnCount": 2
            }
            ];

            this.prepareBlocksTableMarkup(blocksDetails);

            this.setState({
                blocksHeight: 10,
                blocksDetails: blocksDetails,
                fromBlockNumber: 1,
                toBlockNumber: 10
            })
        } catch (err) {
            alert(err)
        }
    }


    // handleAccordion = (event) => {
    //     console.log(event.target.value)
    //     this.setState({ row: event.target.value })
    // }

    prepareTransactionsTableMarkup = (transactionDetails) => {
        let markup = []
        transactionDetails.forEach((txn) => {
            markup.push(
                <tr className="dataBorderBottom">
                    <td>{txn.txnNumber}</td>
                    <td>{txn.hash}</td>
                    <td>
                        <button type="button" style={{ padding: '5px' }} value={JSON.stringify(txn.txnNumber)}
                            onClick={this.fetchTransactionDetails}>Fetch</button>
                    </td>
                </tr>
            )
        })
        this.setState({ transactionsTableMarkup: markup })
    }

    fetchTransactionDetails = (event) => {
        let txn = {
            "gas": 103883,
            "gasPrise": 108383833333,
            "value": 120000000000000,
            "sender": "0xFKE864936483403403040347030",
            "reciever": "0xFKE864936483403403040347030"
        }
        let markup =
            <table className="transactionDetails">
                <tbody>
                    <tr>
                        <td> Gas</td>
                        <td>{txn.gas}</td>
                    </tr>
                    <tr>
                        <td>Gas Prise</td>
                        <td>{txn.gasPrise}</td>
                    </tr>
                    <tr>
                        <td>Value</td>
                        <td>{txn.value}</td>
                    </tr>
                    <tr>
                        <td>Sender</td>
                        <td>{txn.sender}</td>
                    </tr>
                    <tr>
                        <td>Reciever</td>
                        <td>{txn.reciever}</td>
                    </tr>
                </tbody>
            </table>
        this.setState({ trasactionDetailsMarkup: markup })
    }

    getTransactions = (event) => {

        this.setState({ viewBlockMarkup: false, viewTransactionMarkup: true, blockNumber: event.target.value })
        let transactions = [
            {
                "txnNumber": 1,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 2,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 3,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 4,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 5,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 6,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 7,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 8,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            },
            {
                "txnNumber": 9,
                "hash": "0xKJFKEFOEFOUEJBB892698BEKJBE93Y3"
            }
        ];
        this.prepareTransactionsTableMarkup(transactions)

    }

    prepareBlocksTableMarkup(blocksDetails) {

        let markup = []
        blocksDetails.forEach((block) => {
            markup.push(
                <tr className="dataBorderBottom">
                    <td>{block.blockNumber}</td>
                    <td>{block.timestamp}</td>
                    <td>{block.hash}</td>
                    <td>{block.txnCount}</td>
                    <td>
                        <button type="button" style={{ padding: '5px' }} value={JSON.stringify(block.blockNumber)}
                            onClick={this.getTransactions}>Fetch</button>
                    </td>
                </tr>
            )
        })
        this.setState({ blocksTableMarkup: markup })
    }

    getBlockHeight = () => {
        return new Promise((resolve, reject) => {
            try {
                axios.post('http://localhost:9086/getBlocks/height')
                    .then((response) => {
                        console.log(response)
                        if (response.data.status) {
                            resolve(response.data.blocksHeight);
                        } else {
                            throw new Error('Failed to get block height')
                        }
                    })
            } catch (err) {
                reject(err);
            }
        })
    }

    getBlockDetails = (fromBlockNumber, toBlockNumber) => {
        return new Promise((resolve, reject) => {
            try {
                let params = {
                    fromBlockNumber: fromBlockNumber,
                    toBlockNumber: toBlockNumber
                }
                axios.post('http://localhost:9086/getBlocks/details', params)
                    .then((response) => {
                        console.log(response)
                        if (response.data.status) {
                            resolve(response.data.blocksDetails);
                        } else {
                            throw new Error('Failed to get block height')
                        }
                    })
            } catch (err) {
                reject(err);
            }
        })
    }

    prepareblocksTableMarkup = (event) => {
        let blockDetails = JSON.parse(event.target.value);
        console.log(blockDetails);
        let markup = [];
        (blockDetails.trnxns).forEach((txn) => {
            let endorsements = [];
            if (txn.payload.hasOwnProperty('data')) {
                if (txn.payload.data.hasOwnProperty('actions')) {
                    if (txn.payload.data.actions.length > 0) {
                        (txn.payload.data.actions[0].payload.action.endorsements).forEach((endorsement) => {
                            endorsements.push(endorsement.endorser.Mspid)
                        })
                    }
                }
            }
            markup.push(
                <table>
                    <tbody>
                        <tr>
                            <td> Block number</td>
                            <td>{blockDetails.blockNumber}</td>
                        </tr>
                        <tr>
                            <td> Transaction Id</td>
                            <td>{txn.payload.header.channel_header.tx_id}</td>
                        </tr>
                        <tr>
                            <td> Timestamp</td>
                            <td>{txn.payload.header.channel_header.timestamp}</td>
                        </tr>
                        <tr>
                            <td> Channel Id</td>
                            <td>{txn.payload.header.channel_header.channel_id}</td>
                        </tr>
                        <tr>
                            <td> Transaction creator Mspid</td>
                            <td>{txn.payload.header.signature_header.creator.Mspid}</td>
                        </tr>
                        {endorsements.length > 0 ?
                            <tr>
                                <td> Transaction endorsements</td>
                                <td>{endorsements.join(', ')}</td>
                            </tr> : 'NA'
                        }
                    </tbody>
                </table>
            )
        })
        this.setState({ trasactionDetailsMarkup: markup })
    }

    fetchNext = async () => {
        let fromBlockNumber = (this.state.fromBlockNumber > 9) ? (this.state.fromBlockNumber - 10) : this.state.fromBlockNumber;
        let toBlockNumber = (fromBlockNumber > 9) ? (fromBlockNumber - 9) : 0
        let blocksDetails = await this.getBlockDetails(fromBlockNumber, toBlockNumber)
        this.prepareBlocksTableMarkup(blocksDetails);
        this.setState({
            blocksDetails: blocksDetails,
            fromBlockNumber: fromBlockNumber,
            toBlockNumber: toBlockNumber
        })
    }

    fetchPrev = async () => {
        let fromBlockNumber = (this.state.blocksHeight > 9) ? (this.state.fromBlockNumber + 10) : this.state.blocksHeight - 1;
        let toBlockNumber = (fromBlockNumber > 9) ? (fromBlockNumber - 9) : 0
        let blocksDetails = await this.getBlockDetails(fromBlockNumber, toBlockNumber)
        this.prepareBlocksTableMarkup(blocksDetails);
        this.setState({
            blocksDetails: blocksDetails,
            fromBlockNumber: fromBlockNumber,
            toBlockNumber: toBlockNumber
        })
    }

    render() {
        return (
            <div style={{ display: 'flex', marginTop: '20px', fontFamily: 'Open Sans'}}>
                <div style={{ justifyContent: 'center', width: '100%', display: (this.state.viewBlockMarkup) ? 'inline-grid' : 'none' }}>
                    <div className="navigator" style={{ width: '1280px' }}>
                        <div style={{ float: 'left', paddingLeft: '15px' }}>
                            <span style={{ fontSize: '30px' }}>{this.state.blocksHeight}&nbsp;</span>
                            <span style={{ fontSize: '20px' }}>Blocks</span>
                        </div>
                        <div style={{ float: 'right', display: 'flex' }}>
                            <Tooltip title="Refresh" onClick={this.refreshBlockDetails}>
                                <div style={{ padding: '10px', color: '#ffffff' }}>
                                    <MdRefresh style={{ fontSize: '25px' }} />
                                </div>
                            </Tooltip>
                            <div style={{ borderLeft: '0.5pt solid black' }}></div>


                            <Tooltip title="Prev" onClick={this.fetchPrev} disabled={(this.state.blocksHeight == this.state.fromBlockNumber + 1)}>
                                <div style={{ padding: '10px', color: '#ffffff' }}>
                                    <MdKeyboardArrowLeft style={{ fontSize: '25px' }} />
                                </div>

                            </Tooltip>
                            <Tooltip title="Next" onClick={this.fetchNext} disabled={(this.state.toBlockNumber == 0)}>
                                <div style={{ padding: '10px', color: '#ffffff' }}>
                                    <MdKeyboardArrowRight style={{ fontSize: '25px' }} />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <table>
                        <tbody>
                            <tr className="borderBottom">
                                <th>Block Number</th>
                                <th>Timestamp</th>
                                <th>Data Hash</th>
                                <th>Number of Tx</th>
                                <th>Info</th>
                            </tr>
                            {/* {markup} */}
                            {this.state.blocksTableMarkup}
                        </tbody>
                    </table>
                </div>
                <div style={{ justifyContent: 'center', width: '100%', display: (this.state.viewTransactionMarkup) ? 'flex' : 'none' }}>
                    <div style={{ width: '800px', marginRight: '15px' }}>
                        <div className="navigator">
                            <div style={{ float: 'left', paddingLeft: '15px' }}>
                                <button type="button" style={{ padding: '5px', marginRight: '20px' }} onClick={() => { this.setState({ viewBlockMarkup: true, viewTransactionMarkup: false }) }}>Back</button>
                                {/* <div style={{ borderLeft: '0.5pt solid black' }}></div> */}

                                <span style={{ fontSize: '20px' }}>Block&nbsp;</span>
                                <span style={{ fontSize: '30px', paddingRight: '20px' }}>1</span>

                                {/* <div style={{ borderLeft: '0.5pt solid black' }}></div> */}

                                <span style={{ fontSize: '20px' }}>Transactions&nbsp;</span>
                                <span style={{ fontSize: '30px' }}>20</span>
                            </div>
                            <div style={{ float: 'right', display: 'flex' }}>                                
                                <div style={{ borderLeft: '0.5pt solid black' }}></div>


                                <Tooltip title="Prev" onClick={this.fetchPrev} disabled={(this.state.blocksHeight == this.state.fromBlockNumber + 1)}>
                                    <div style={{ padding: '10px', color: '#ffffff' }}>
                                        <MdKeyboardArrowLeft style={{ fontSize: '25px' }} />
                                    </div>

                                </Tooltip>
                                <Tooltip title="Next" onClick={this.fetchNext} disabled={(this.state.toBlockNumber == 0)}>
                                    <div style={{ padding: '10px', color: '#ffffff' }}>
                                        <MdKeyboardArrowRight style={{ fontSize: '25px' }} />
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                        <table style={{ width: '800px' }}>
                            <tbody>
                                <tr className="borderBottom">
                                    <th>Txn Number</th>
                                    <th>Txn Hash</th>
                                    <th>Info</th>
                                </tr>
                                {this.state.transactionsTableMarkup}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ width: '500px' }}>
                        <div className="navigator">
                            <div style={{ float: 'left', fontSize: '20px', padding: '15px' }}>Transaction Details</div>
                            {/* {this.state.trasactionDetailsMarkup} */}
                            <div className="transactionDetails">
                                {this.state.trasactionDetailsMarkup}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}