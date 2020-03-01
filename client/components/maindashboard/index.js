import React, { Component } from 'react';
import './style.css'
import axios from 'axios';
import {
    FormControl,
    FormGroup,
    InputLabel,
    TextField,
    Select,
    MenuItem,
    CircularProgress,
    Tooltip,
    Button,
    Checkbox,
    FormControlLabel
} from '@material-ui/core';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
} from "react-icons/md";

import {
    FaSortAmountDown,
    FaSortAmountUp
} from "react-icons/fa"
import lodash from 'lodash'
import lib from './../../lib/index'
import ContentLoader from './../contentloader';


import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default class MainDashboard extends Component {
    constructor() {
        super();
        this.state = {
            txnsMarkup: "",
            trasactionDetailsMarkup: "",
            coinType: "",
            coins: 0.1,
            errorFields: [],
            statsOn: 'daily',
            ethTimestampDescSort: false,
            ethValueDescSort: false,
            btcTimestampDescSort: false,
            btcValueDescSort: false,
            fromTxnNumberBtc: 0,
            toTxnNumberBtc: 0,
        }
        this.API_URL = publicRuntimeConfig.API_URL
        this.circularProgress = <CircularProgress style={{ fontSize: '20px' }} />
        this.noDataMarkup = <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '30px', color: '#ffffff' }}>No transactions found</div>
        this.tableContentLoaderMarkup = <tr><td colSpan="5"><ContentLoader placeholderCount={4} height='15px' /></td></tr>
        this.cellContentLoaderMarkup = <ContentLoader placeholderCount={1} height='10px' marginLeft='30%' />
    }

    componentDidMount() {            
        this.getStats('daily')
        axios.post(`${this.API_URL}/price/get`)
            .then((response) => {
                this.setState({
                    ethPrice: response.data.eth.price,
                    btcPrice: response.data.btc.price
                })
            })
    }

    setContentLoader() {
        this.setState({
            btcTxnsMarkup: this.tableContentLoaderMarkup,
            ethTxnsMarkup: this.tableContentLoaderMarkup,
            ethTotalTxns: this.cellContentLoaderMarkup,
            ethAvgTxns: this.cellContentLoaderMarkup,
            ethAvgBlocks: this.cellContentLoaderMarkup,
            bitcoinTotalTxns: this.cellContentLoaderMarkup,
            bitcoinAvgTxns: this.cellContentLoaderMarkup,
            bitcoinAvgBlocks: this.cellContentLoaderMarkup
        })
    }

    getBtcTxns(timeUnit) {
        let params = {
            "timeUnit": timeUnit
        }
        axios.post(`${this.API_URL}/bitcoin/getLatestHighlights`, params)
            .then((response) => {
                let txnCountBtc = response.data.length;
                let fromTxnNumberBtc = 0;
                let toTxnNumberBtc = (txnCountBtc > 9) ? 9 : 9 - txnCountBtc;
                this.setState({ btcTxns: response.data, fromTxnNumberBtc: fromTxnNumberBtc, toTxnNumberBtc: toTxnNumberBtc, txnCountBtc: txnCountBtc })
                this.prepareBtcTxnsMarkup((response.data).slice(fromTxnNumberBtc, toTxnNumberBtc))
            })
    }

    getEthTxns(timeUnit) {
        let params = {
            "timeUnit": timeUnit
        }
        axios.post(`${this.API_URL}/eth/getLatestHighlights`, params)
            .then((response) => {
                // console.log(response)
                let txnCountEth = response.data.length;
                let fromTxnNumberEth = 0;
                let toTxnNumberEth = (txnCountEth > 9) ? 9 : 9 - txnCountEth;
                this.setState({ ethTxns: response.data, fromTxnNumberEth: fromTxnNumberEth, toTxnNumberEth: toTxnNumberEth, txnCountEth: txnCountEth })
                this.prepareEthTxnsMarkup((response.data).slice(fromTxnNumberEth, toTxnNumberEth))
            })
    }

    prepareBtcTxnsMarkup = (txns) => {
        let markup = [];
        txns.forEach((txn) => {
            markup.push(
                <tr style={{ fontSize: '14px' }}>
                    <td>{txn.height}</td>
                    <td>{txn.txnIndex}</td>
                    <td>{lib.formatDate(txn.time)}</td>
                    <td>{txn.value}</td>
                    <td><button onClick={() => this.getBtcTransactionDetail(txn.txnIndex, txn.height)}>Fetch</button></td>
                </tr>
            )
        })
        this.setState({ btcTxnsMarkup: markup })
    }

    prepareEthTxnsMarkup = (txns) => {
        let markup = [];
        txns.forEach((txn) => {
            markup.push(
                <tr style={{ fontSize: '14px' }}>
                    <td>{txn.blockNumber}</td>
                    <td>{txn.transactionIndex}</td>
                    <td>{lib.formatDate(txn.timestamp)}</td>
                    <td>{txn.value}</td>
                    <td><button onClick={() => this.getEthTransactionDetail(txn.transactionIndex, txn.blockNumber)}>Fetch</button></td>
                </tr>
            )
        })
        this.setState({ ethTxnsMarkup: markup })
    }

    getBtcTransactionDetail = (transactionIndex, blockNumber) => {

        let params = {
            blockNumber: blockNumber,
            transactionIndex: transactionIndex
        }
        axios.post(`${this.API_URL}/bitcoin/getTxnDetails`, params)
            .then((response) => {
                let txn = response.data.txn;
                let markup =
                    <table style={{ width: '740px', maxWidth: '740px' }}>
                        <tbody>
                            <tr style={{ fontSize: '16px' }}>
                                <td>Txn Hash</td>
                                <td>{txn.hash}</td>
                            </tr>
                            <tr>
                                <td>Block Number</td>
                                <td>{blockNumber}</td>
                            </tr>
                            <tr>
                                <td>Txn Index</td>
                                <td>{txn.txnIndex}</td>
                            </tr>
                            <tr>
                                <td>Timestamp</td>
                                <td>{lib.formatDate(txn.time)}</td>
                            </tr>
                            <tr>
                                <td>Confirmations</td>
                                <td>{txn.confirmations}</td>
                            </tr>
                            <tr>
                                <td>Total output (BTC)</td>
                                <td>{txn.value}</td>
                            </tr>


                        </tbody>
                    </table >
                this.setState({ btxTxnDetailsMarkup: markup, fetchBtcTxnDetails: true })
            }).catch((error) => {
                console.error(error)
                alert('Failed to get transaction details')
            })

    }

    getEthTransactionDetail = (transactionIndex, blockNumber) => {

        let params = {
            blockNumber: blockNumber,
            transactionIndex: transactionIndex
        }
        axios.post(`${this.API_URL}/eth/getTxnDetails`, params)
            .then((response) => {
                // console.log(response)
                let txn = response.data.txn;
                let markup =
                    <table className="transactionDetails" style={{ width: '740px' }}>
                        <tbody>
                            <tr style={{ fontSize: '16px' }}>
                                <td>Txn Hash</td>
                                <td>{txn.hash}</td>
                            </tr>
                            <tr>
                                <td>Block Number</td>
                                <td>{blockNumber}</td>
                            </tr>
                            <tr>
                                <td>Txn Index</td>
                                <td>{txn.transactionIndex}</td>
                            </tr>
                            <tr>
                                <td>Timestamp</td>
                                <td>{lib.formatDate(txn.timestamp)}</td>
                            </tr>
                            <tr>
                                <td>From</td>
                                <td>{txn.from}</td>
                            </tr>
                            <tr>
                                <td>To</td>
                                <td>{txn.to}</td>
                            </tr>
                            <tr>
                                <td>Value (Ether)</td>
                                <td>{txn.value}</td>
                            </tr>
                            <tr>
                                <td>Value (WEI)</td>
                                <td>{txn.value_wei}</td>
                            </tr>
                            <tr>
                                <td>Gas (WEI)</td>
                                <td>{txn.gas_wei}</td>
                            </tr>
                            <tr>
                                <td>Gas Prise (WEI)</td>
                                <td>{txn.gasPrice_wei}</td>
                            </tr>
                        </tbody>
                    </table >
                this.setState({ ethTxnDetailsMarkup: markup, fetchEthTxnDetails: true })
            }).catch((error) => {
                console.error(error)
                alert('Failed to get transaction details')
            })

    }

    handleSort = (sortField) => {
        // console.log(event)
        this.setState({ [sortField]: !this.state[sortField] })
        if (sortField === 'btcValueDescSort') {
            let sortedTxns = lodash.orderBy(this.state.btcTxns, ['value'], [(!this.state[sortField]) ? 'asc' : 'desc']);
            let fromTxnNumberBtc = 0;
            let toTxnNumberBtc = (sortedTxns.length > 9) ? 9 : 9 - sortedTxns.length;
            this.setState({ btcTxns: sortedTxns, fromTxnNumberBtc: fromTxnNumberBtc, toTxnNumberBtc: toTxnNumberBtc })
            this.prepareBtcTxnsMarkup((sortedTxns).slice(fromTxnNumberBtc, toTxnNumberBtc))
        } else if (sortField === 'btcTimestampDescSort') {
            let sortedTxns = lodash.orderBy(this.state.btcTxns, ['time'], [(!this.state[sortField]) ? 'asc' : 'desc']);
            let fromTxnNumberBtc = 0;
            let toTxnNumberBtc = (sortedTxns.length > 9) ? 9 : 9 - sortedTxns.length;
            this.setState({ btcTxns: sortedTxns, fromTxnNumberBtc: fromTxnNumberBtc, toTxnNumberBtc: toTxnNumberBtc })
            this.prepareBtcTxnsMarkup((sortedTxns).slice(fromTxnNumberBtc, toTxnNumberBtc))
        } else if (sortField === 'ethValueDescSort') {
            let sortedTxns = lodash.orderBy(this.state.ethTxns, ['value'], [(!this.state[sortField]) ? 'asc' : 'desc']);
            let fromTxnNumberEth = 0;
            let toTxnNumberEth = (sortedTxns.length > 9) ? 9 : 9 - sortedTxns.length;
            this.setState({ ethTxns: sortedTxns, fromTxnNumberEth: fromTxnNumberEth, toTxnNumberEth: toTxnNumberEth })
            this.prepareEthTxnsMarkup((sortedTxns).slice(fromTxnNumberEth, toTxnNumberEth))

        } else if (sortField === 'ethTimestampDescSort') {

            let sortedTxns = lodash.orderBy(this.state.ethTxns, ['timestamp'], [(!this.state[sortField]) ? 'asc' : 'desc']);
            let fromTxnNumberEth = 0;
            let toTxnNumberEth = (sortedTxns.length > 9) ? 9 : 9 - sortedTxns.length;
            this.setState({ ethTxns: sortedTxns, fromTxnNumberEth: fromTxnNumberEth, toTxnNumberEth: toTxnNumberEth })
            this.prepareEthTxnsMarkup((sortedTxns).slice(fromTxnNumberEth, toTxnNumberEth))
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleCheckbox = (event) => {
        this.setState({ [event.target.name]: event.target.value })
        this.getStats(event.target.value)
    }

    getStats = (period) => {
        this.setContentLoader();
        let timeUnit = 1;
        if (period === 'weekly') timeUnit = 7;
        if (period === 'monthly') timeUnit = 20;

        let params = {
            "timeUnit": timeUnit
        }
        axios.post(`${this.API_URL}/eth/getStats`, params)
            .then((response) => {
                let data = response.data;
                this.setState({
                    ethTotalTxns: data.totalNumberOfTransactions,
                    ethAvgTxns: data.avgNoTransactions,
                    ethAvgBlocks: data.avgNoOfBlocks
                })
            })

        axios.post(`${this.API_URL}/bitcoin/getStats`, params)
            .then((response) => {
                let data = response.data;
                this.setState({
                    bitcoinTotalTxns: data.totalNumberOfTransactions,
                    bitcoinAvgTxns: data.avgNoTransactions,
                    bitcoinAvgBlocks: data.avgNoOfBlocks
                })
            })
        this.getBtcTxns(timeUnit)
        this.getEthTxns(timeUnit)
    }

    viewDetails = () => {
        let errorFields = [];
        if (this.state.coinType === "") {
            errorFields.push('coinType')
        }
        if (this.state.coins === "") {
            errorFields.push('coins')
        }
        if (errorFields.length > 0) {
            this.setState({ errorFields: errorFields })
        } else {
            let params = {
                "coins": this.state.coins
            }
            if (this.state.coinType === 'eth') {
                axios.post(`${this.API_URL}/eth/filterTransactions`, params)
                    .then((response) => {
                        let txns = response.data.txns;
                        let txnCount = txns.length;
                        if (txnCount > 0) {
                            let fromTxnNumber = 0;
                            let toTxnNumber = (txnCount > 9) ? 9 : 9 - txnCount;

                            let transactions = [];

                            for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
                                transactions.push(txns[txnNumber])
                            }
                            this.setState({ txnCount: txnCount, fromTxnNumber: fromTxnNumber, toTxnNumber: toTxnNumber, txns: txns })
                            this.prepareTableMarkup(transactions)
                        } else {
                            this.setState({ txnsMarkup: this.noDataMarkup, trasactionDetailsMarkup: '' })
                        }
                    })
            } else {
                axios.post(`${this.API_URL}/bitcoin/filterTransactions`, params)
                    .then((response) => {
                        let txns = response.data.txns;

                        let txnCount = txns.length;
                        if (txnCount > 0) {

                            let fromTxnNumber = 0;
                            let toTxnNumber = (txnCount > 9) ? 9 : 9 - txnCount;

                            let transactions = [];

                            for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
                                transactions.push(txns[txnNumber])
                            }
                            this.setState({ txnCount: txnCount, fromTxnNumber: fromTxnNumber, toTxnNumber: toTxnNumber, txns: txns })
                            this.prepareTableMarkup(transactions)
                        } else {
                            this.setState({ txnsMarkup: this.noDataMarkup, trasactionDetailsMarkup: '' })
                        }
                    })
            }
        }
    }

    prepareTableMarkup = (txns) => {
        let rowsMarkup = []
        txns.forEach((txn, index) => {
            if (this.state.coinType === 'eth' && txn !== undefined) {
                if (index == 0) {
                    this.getTransactionDetail(txn.transactionIndex, txn.blockNumber)
                }

                rowsMarkup.push(
                    <tr className="dataBorderBottom">
                        <td>{txn.blockNumber}</td>
                        <td>{txn.hash}</td>
                        <td>{txn.value}</td>
                        <td>
                            <button type="button" style={{ padding: '5px' }} value={JSON.stringify({ "transactionIndex": txn.transactionIndex, "blockNumber": txn.blockNumber })}
                                onClick={this.fetchTransactionDetails}>Fetch</button>
                        </td>
                    </tr>
                )
            } else if (txn !== undefined) {
                if (index == 0) {
                    this.getTransactionDetail(txn.txnIndex, txn.height)
                }

                rowsMarkup.push(
                    <tr className="dataBorderBottom">
                        <td>{txn.height}</td>
                        <td>{txn.hash}</td>
                        <td>{txn.value}</td>
                        <td>
                            <button type="button" style={{ padding: '5px' }} value={JSON.stringify({ "transactionIndex": txn.txnIndex, "blockNumber": txn.height })}
                                onClick={this.fetchTransactionDetails}>Fetch</button>
                        </td>
                    </tr>
                )
            }
        });

        let markup = <table style={{ width: '900px' }}>
            <tbody>
                <tr className="borderBottom">
                    <th>Block Number</th>
                    <th>Txn Hash</th>
                    <th>Value ({this.state.coinType === "eth" ? 'Ether' : 'BTC '})</th>
                    <th>Transaction details</th>
                </tr>
                {rowsMarkup}
            </tbody>
        </table>

        this.setState({ txnsMarkup: markup })
    }

    getTransactionDetail = (transactionIndex, blockNumber) => {

        let params = {
            blockNumber: blockNumber,
            transactionIndex: transactionIndex
        }
        // console.log(params)
        if (this.state.coinType === 'eth') {
            axios.post(`${this.API_URL}/eth/getTxnDetails`, params)
                .then((response) => {
                    // console.log(response)
                    let txn = response.data.txn;
                    let markup =
                        <table className="transactionDetails" style={{ width: '600px', marginLeft: '15px' }}>
                            <tbody>
                                <tr>
                                    <td>Txn Index</td>
                                    <td>{txn.transactionIndex}</td>
                                </tr>
                                <tr>
                                    <td>From</td>
                                    <td>{txn.from}</td>
                                </tr>
                                <tr>
                                    <td>To</td>
                                    <td>{txn.to}</td>
                                </tr>
                                <tr>
                                    <td>Value (Ether)</td>
                                    <td>{txn.value}</td>
                                </tr>
                                <tr>
                                    <td>Value (WEI)</td>
                                    <td>{txn.value_wei}</td>
                                </tr>
                                <tr>
                                    <td>Gas (WEI)</td>
                                    <td>{txn.gas_wei}</td>
                                </tr>
                                <tr>
                                    <td>Gas Prise (WEI)</td>
                                    <td>{txn.gasPrice_wei}</td>
                                </tr>
                            </tbody>
                        </table >
                    this.setState({ trasactionDetailsMarkup: markup })
                }).catch((error) => {
                    console.error(error)
                    alert('Failed to get transaction details')
                })
        } else {
            axios.post(`${this.API_URL}/bitcoin/getTxnDetails`, params)
                .then((response) => {
                    // console.log(response)
                    let txn = response.data.txn;
                    let markup =
                        <table className="transactionDetails">
                            <tbody>
                                <tr>
                                    <td>Txn Index</td>
                                    <td>{txn.txnIndex}</td>
                                </tr>
                                <tr>
                                    <td>Confirmations</td>
                                    <td>{txn.confirmations}</td>
                                </tr>
                                <tr>
                                    <td>Value (BTC)</td>
                                    <td>{txn.value}</td>
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
    }

    fetchTransactionDetails = (event) => {
        // console.log(event.target.value)
        this.getTransactionDetail(JSON.parse(event.target.value).transactionIndex, JSON.parse(event.target.value).blockNumber)
    }

    fetchNextBtc = async () => {
        let fromTxnNumberBtc = this.state.fromTxnNumberBtc + 10;
        let toTxnNumberBtc = (fromTxnNumberBtc + 9 > this.state.txnCountBtc) ? this.state.txnCountBtc - 1 : fromTxnNumberBtc + 9;
        let transactions = [];

        for (let txnNumber = fromTxnNumberBtc; txnNumber <= toTxnNumberBtc; txnNumber++) {
            transactions.push(this.state.btcTxns[txnNumber])
        }
        this.prepareBtcTxnsMarkup(transactions);
        this.setState({
            fromTxnNumberBtc: fromTxnNumberBtc,
            toTxnNumberBtc: toTxnNumberBtc
        })
    }

    fetchPrevBtc = async () => {

        let fromTxnNumberBtc = this.state.fromTxnNumberBtc - 10
        let toTxnNumberBtc = fromTxnNumberBtc + 9
        let transactions = [];

        for (let txnNumber = fromTxnNumberBtc; txnNumber <= toTxnNumberBtc; txnNumber++) {
            transactions.push(this.state.btcTxns[txnNumber])
        }
        this.prepareBtcTxnsMarkup(transactions);
        this.setState({
            fromTxnNumberBtc: fromTxnNumberBtc,
            toTxnNumberBtc: toTxnNumberBtc
        })
    }

    fetchNextEth = async () => {

        let fromTxnNumberEth = this.state.fromTxnNumberEth + 10;
        let toTxnNumberEth = (fromTxnNumberEth + 9 > this.state.txnCountEth) ? this.state.txnCountEth - 1 : fromTxnNumberEth + 9;
        let transactions = [];

        for (let txnNumber = fromTxnNumberEth; txnNumber <= toTxnNumberEth; txnNumber++) {
            transactions.push(this.state.ethTxns[txnNumber])
        }
        this.prepareEthTxnsMarkup(transactions);
        this.setState({
            fromTxnNumberEth: fromTxnNumberEth,
            toTxnNumberEth: toTxnNumberEth
        })
    }

    fetchPrevEth = async () => {

        let fromTxnNumberEth = this.state.fromTxnNumberEth - 10
        let toTxnNumberEth = fromTxnNumberEth + 9
        let transactions = [];

        for (let txnNumber = fromTxnNumberEth; txnNumber <= toTxnNumberEth; txnNumber++) {
            transactions.push(this.state.ethTxns[txnNumber])
        }
        this.prepareEthTxnsMarkup(transactions);
        this.setState({
            fromTxnNumberEth: fromTxnNumberEth,
            toTxnNumberEth: toTxnNumberEth
        })
    }

    render() {
        return (
            <div style={{ display: 'flex', marginTop: '20px', marginBottom: '20px', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                <div style={{ justifyContent: 'center', width: '100%', display: 'inline-grid' }}>
                    <div className="navigator" style={{ width: '1500px', paddingBottom: '16px', height: '30px' }}>
                        <div style={{ float: 'left', paddingLeft: '15px' }}>
                            <span style={{ fontSize: '30px' }}>Dashboard</span>
                        </div>
                    </div>

                    <div style={{ display: 'inline !important', color: '#ffffff' }}>
                        <FormGroup style={{ display: 'inline', color: '#ffffff', float: 'left' }}>
                            <FormControlLabel
                                label="Daily"
                                labelPlacement="start"
                                control={
                                    <Checkbox
                                        checked={(this.state.statsOn === 'daily')}
                                        value="daily"
                                        name="statsOn"
                                        style={{ color: '#ffffff' }}
                                        onChange={this.handleCheckbox}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Weekly"
                                labelPlacement="start"
                                control={
                                    <Checkbox
                                        checked={(this.state.statsOn === 'weekly')}
                                        value="weekly"
                                        name="statsOn"
                                        style={{ color: '#ffffff' }}
                                        onChange={this.handleCheckbox}
                                    />
                                }
                            />
                            <FormControlLabel
                                label="Monthly"
                                labelPlacement="start"
                                control={
                                    <Checkbox
                                        checked={(this.state.statsOn === 'monthly')}
                                        value="monthly"
                                        name="statsOn"
                                        style={{ color: '#ffffff' }}
                                        onChange={this.handleCheckbox}
                                    />
                                }
                            />
                        </FormGroup>
                        <div style={{ float: 'right', fontSize: '20px' }}>
                            <span style={{ paddingRight: '20px' }}>Bitcoin&nbsp;${this.state.btcPrice}</span>
                            <span style={{ marginRight: '20px' }}>Ethereum&nbsp;${this.state.ethPrice}</span>
                        </div>
                    </div>
                    <table style={{ width: '1500px', marginBottom: '20px' }}>
                        <tbody>
                            <tr>
                                <th>Crypto type</th>
                                <th>Txns Volume</th>
                                <th>Avg NO of Txns</th>
                                <th>Avg NO of Blocks</th>
                                <th>Rewards</th>
                            </tr>
                            <tr>
                                <td>Bitcoin</td>
                                <td>{this.state.bitcoinTotalTxns}</td>
                                <td>{this.state.bitcoinAvgTxns}</td>
                                <td>{this.state.bitcoinAvgBlocks}</td>
                                <td>12.5* (BTC)</td>
                            </tr>
                            <tr>
                                <td>Ethereum</td>
                                <td>{this.state.ethTotalTxns}</td>
                                <td>{this.state.ethAvgTxns}</td>
                                <td>{this.state.ethAvgBlocks}</td>
                                <td>2* (Ether)</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{ display: 'flex' }}>
                        <div>

                            <div style={{ backgroundColor: "#343d4682", marginTop: '20px', marginBottom: '10px', width: '740px', display: 'flow-root', marginRight: '20px' }}>
                                <span style={{ float: 'left', color: '#ffffff', fontSize: '20px', padding: '15px' }}>
                                    Bitcoin
                            </span>
                                {(!this.state.fetchBtcTxnDetails) ?
                                    <span>
                                        <Tooltip title="Next" style={{ padding: '-10px' }}>
                                            <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchNextBtc} disabled={(this.state.toTxnNumberBtc + 1) == this.state.txnCountBtc}>
                                                <MdKeyboardArrowRight style={{ fontSize: '40px' }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Prev" style={{ padding: '-10px' }}>
                                            <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchPrevBtc} disabled={(this.state.fromTxnNumberBtc == 0)}>
                                                <MdKeyboardArrowLeft style={{ fontSize: '40px' }} />
                                            </Button>
                                        </Tooltip>
                                    </span>
                                    : <span style={{ float: 'right', margin: '10px' }}><button style={{ padding: '10px' }} onClick={() => { this.setState({ fetchBtcTxnDetails: false }) }}>Back</button> </span>
                                }
                            </div>
                            {(!this.state.fetchBtcTxnDetails) ?
                                <table style={{ width: '740px' }}>
                                    <tr style={{ fontSize: '16px' }}>
                                        <th>Block</th>
                                        <th>Txn Index</th>
                                        <th>
                                            <span>Date & Time</span>
                                            <span>
                                                {(this.state.btcTimestampDescSort)
                                                    ? <Button onClick={() => this.handleSort('btcTimestampDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountDown /></Button>
                                                    : <Button onClick={() => this.handleSort('btcTimestampDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountUp /> </Button>
                                                }
                                            </span>
                                        </th>
                                        <th>
                                            <span>Value</span>
                                            <span>
                                                {(this.state.btcValueDescSort)
                                                    ? <Button onClick={() => this.handleSort('btcValueDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountDown /></Button>
                                                    : <Button onClick={() => this.handleSort('btcValueDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountUp /> </Button>
                                                }
                                            </span>
                                        </th>
                                        <th>Fetch</th>
                                    </tr>
                                    {this.state.btcTxnsMarkup}
                                </table>
                                : this.state.btxTxnDetailsMarkup
                            }
                        </div>
                        <div>
                            <div style={{ backgroundColor: "#343d4682", marginTop: '20px', marginBottom: '10px', width: '740px', display: 'flow-root' }}>
                                <span style={{ float: 'left', color: '#ffffff', fontSize: '20px', padding: '15px' }}>
                                    Ethereum
                                </span>
                                {(!this.state.fetchEthTxnDetails) ?
                                    <span>
                                        <Tooltip title="Next" style={{ padding: '-10px' }}>
                                            <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchNextEth} disabled={(this.state.toTxnNumberEth + 1) == this.state.txnCountEth}>
                                                <MdKeyboardArrowRight style={{ fontSize: '40px' }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Prev" style={{ padding: '-10px' }}>
                                            <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchPrevEth} disabled={(this.state.fromTxnNumberEth == 0)}>
                                                <MdKeyboardArrowLeft style={{ fontSize: '40px' }} />
                                            </Button>
                                        </Tooltip>

                                    </span>
                                    : <span style={{ float: 'right', margin: '10px' }}><button style={{ padding: '10px' }} onClick={() => { this.setState({ fetchEthTxnDetails: false }) }}>Back</button> </span>
                                }
                            </div>
                            {(!this.state.fetchEthTxnDetails) ?

                                <table style={{ width: '740px' }}>
                                    <tr style={{ fontSize: '16px' }}>
                                        <th>Block</th>
                                        <th>Txn index</th>
                                        <th>
                                            <span>Date & Time</span>
                                            <span>
                                                {(this.state.ethTimestampDescSort)
                                                    ? <Button onClick={() => this.handleSort('ethTimestampDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountDown /></Button>
                                                    : <Button onClick={() => this.handleSort('ethTimestampDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountUp /> </Button>
                                                }
                                            </span>
                                        </th>
                                        <th>
                                            <span>Value</span>
                                            <span>
                                                {(this.state.ethValueDescSort)
                                                    ? <Button onClick={() => this.handleSort('ethValueDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountDown /></Button>
                                                    : <Button onClick={() => this.handleSort('ethValueDescSort')} style={{ color: '#ffffff', fontSize: '16px' }}><FaSortAmountUp /> </Button>
                                                }
                                            </span>
                                        </th>
                                        <th>Fetch</th>
                                    </tr>
                                    {this.state.ethTxnsMarkup}
                                </table>
                                : this.state.ethTxnDetailsMarkup
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}