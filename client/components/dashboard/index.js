import React, { Component } from 'react';
import './style.css'
import axios from 'axios';
import { FormControl, InputLabel, TextField, Select, MenuItem, CircularProgress, Tooltip, Button } from '@material-ui/core';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdRefresh
} from "react-icons/md";


import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            txnsMarkup: "",
            coinType: "",
            coins: 0.1,
            errorFields: []
        }
        this.API_URL = publicRuntimeConfig.API_URL
        this.circularProgress = <CircularProgress style={{ fontSize: '20px' }} />
    }

    componentDidMount() { }

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
            axios.post(`${this.API_URL}/eth/filterTransactions`)
            .then((response) =>{
                let txns = response.data.
            })
            let txns = [
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
                {
                    "blockNumber": 123,
                    "from": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "to": "0x26588a9301b0428d95e6Fc3A5024fcE8BEc12D51",
                    "ether": 0.0000334
                },
            ];

            let txnCount = txns.length;
            let fromTxnNumber = 0;
            let toTxnNumber = (txnCount > 9) ? 9 : 9 - txnCount;

            let transactions = [];

            for (let txnNumber = fromTxnNumber; txnNumber <= toTxnNumber; txnNumber++) {
                transactions.push(txns[txnNumber])
            }
            this.setState({ txnCount: txnCount, fromTxnNumber: fromTxnNumber, toTxnNumber: toTxnNumber, txns: txns })
            this.prepareTableMarkup(transactions)

        }
    }

    prepareTableMarkup = (txns) => {
        let rowsMarkup = []
        txns.forEach(txn => {

            rowsMarkup.push(
                <tr className="dataBorderBottom">
                    <td>{txn.number}</td>
                    {/* <td>{txn.timestamp}</td> */}
                    <td>{txn.from}</td>
                    <td>{txn.to}</td>
                    <td>{txn.ether}</td>
                </tr>
            )
        });

        let markup = <table>
            <tbody>
                {/*  <tr>
                    
                </tr> */}
                <tr className="borderBottom">
                    <th>Block Number</th>
                    {/* <th>Timestamp</th> */}
                    <th>From</th>
                    <th>To</th>
                    <th>Value (Ether)</th>
                </tr>
                {rowsMarkup}
            </tbody>
        </table>

        this.setState({ txnsMarkup: markup })
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
                    <div className="navigator" style={{ width: '1280px', paddingBottom: '16px' }}>
                        <div style={{ float: 'left', paddingLeft: '15px' }}>
                            <span style={{ fontSize: '30px' }}>Dashboard&nbsp;</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ float: "left" }}>
                            <FormControl>
                                <InputLabel >Coin type</InputLabel>
                                <Select
                                    value={this.state.coinType}
                                    name="coinType"
                                    onChange={this.handleChange}
                                    error={(this.state.errorFields).includes['coinType']}
                                >
                                    <MenuItem value={'eth'}>Ethereum</MenuItem>
                                    <MenuItem disabled value={'bitcoin'}>Bitcoin</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField type="number" label="Coins" name="coins" value={this.state.coins} onChange={this.handleChange} style={{ width: "200px", marginLeft: '20px', marginRight: "20px" }} error={(this.state.errorFields).includes['coins']} />
                            <button style={{ paddingTop: '15px', paddingBottom: "15px", paddingLeft: "30px", paddingRight: "30px", backgroundColor: "black", color: "white", width: "90px" }} onClick={this.viewDetails}>Fetch</button>
                        </div>
                    </div>
                    {this.state.txnsMarkup !== "" ?
                        <div style={{ backgroundColor: "#343d4682", marginTop: '20px', marginBottom: '10px' }}>
                            <span style={{ float: 'left', color: '#ffffff', fontSize: '20px', padding: '15px' }}>
                                Showing transactions from to date
                            </span>
                            <Tooltip title="Prev" style={{ padding: '-10px' }}>
                                <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchNext} disabled={(this.state.toTxnNumber + 1) == this.state.txnCount}>
                                    <MdKeyboardArrowRight style={{ fontSize: '40px' }} />
                                </Button>
                            </Tooltip>
                            <Tooltip title="Next" style={{ padding: '-10px' }}>
                                <Button style={{ color: '#ffffff', float: "right", padding: '10px !important' }} onClick={this.fetchPrev} disabled={(this.state.fromTxnNumber == 0)}>
                                    <MdKeyboardArrowLeft style={{ fontSize: '40px' }} />
                                </Button>
                            </Tooltip>
                        </div>
                        : null}
                    {this.state.txnsMarkup}
                </div>
            </div>
        )
    }
}