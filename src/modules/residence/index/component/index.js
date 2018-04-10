import React from 'react';
import { Link } from 'react-router';
import { Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';
//引入自定义组件
import MenuList from '../../../../containers/menuList';
//引入图片
import propertyInformation from 'Img/property-information.jpg';
import canteenPicture from 'Img/canteen-picture.jpg';
import survey from 'Img/survey.jpg';
import lost from 'Img/lost.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {
            title: '宿舍公寓',
            tabIndex: 1,
            tabs: [
              {
                label: '学生公寓1号',
              }, {
                label: '学生公寓2号',
              }, {
                label: '教师公寓',
              }
            ],
            tabContent: [
              {
                title: '房源信息',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: propertyInformation,
                path: '/diningService/todayMenu/'
              }, {
                title: '大堂画面',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: canteenPicture,
                path: '/diningService/todayMenu/'
              }, {
                title: '满意度调查',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: survey,
                path: '/diningService/todayMenu/'
              }, {
                title: '失物招领',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: lost,
                path: '/diningService/todayMenu/'
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
