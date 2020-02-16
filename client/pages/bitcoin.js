import React, { Component } from 'react';
import Layout from '../components/layout';
import Content from './../components/content/bitcoin'

export default class Index extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
    }
    render() {
        return (
            <Layout>
                <div style={{ marginTop: '30px' }}>
                    <Content />
                </div>
            </Layout>
        )
    }
}