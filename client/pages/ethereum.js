import React, {Component} from 'react';
import Layout from '../components/layout';
import './../stylesheets/public.css';
import Content from './../components/content' 

export default class Accounts extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
  }

  render() {    
    return (
      <Layout >
        <div style={{marginTop: '30px'}}>
          <Content/>
        </div>
      </Layout>
    )
  }
}


