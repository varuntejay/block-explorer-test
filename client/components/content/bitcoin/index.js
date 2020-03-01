import React, { Component } from 'react';
import '../style.css'
import axios from 'axios';
import lib from './../../../lib/index';
import { Button, CircularProgress, Select, MenuItem } from '@material-ui/core';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdRefresh
} from "react-icons/md";
import {
    Tooltip
} from '@material-ui/core';
import ContentLoader from './../../contentloader';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default class Content extends Component {
    constructor() {
        super();
        this.state = {
            blocksHeight: 0,
            latestBlockOffset: 0,
            size: 10,
            blocksDetails: [],
            trasactionDetailsMarkup: "",
            viewBlockMarkup: true,
            viewTransactionMarkup: false,
            transactionsTableMarkup: "",
            fromTxnNumber: 0,
            toTxnNumber: 0,
            row: "",
            mainPageRows: 20
        }
        this.API_URL = publicRuntimeConfig.API_URL
        this.circularProgress = <CircularProgress style={{ fontSize: '20px' }} />
        this.tableContentLoaderMarkup = <tr><td colSpan="5"><ContentLoader placeholderCount={4} height='15px' /></td></tr>        
    }

    componentDidMount() {
        this.refreshBlockDetails();
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
        this.refreshBlockDetails();
    }


    refreshBlockDetails = async () => {
        try {
            this.setState({                
                blocksTableMarkup: this.tableContentLoaderMarkup
            })
            axios.post(`${this.API_URL}/bitcoin/getBlockCount`, {})
                .then((result) => {
                    let blocksHeight = result.data.blocksHeight;

                    let latestBlockOffset = this.state.latestBlockOffset;
                    let size = this.state.size;
                    let options = {
                        "blocksHeight": blocksHeight,
                        "latestBlockOffset": latestBlockOffset,
                        "size": size
                    }

                    axios.post(`${this.API_URL}/bitcoin/getBlocksWithPagination`, options).then((result) => {
                        let blocks = result.data.blocks;
                        let blocksMapTable = {};
                        for (var i in blocks) {
                            blocksMapTable[blocks[i].height] = {
                                "height": blocks[i].height,
                                "time": lib.formatDate(blocks[i].time),
                                "hash": blocks[i].hash,
                                "tx": blocks[i].tx
                            }
                        }
                        this.prepareBlocksTableMarkup(blocks);

                        this.setState({
                            blocksHeight: blocksHeight,
                            blocksMapTable: blocksMapTable,
                            latestBlockOffset: latestBlockOffset,
                            size: size
                        })
                    })
                })

        } catch (err) {
            alert(err)
        }
    }

    prepareTransactionsTableMarkup = (transactionDetails, blockNumber) => {
        let markup = []
        transactionDetails.forEach((txn, index) => {
            if (index == 0) {
                this.getTransactionDetail(0, blockNumber)
            }
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

    getTransactionDetail = (transactionIndex, blockNumber) => {

        let params = {
            blockNumber: blockNumber,
            transactionIndex: transactionIndex
        }
        axios.post(`${this.API_URL}/bitcoin/getTxnDetails`, params)
            .then((response) => {
                // console.log(response)
                let txn = response.data.txn;
                let totalOutput = 0;
                (txn.vout).forEach((out) => {
                    totalOutput += parseFloat(out.value)
                })
                // console.log(totalOutput)
                let markup =
                    <table className="transactionDetails">
                        <tbody>
                            <tr>
                                <td>Txn Index</td>
                                <td>{txn.txnIndex}</td>
                            </tr>
                            <tr>
                                <td>Timestamp</td>
                                <td>{this.state.blocksMapTable[this.state.blockNumber].time}</td>
                            </tr>
                            <tr>
                                <td>Confirmations</td>
                                <td>{txn.confirmations}</td>
                            </tr>
                            {/* <tr>
                                <td>Status</td>
                                <td>{txn.confirmations.length > 0 ? 'Confirmed': 'Pending'}</td>
                            </tr> */}
                            <tr>
                                <td>Total output (BTC)</td>
                                <td>{totalOutput}</td>
                            </tr>
                            <tr>
                                <td>Hash</td>
                                <td>{txn.hash}</td>
                            </tr>

                        </tbody>
                    </table >
                this.setState({ trasactionDetailsMarkup: markup })
            }).catch((error) => {
                console.error(error)
                alert('Failed to get transaction details')
            })

    }

    fetchTransactionDetails = (event) => {
        this.getTransactionDetail(event.target.value, this.state.blockNumber)
    }

    getTransactions = (event) => {
        // console.log(event.target.value);
        let blockNumber = event.target.value;
        let transactions = [];
        let txnCount = this.state.blocksMapTable[blockNumber].tx.length;
        let fromTxnNumber = 0;
        let toTxnNumber = (txnCount > 9) ? 9 : txnCount - 1;

        for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
            transactions.push({
                "txnNumber": txnNumber,
                "hash": this.state.blocksMapTable[blockNumber].tx[txnNumber]
            })
        }
        this.setState({ viewBlockMarkup: false, viewTransactionMarkup: true, blockNumber: event.target.value, txnCount: txnCount, fromTxnNumber: fromTxnNumber, toTxnNumber: toTxnNumber })
        this.prepareTransactionsTableMarkup(transactions, blockNumber)
    }

    prepareBlocksTableMarkup(blocksDetails) {

        let markup = []
        blocksDetails.forEach((block) => {
            markup.push(
                <tr className="dataBorderBottom">
                    <td>{block.height}</td>
                    <td>{lib.formatDate(block.time)}</td>
                    <td style={{ fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>{block.hash}</td>
                    <td>{block.tx.length}</td>
                    <td>
                        <button type="button" style={{ padding: '5px' }} value={JSON.stringify(block.height)}
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
                axios.post(`${this.API_URL}/getBlocks/height`)
                    .then((response) => {
                        // console.log(response)
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

    getBlockDetails = (latestBlockOffset, size) => {
        try {
            let params = {
                latestBlockOffset: latestBlockOffset,
                size: size,
                blocksHeight: this.state.blocksHeight
            }
            axios.post(`${this.API_URL}/bitcoin/getBlocksWithPagination`, params)
                .then((response) => {

                    // console.log(response)
                    if (response.data.status) {
                        let blocks = response.data.blocks;

                        let blocksMapTable = {};
                        for (var i in blocks) {
                            blocksMapTable[blocks[i].height] = {
                                "number": blocks[i].height,
                                "timestamp": lib.formatDate(blocks[i].time),
                                "hash": blocks[i].hash,
                                "transactions": blocks[i].tx
                            }
                        }
                        this.prepareBlocksTableMarkup(blocks);

                        this.setState({
                            blocksMapTable: blocksMapTable,
                            latestBlockOffset: latestBlockOffset,
                            size: size
                        })
                    } else {
                        throw new Error('Failed to fetch transactions')
                    }
                })
        } catch (err) {
            throw new Error('Failed to fetch transactions')
        }
    }


    fetchNext = async () => {
        this.setState({         
            blocksTableMarkup: this.tableContentLoaderMarkup
        })
        let latestBlockOffset = this.state.latestBlockOffset + this.state.size;
        let size = this.state.size;
        this.getBlockDetails(latestBlockOffset, size)
    }

    fetchPrev = async () => {
        this.setState({         
            blocksTableMarkup: this.tableContentLoaderMarkup
        })
        let latestBlockOffset = this.state.latestBlockOffset - this.state.size;
        let size = this.state.size;
        this.getBlockDetails(latestBlockOffset, size)
    }

    fetchNextTxn = async () => {
        // txnCount = 23;
        // fromTxnNumber = 0;
        // toTxnNumber = 9;
        
        let fromTxnNumber = this.state.fromTxnNumber + 10;
        let toTxnNumber = (fromTxnNumber + 9 > this.state.txnCount) ? this.state.txnCount - 1 : fromTxnNumber + 9;
        let transactions = [];

        for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
            if (txnNumber == fromTxnNumber) {
                this.getTransactionDetail(fromTxnNumber, this.state.blockNumber)
            }
            transactions.push({
                "txnNumber": txnNumber,
                "hash": this.state.blocksMapTable[this.state.blockNumber].tx[txnNumber]
            })
        }

        this.prepareTransactionsTableMarkup(transactions, this.state.blockNumber);
        this.setState({
            fromTxnNumber: fromTxnNumber,
            toTxnNumber: toTxnNumber
        })
    }

    fetchPrevTxn = async () => {        
        // txnCount = 205;
        // fromTxnNumber = 200;
        // toTxnNumber = 204;

        let fromTxnNumber = this.state.fromTxnNumber - 10
        let toTxnNumber = fromTxnNumber + 9
        let transactions = [];

        for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
            if (txnNumber == fromTxnNumber) {
                this.getTransactionDetail(fromTxnNumber, this.state.blockNumber)
            }
            transactions.push({
                "txnNumber": txnNumber,
                "hash": this.state.blocksMapTable[this.state.blockNumber].tx[txnNumber]
            })
        }
        this.prepareTransactionsTableMarkup(transactions, this.state.blockNumber);
        this.setState({
            fromTxnNumber: fromTxnNumber,
            toTxnNumber: toTxnNumber
        })
    }

    render() {
        // console.log((this.state.latestBlockOffset + this.state.size >= this.state.blocksHeight))
        // console.log((this.state.latestBlockOffset == 0))
        // console.log(this.state.txnCount)
        // console.log(this.state.fromTxnNumber)
        // console.log(this.state.toTxnNumber)
        return (
            <div style={{ display: 'flex', marginTop: '20px', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                <div style={{ justifyContent: 'center', width: '100%', display: (this.state.viewBlockMarkup) ? 'inline-grid' : 'none' }}>
                    <div className="navigator" style={{ width: '1280px' }}>
                        <div style={{ float: 'left', paddingLeft: '15px' }}>
                            {/* <span style={{ fontSize: '30px'}}>ETHEREUM</span> */}
                            {/* <div style={{ borderRight: '0.5pt solid black' }}></div> */}

                            <span style={{ fontSize: '30px' }}>{this.state.blocksHeight}&nbsp;</span>
                            <span style={{ fontSize: '20px' }}>Blocks</span>
                        </div>
                        <div style={{ float: 'right', display: 'flex' }}>
                            <Tooltip title="Refresh Blocks" style={{ padding: '-10px' }}>
                                <Button style={{ color: '#ffffff', padding: '10px !important' }} onClick={this.refreshBlockDetails}>
                                    <MdRefresh style={{ fontSize: '30px' }} />
                                </Button>
                            </Tooltip>

                            <div style={{ borderLeft: '0.5pt solid black' }}></div>

                            <div style={{marginTop: '12px'}}>
                                <span style={{ fontSize: '20px', color:'#ffffff', marginRight: '10px'}}>Rows per page</span>
                                <Select
                                    value={this.state.size}
                                    name="size"
                                    onChange={this.handleChange}
                                    style={{color: '#000000', backgroundColor: '#ffffff', paddingLeft: '10px'}}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                    <MenuItem value={40}>40</MenuItem>
                                </Select>
                            </div>
                            
                            <div style={{ borderLeft: '0.5pt solid black' }}></div>


                            <Tooltip title="Prev" style={{ padding: '-10px' }}>
                                <Button style={{ color: '#ffffff', padding: '10px !important' }} onClick={this.fetchPrev} disabled={(this.state.latestBlockOffset == 0)}>
                                    <MdKeyboardArrowLeft style={{ fontSize: '40px' }} />
                                </Button>
                            </Tooltip>

                            <Tooltip title="Next" style={{ padding: '-10px' }}>
                                <Button style={{ color: '#ffffff', padding: '10px !important' }} onClick={this.fetchNext} disabled={(this.state.latestBlockOffset + this.state.size >= this.state.blocksHeight)}>
                                    <MdKeyboardArrowRight style={{ fontSize: '40px' }} />
                                </Button>
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
                        <div className="navigator" style={{ marginBottom: '0px' }}>
                            <div style={{ float: 'left', paddingLeft: '15px' }}>
                                <button type="button" style={{ padding: '5px', marginRight: '20px' }} onClick={() => { this.setState({ viewBlockMarkup: true, viewTransactionMarkup: false }) }}>Back</button>
                                {/* <div style={{ borderLeft: '0.5pt solid black' }}></div> */}

                                <span style={{ fontSize: '20px' }}>Block&nbsp;</span>
                                <span style={{ fontSize: '30px', paddingRight: '20px' }}>{this.state.blockNumber}</span>

                                {/* <div style={{ borderLeft: '0.5pt solid black' }}></div> */}

                                <span style={{ fontSize: '20px' }}>Transactions&nbsp;</span>
                                <span style={{ fontSize: '30px' }}>{this.state.txnCount}</span>
                            </div>
                            <div style={{ float: 'right', display: 'flex' }}>
                                <div style={{ borderLeft: '0.5pt solid black' }}></div>


                                <Tooltip title="Prev" style={{ padding: '-10px' }}>
                                    <Button style={{ color: '#ffffff', padding: '10px !important' }} onClick={this.fetchPrevTxn} disabled={(this.state.fromTxnNumber == 0)}>
                                        <MdKeyboardArrowLeft style={{ fontSize: '40px' }} />
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Next" style={{ padding: '-10px' }}>
                                    <Button style={{ color: '#ffffff', padding: '10px !important' }} onClick={this.fetchNextTxn} disabled={(this.state.toTxnNumber + 1) == this.state.txnCount}>
                                        <MdKeyboardArrowRight style={{ fontSize: '40px' }} />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                        <table style={{ width: '800px' }}>
                            <tbody>
                                <tr className="borderBottom">
                                    <th>Txn Index</th>
                                    <th>Txn Hash</th>
                                    <th>Info</th>
                                </tr>
                                {this.state.transactionsTableMarkup}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ width: '600px' }}>
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