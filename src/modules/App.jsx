import React from 'react';
import {connect} from 'react-redux';

//将状态写入属性
function mapStateToProps(state) {
    return {
        isShow: state.isShow
    }
};

class App extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isShow: this.props.isShow || false
        };
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

module.exports = connect()(App);