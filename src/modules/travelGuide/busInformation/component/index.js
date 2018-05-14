import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, List, Toast } from 'antd-mobile';
import '../index.less';

import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
const Item = List.Item;
const Brief = Item.Brief;

const getBusDetailUrl = restUrl.ADDR + 'company/getBusDetail';

class BusInformation extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {}
        };
    }

    componentWillMount() {
      
    }
  
    componentDidMount() {
      this.getBusDetailInfo();
    }

    //获取产品详情
    getBusDetailInfo = (id) => {
      Toast.loading('正在加载...', 0);
      ajax.getJSON(getBusDetailUrl, null, (data) => {
        data.backData = JSON.parse(data.backData);
        data.contentHtml = draftToHtml(data.backData);
        
        this.setState({
          data,
          loading: false
        });
        Toast.hide();
      });
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    } 

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
      let { data } = this.state;

      return (
        <div className="busInformation">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            leftContent="返回" 
            onLeftClick={this.callback}
          >班车信息</NavBar>
          <div className='zui-content'>
              <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>   
            </div>
        </div>
      );
    }
}

BusInformation.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  BusInformation;
