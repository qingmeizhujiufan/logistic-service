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

    render() {
      let { data } = this.state;

      return (
        <div className="entertrainment">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            leftContent="返回" 
            onLeftClick={this.callback}
          >到段导航</NavBar>
          <div className="zui-content zui-scroll-wrapper">
            <div className="zui-scroll">
              <Map 
                center={{lng: 116.402544, lat: 39.928216}} 
                zoom="11"
                style={{width: '100vw', height: 'calc(100vh - 44px)'}}
              >
                  <TrafficLayer/>
                  <Marker position={{lng: 116.402544, lat: 39.928216}} />
                  <NavigationControl /> 
                  <InfoWindow position={{lng: 116.402544, lat: 39.928216}} text="内容" title="标题"/>
              </Map>
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
