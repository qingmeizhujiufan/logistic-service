import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import {Map, Marker, NavigationControl, InfoWindow, TrafficLayer} from 'react-bmap';
import '../index.less';

const guideUrl = 'http://api.map.baidu.com/direction?destination=武汉高铁职业技能训练段&mode=driving&region=武汉&output=html&src=fxhh';

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

    awakMap = () => {
      alert();
    }

    render() {
      let { data } = this.state;

      return (
        <div className="segment">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            leftContent="返回" 
            onLeftClick={this.callback}
          >到段导航</NavBar>
          <div className="zui-content zui-scroll-wrapper">
            <div className="zui-scroll">
              <Map 
                center={{lng: 114.489567, lat: 30.543613}} 
                zoom="15"
                style={{width: '100vw', height: 'calc(100vh - 44px)'}}
              >
                  <TrafficLayer/>
                  <Marker position={{lng: 114.489567, lat: 30.543613}} />
                  <NavigationControl /> 
                  <InfoWindow position={{lng: 114.489567, lat: 30.543613}} text="地址：湖北省武汉市洪山区何刘村北" title="武汉高铁职业技能训练段" onClick={this.awakMap} />
              </Map>
            </div> 
            <a className="guide" href={guideUrl}>导航</a>  
          </div>
        </div>
      );
    }
}

BusInformation.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  BusInformation;
