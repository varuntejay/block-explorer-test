import React, { Component } from 'react';
import Layout from '../components/layout';
import MainDashboard from '../components/maindashboard'

export default class Index extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
    }
    render() {
        return (
            <Layout>
                <MainDashboard/>
            </Layout>
        )
    }
}