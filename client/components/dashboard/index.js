import React, { Component } from 'react';
import './style.css'
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@material-ui/core';
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdRefresh
} from "react-icons/md";
import {
    Tooltip
} from '@material-ui/core';

import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export default class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
        }
        this.API_URL = publicRuntimeConfig.API_URL
        this.circularProgress = <CircularProgress style={{ fontSize: '20px' }} />
    }

    componentDidMount() {}

    handleChange = (event) => {
        this.setState({[event.target.name]: event.target.value})
    }

    render() {
        return (
            <div style={{ display: 'flex', marginTop: '20px', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif' }}>
                <div style={{ justifyContent: 'center', width: '100%', display: 'inline-grid' }}>
                    <div className="navigator" style={{ width: '1280px' }}>
                        <div style={{ float: 'left', paddingLeft: '15px' }}>
                            <span style={{ fontSize: '30px' }}>Dashboard&nbsp;</span>
                        </div>
                        <table>
                            <tr>
                                <td>
                                    <FormControl>
                                        <InputLabel >Coin type</InputLabel>
                                        <Select
                                            value={this.state.coinType}
                                            name="coinType"
                                            onChange={this.handleChange}
                                        >
                                            <MenuItem value={'bitcoin'}>Bitcoin</MenuItem>
                                            <MenuItem value={'eth'}>Ethereum</MenuItem>
                                        </Select>
                                    </FormControl>
                                </td>
                            </tr>
                        </table>
                    </div>
                    {/* <table>
                        <tbody>
                            <tr className="borderBottom">
                                <th>Block Number</th>
                                <th>Timestamp</th>
                                <th>Data Hash</th>
                                <th>Number of Tx</th>
                                <th>Info</th>
                            </tr>
        
                        </tbody>
                    </table> */}
                </div>
            </div>
        )
    }
}