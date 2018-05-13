import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Flex,  } from 'antd-mobile';
import '../index.less';
//引入自定义组件
import MenuList from '../../../../containers/menuList';
//引入图片
import todayMenu from 'Img/today-menu.jpg';
import canteenPicture from 'Img/canteen-picture.jpg';
import survey from 'Img/survey.jpg';
import healthFood from 'Img/health-food.jpg';
import lost from 'Img/lost.jpg';
import need from 'Img/need.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {
            title: '就餐服务',
            website: '/pub/companyWebsite/',
            tabIndex: 1,
            tabs: [
              {
                value: '1',
                label: '一楼食堂',
              }, {
                value: '2',
                label: '二楼食堂',
              }
            ],
            tabContent: [
              {
                title: '今日菜单',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: todayMenu,
                path: '/diningService/todayMenu/'
              }, {
                title: '食堂画面',
                desc: '整洁的环境，带给你完美的用餐体验',
                preview: canteenPicture,
                path: '/pub/canteenPicture/'
              }, {
                title: '满意度调查',
                desc: '您的满意就是我们工作的动力',
                preview: survey,
                path: '/pub/survey/'
              }, {
                title: '健康饮食',
                desc: '给您最营养的饮食，最健康的身体',
                preview: healthFood,
                path: '/pub/healthFood/'
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
      const { store } = this.context;
      const state = store.getState();
      // console.log('state == ', state);
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
      let { data } = this.state;
    
      return (
        <div className="diningService">
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
  router: React.PropTypes.object,
  store: React.PropTypes.object
} 

export default Index;
