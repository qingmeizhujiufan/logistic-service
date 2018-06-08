import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, Toast } from 'antd-mobile';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';

const getCompanyLostInfoUrl = restUrl.ADDR + 'server/getCompanyLostInfo';

class Lost extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {}
        };
    }
  
    componentDidMount() {
      this.getCompanyLostInfo();
    }

    //获取失物招领详情
    getCompanyLostInfo = (id) => {
      let param = {};
      param.companyId = this.props.params.id;
      Toast.loading('正在加载...', 0);
      ajax.getJSON(getCompanyLostInfoUrl, param, (data) => {
        data =  data.backData;
        if(data.lost_content && data.lost_content !== ''){
          data.lost_content = JSON.parse(data.lost_content);
          data.contentHtml = draftToHtml(data.lost_content);
          console.log('contentHtml === ', data.contentHtml);
          this.setState({
            data,
            loading: false
          });
        }
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
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >便民服务</NavBar>
            <div className='zui-content lost'>
              <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>     
            </div>
          </div>
        );
    }
}

Lost.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  Lost;
