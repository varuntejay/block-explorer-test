import React, { Component } from 'react';
import Header from '../header';
import Menubar from '../menubar';
import './style.css'

export default class Layout extends Component {
    constructor() {
        super();
    }
    render() {
        return (
            <div style={{ height: '100%', margin: '-8px'}}>
                <Header></Header>
                <Menubar></Menubar>
                <div className="contentSection">
                    {this.props.children}
                </div>
            </div>
        )
    }
}