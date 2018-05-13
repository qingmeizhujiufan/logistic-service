import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, Tabs } from 'antd-mobile';
import '../index.less';

import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import draftToHtml from 'draftjs-to-html';

//获取服务信息
const getServiceDetailUrl = restUrl.ADDR + 'company/getServiceDetail';

const tabs = [
  { title: '企业文化' },
  { title: '服务咨询' },
  { title: '企业相册' },
  { title: '节日活动' }
];

class ServiceDetail extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: {},
            loading: false
        };
    }
  
    componentDidMount() {
        this.getServiceDetail();
    }

    getServiceDetail = () => {
        let param = {};
        param.id = this.props.params.id;
        ajax.getJSON(getServiceDetailUrl, param, (data) => {
            if (data.success) {
                let backData = data.backData;
                backData.service_content = draftToHtml(JSON.parse(backData.service_content));
                
                this.setState({
                    data: backData
                });
            }
        });
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    } 

    render() {
        let { data } = this.state;
        return (
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >{data.service_title}</NavBar>
            <div className='zui-content index zui-scroll-wrapper website'>
              <div className="zui-scroll">
                <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.service_content}}></div> 
              </div>   
            </div>
          </div>
        );
    }
}

ServiceDetail.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  ServiceDetail;
