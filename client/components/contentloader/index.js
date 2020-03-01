import React, {Component} from 'react';
import './style.css'

export default class ContentLoader extends Component {
    constructor() {
        super();
    }

    createContentLoaderMarkup = (placeholderCount) => {
        let height = (this.props.height) ? this.props.height : '5px';
        let marginLeft = (this.props.marginLeft) ? this.props.marginLeft: '0%'
        let markup = [];
        for (let i=1; i<=placeholderCount; i++) {
            markup.push(<div className="placeholder-content" style={{width: `${(i*5)+10}%`, height: height, marginTop: height, marginLeft: marginLeft }}></div>)
        }
        return markup;
    }

    render() {
        let markup = this.createContentLoaderMarkup(parseInt(this.props.placeholderCount))
        return(
            <div>{markup}</div>
        )
    }
}