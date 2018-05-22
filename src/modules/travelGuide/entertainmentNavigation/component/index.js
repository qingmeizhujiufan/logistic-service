import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import {Map, Marker, NavigationControl, InfoWindow, TrafficLayer} from 'react-bmap';
import '../index.less';

class BusInformation extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          
        };
    }

    componentWillMount() {
      
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    //返回
    callback = () => {
      this.context.router.push('/?id=3');
    } 

    render() {
      let { data } = this.state;

      return (
        <div className="entertrainment">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            leftContent="返回" 
            onLeftClick={this.callback}
          >生活导航</NavBar>
          <div className="zui-content zui-scroll-wrapper">
            <div className="zui-scroll">
              <p>敬请期待~</p>
            </div>   
          </div>
        </div>
      );
    }
}

BusInformation.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  BusInformation;
