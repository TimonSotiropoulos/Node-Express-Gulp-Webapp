import React from 'react';

import Body from './Body.jsx';

export default class Main extends React.Component {
    render() {
        console.log(this.props.name);
        return (
            <div>
                Hello World, Some new content! OMG!
                <Body />
            </div>
        );
    }
}
