import React from 'react';
import { Link } from 'react-router';
import { Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';
//引入自定义组件
import MenuList from '../../../../containers/menuList';
//引入图片
import propertyInformation from 'Img/property-information.jpg';
import mall from 'Img/mall.jpg';
import survey from 'Img/survey.jpg';
import healthLife from 'Img/health-life.jpg';
import lost from 'Img/lost.jpg';
import need from 'Img/need.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {
            title: '宿舍公寓',
            tabIndex: 1,
            activeTab: this.props.activeTab,
            website: '/pub/companyWebsite/',
            tabs: [
              {
                value: '3',
                label: '学生公寓1号',
              }, {
                value: '4',
                label: '学生公寓2号',
              }, {
                value: '5',
                label: '教师公寓',
              }
            ],
            tabContent: [
              {
                title: '房源信息',
                desc: '问您提供最优质最全面的房源',
                preview: propertyInformation,
                path: '/residence/residence/'
              }, {
                title: '大堂画面',
                desc: '随时随地查看大堂画面',
                preview: mall,
                path: '/pub/canteenPicture/'
              }, {
                title: '满意度调查',
                desc: '您的满意就是我们工作的动力',
                preview: survey,
                path: '/pub/survey/'
              }, {
                title: '健康生活',
                desc: '生活无限美好，健康最重要',
                preview: healthLife,
                path: '/pub/healthLife/'
              }, {
                title: '便民服务',
                desc: '去看看是否有您需要招领的失物',
                preview: lost,
                path: '/pub/lost/'
              }, {
                title: '提出你的需求',
                desc: '为了给您更好的服务',
                preview: need,
                path: '/pub/need/'
              }
            ]
          }
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
        <div className="residence">
          <div className='zui-scroll-wrapper'>
            <div className="zui-scroll">
              <MenuList data={data} />
            </div>   
          </div>
        </div>
      );
    }
}

Index.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  Index;
