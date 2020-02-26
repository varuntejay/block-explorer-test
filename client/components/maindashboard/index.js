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
            statsOn: 'daily'
        }
        this.API_URL = publicRuntimeConfig.API_URL
        this.circularProgress = <CircularProgress style={{ fontSize: '20px' }} />
        this.noDataMarkup = <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '30px', color: '#ffffff' }}>No transactions found</div>
    }

    componentDidMount() {
        this.getStats('daily')
        axios.post(`${this.API_URL}/price/get`)
            .then((response) => {
                console.log(response)
                this.setState({
                    ethPrice: response.data.eth.price,
                    btcPrice: response.data.btc.price
                })
            })
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleCheckbox = (event) => {
        this.setState({ [event.target.name]: event.target.value })
        this.getStats(event.target.value)
    }

    getStats = (period) => {
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
        console.log(params)
        if (this.state.coinType === 'eth') {
            axios.post(`${this.API_URL}/eth/getTxnDetails`, params)
                .then((response) => {
                    console.log(response)
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
                    console.log(response)
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
        console.log(event.target.value)
        this.getTransactionDetail(JSON.parse(event.target.value).transactionIndex, JSON.parse(event.target.value).blockNumber)
    }

    fetchNext = async () => {

        let fromTxnNumber = this.state.fromTxnNumber + 10;
        let toTxnNumber = (fromTxnNumber + 9 > this.state.txnCount) ? this.state.txnCount - 1 : fromTxnNumber + 9;
        let transactions = [];

        for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
            transactions.push(this.state.txns[txnNumber])
        }
        this.prepareTableMarkup(transactions);
        this.setState({
            fromTxnNumber: fromTxnNumber,
            toTxnNumber: toTxnNumber
        })
    }

    fetchPrev = async () => {

        let fromTxnNumber = this.state.fromTxnNumber - 10
        let toTxnNumber = fromTxnNumber + 9
        let transactions = [];

        for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
            transactions.push(this.state.txns[txnNumber])
        }
        this.prepareTableMarkup(transactions);
        this.setState({
            fromTxnNumber: fromTxnNumber,
            toTxnNumber: toTxnNumber
        })
    }



    render() {
        return (
            <div style={{ display: 'flex', marginTop: '20px', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
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
                            <span>Ethereum&nbsp;${this.state.ethPrice}</span>
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
                </div>
            </div>
        )
    }
}