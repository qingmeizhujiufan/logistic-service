import React from 'react';
import { Link } from 'react-router';
import { Button, Flex, WingBlank, WhiteSpace, Toast, NavBar, Icon } from 'antd-mobile';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import noData from 'Img/no-data.png';

const getCompanyResidenceInfoUrl = restUrl.ADDR + 'server/getCompanyResidenceInfo';

const companyData = [3, 4, 5];

class Residence extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {}
        };
    }

    componentWillMount() {
    }
  
    componentDidMount() {
      this.getCompanySurveyInfo();
    }

    //获取失物招领详情
    getCompanySurveyInfo = (id) => {
      let param = {};
      param.id = this.props.params.id;
      Toast.loading('正在加载...', 0);
      ajax.getJSON(getCompanyResidenceInfoUrl, param, (data) => {
        data =  data.backData;
        if(data.residence_content && data.residence_content !== ''){
          data.residence_content = JSON.parse(data.residence_content);
          data.contentHtml = draftToHtml(data.residence_content);
          console.log('contentHtml === ', data.contentHtml);
          this.setState({
            data
          });
        }
        Toast.hide();
      });
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    } 

    render() {
      let { data } = this.state;

      return (
        <div className="">
          <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >房屋信息</NavBar>
          <div className='zui-content zui-scroll-wrapper article'>
            {
              data.residence_content !== '' ? (
                <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.contentHtml}}></div> 
              ) : (
                <div className="wrap-no-data">
                  <img src={noData} />
                </div>
              ) 
            }
          </div>
        </div>
      );
    }
}

Residence.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  Residence;
