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

const getHealthDetailUrl = restUrl.ADDR + 'health/getHealthDetail';

class healthFoodDetail extends React.Component {
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
      ajax.getJSON(getHealthDetailUrl, param, (data) => {
        data =  data.backData;
        if(data.health_content && data.health_content !== ''){
          data.health_content = JSON.parse(data.health_content);
          data.contentHtml = draftToHtml(data.health_content);
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
          <div className="healthFood">
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            ></NavBar>
            <div className='zui-content healthFoodDetail article'>
              <h2>{data.health_title}</h2>
              <p className="create-time">{data.create_time}</p>
              <div className="desc">{data.health_desc}</div>
              <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>   
            </div>
          </div>
        );
    }
}

healthFoodDetail.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  healthFoodDetail;
