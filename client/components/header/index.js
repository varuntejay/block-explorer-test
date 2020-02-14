import React,{ Component } from 'react';
import './style.css'

export default class Header extends Component {
    constructor() {
        super();
    }
    render() {
        return(
            <div id="header">                
                <div id="titleHolder">Block Explorer</div>
            </div>
        )
    }
}