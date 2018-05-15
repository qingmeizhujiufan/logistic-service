import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, List, Toast } from 'antd-mobile';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import HealthFood from 'Img/health-food.jpg';
const Item = List.Item;
const Brief = Item.Brief;

const getLiveDetailUrl = restUrl.ADDR + 'health/getLiveDetail';

class LiveDetail extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {}
        };
    }
  
    componentDidMount() {
      this.getNewsDetailInfo();
    }

    //获取产品详情
    getNewsDetailInfo = (id) => {
      let param = {};
      param.id = this.props.params.id;
      Toast.loading('正在加载...', 0);
      ajax.getJSON(getLiveDetailUrl, param, (data) => {
        data =  data.backData;
        if(data.live_content && data.live_content !== ''){
          data.live_content = JSON.parse(data.live_content);
          data.contentHtml = draftToHtml(data.live_content);
          console.log('contentHtml === ', data.contentHtml);
        }
        
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

    render() {
      let { data } = this.state;
        return (
          <div className="liveDetail">
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            ></NavBar>
            <div className='zui-content zui-scroll-wrapper article'>
              <h2>{data.live_title}</h2>
              <p className="create-time">{data.create_time}</p>
              <div className="desc">{data.live_desc}</div>
              <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>   
            </div>
          </div>
        );
    }
}

LiveDetail.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  LiveDetail;
