import React from 'react';
import { Link } from 'react-router';
import { Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';
//引入自定义组件
import CardList from '../../../../components/cardList';
//引入图片
// import entertainmentNavigation from 'Img/entertainment-navigation.jpg';
import busInformation from 'Img/bus-information.jpg';
import entertainmentNavigation from 'Img/entertainment-navigation.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          floor: 1,
          list: {
            floor: 1,
            tabContent: [
              {
                title: '到段导航',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: busInformation,
                path: '/diningService/todayMenu'
              }, {
                title: '班车信息',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: busInformation,
                path: '/diningService/todayMenu'
              }, {
                title: '娱乐点导航',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: entertainmentNavigation,
                path: '/diningService/todayMenu'
              }
            ]
          }
        };
    }

    componentWillMount() {
      document.title = '出行指南';
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
      let { floor, list } = this.state;

      return (
        <div className="diningService">
          <div className='zui-scroll-wrapper'>
            <div className="zui-scroll">
              <Flex justify="between" style={{margin: '25px 0'}}>
                <h1 style={{fontSize: 20}}>出行指南</h1>
                <span style={{fontSize: 14, color: '#888'}}>企业官网-></span>
              </Flex>
              <CardList list={list} />
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
