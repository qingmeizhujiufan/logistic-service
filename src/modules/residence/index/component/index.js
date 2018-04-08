import React from 'react';
import { Link } from 'react-router';
import { Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';
//引入自定义组件
import CardList from '../../../../components/cardList';
//引入图片
import propertyInformation from 'Img/property-information.jpg';
import canteenPicture from 'Img/canteen-picture.jpg';
import survey from 'Img/survey.jpg';
import lost from 'Img/lost.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          floor: 1,
          list: {
            floor: 1,
            tabContent: [
              {
                title: '房源信息',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: propertyInformation,
                path: '/diningService/todayMenu'
              }, {
                title: '大堂画面',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: canteenPicture,
                path: '/diningService/todayMenu'
              }, {
                title: '满意度调查',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: survey,
                path: '/diningService/todayMenu'
              }, {
                title: '失物招领',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: lost,
                path: '/diningService/todayMenu'
              }
            ]
          }
        };
    }

    componentWillMount() {
      document.title = '宿舍公寓';
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
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
                <span className={floor_first_headerclass}>一栋</span>
                <span className={floor_second_headerclass}>二栋</span>
                <span className={floor_second_headerclass}>三栋</span>
              </div>
              <Flex justify="between">
                <h1 style={{fontSize: 20}}>宿舍公寓</h1>
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
