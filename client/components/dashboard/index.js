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

export default class Dashboard extends Component {
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
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
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
                    <div className="navigator" style={{ width: '1500px', paddingBottom: '16px', height: '25px' }}>
                        <div style={{ float: 'left', paddingLeft: '15px' }}>
                            <span style={{ fontSize: '25px' }}>Fetch latest block time 24 hours transactions</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ float: "left" }}>
                            <FormControl style={{ borderRadius: '10px' }}>
                                <InputLabel >Crypto currency type</InputLabel>
                                <Select
                                    value={this.state.coinType}
                                    name="coinType"
                                    onChange={this.handleChange}
                                    error={(this.state.errorFields).includes['coinType']}
                                >
                                    <MenuItem value={'eth'}>Ethereum</MenuItem>
                                    <MenuItem value={'bitcoin'}>Bitcoin</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField type="number" label="Threshold" name="coins" value={this.state.coins} onChange={this.handleChange} style={{ width: "200px", marginLeft: '20px', borderRadius: '10px', marginRight: "20px" }} error={(this.state.errorFields).includes['coins']} />
                            <button style={{ paddingTop: '15px', paddingBottom: "15px", paddingLeft: "30px", paddingRight: "30px", backgroundColor: "black", color: "white", width: "90px", borderRadius: '15px' }} onClick={this.viewDetails}>Fetch</button>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div>
                            {this.state.txnsMarkup !== "" ?
                                <div style={{ backgroundColor: "#343d4682", marginTop: '20px', marginBottom: '10px', width: '900px', display: 'flow-root' }}>
                                    <span style={{ float: 'left', color: '#ffffff', fontSize: '20px', padding: '15px' }}>
                                        Showing 50 transactions from latest block date
                            </span>
                                    <Tooltip title="Next" style={{ padding: '-10px' }}>
                                        <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchNext} disabled={(this.state.toTxnNumber + 1) == this.state.txnCount}>
                                            <MdKeyboardArrowRight style={{ fontSize: '40px' }} />
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Prev" style={{ padding: '-10px' }}>
                                        <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchPrev} disabled={(this.state.fromTxnNumber == 0)}>
                                            <MdKeyboardArrowLeft style={{ fontSize: '40px' }} />
                                        </Button>
                                    </Tooltip>
                                </div>
                                : null}
                            {this.state.txnsMarkup}
                        </div>
                        <div className="transactionDetails" style={{ width: '600px' }}>
                            {this.state.trasactionDetailsMarkup !== "" ?
                                <div style={{ backgroundColor: "#343d4682", marginLeft: '15px', marginTop: '20px', marginBottom: '10px', width: '600px', display: 'flow-root' }}>
                                    <span style={{ float: 'left', color: '#ffffff', fontSize: '20px', padding: '15px' }}>
                                        Transaction details
                                    </span>
                                </div>
                                : null}
                            {this.state.trasactionDetailsMarkup}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}