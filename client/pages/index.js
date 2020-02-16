import React,{ Component } from 'react';
import Layout from '../components/layout';
import Dashboard from '../components/dashboard'


export default class Index extends Component {
    constructor() {
        super();
    }
    componentDidMount() {
    }
    render() {
        return (
            <Layout>
                <Dashboard/>
            </Layout>
        )
    }
}