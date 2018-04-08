import React from 'react';
import { Link } from 'react-router';
import { Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';
//引入自定义组件
import CardList from '../../../../components/cardList/cardList';
//引入图片
import todayMenu from 'Img/today-menu.jpg';
import canteenPicture from 'Img/canteen-picture.jpg';
import survey from 'Img/survey.jpg';
import healthFood from 'Img/health-food.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          floor: 1,
          list: {
            floor: 1,
            tabContent: [
              {
                title: '今日菜单',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: todayMenu,
                path: '/diningService/todayMenu'
              }, {
                title: '食堂画面',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: canteenPicture,
                path: '/diningService/todayMenu'
              }, {
                title: '满意度调查',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: survey,
                path: '/diningService/todayMenu'
              }, {
                title: '健康饮食',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: healthFood,
                path: '/diningService/todayMenu'
              }
            ]
          }
        };
    }

    componentWillMount() {
      document.title = '就餐服务';
    }
  
    componentDidMount() {
      const { todolist } = this.props;
      console.log('this props === ', this.props);
      console.log('todolist === ', todolist);
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    changeTab = (index) => {
      console.log('index === ', index);
      this.setState({
        floor: index
      });
    }

    render() {
      let { floor, list } = this.state;
      let floor_first_headerclass = `tab-button ${floor === 1 ? 'active' : ''}`;
      let floor_second_headerclass = `tab-button ${floor === 2 ? 'active' : ''}`;

      return (
        <div className="diningService">
          <div className='zui-scroll-wrapper'>
            <div className="zui-scroll">
              <div className="tab-button-group">
                <span className={floor_first_headerclass} onClick={() => this.changeTab(1)}>一楼食堂</span>
                <span className={floor_second_headerclass} onClick={() => this.changeTab(2)}>二楼食堂</span>
              </div>
              <Flex justify="between">
                <h1 style={{fontSize: 20}}>就餐服务</h1>
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
    router: React.PropTypes.object  
} 

export default  Index;
