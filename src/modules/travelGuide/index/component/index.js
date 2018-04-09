import React from 'react';
import { Link } from 'react-router';
import '../index.less';
//引入自定义组件
import MenuList from '../../../../containers/menuList';
//引入图片
// import entertainmentNavigation from 'Img/entertainment-navigation.jpg';
import busInformation from 'Img/bus-information.jpg';
import entertainmentNavigation from 'Img/entertainment-navigation.jpg';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: {
            title: '出行指南',
            tabContent: [
              {
                title: '到段导航',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: busInformation,
                path: '/diningService/todayMenu/'
              }, {
                title: '班车信息',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: busInformation,
                path: '/diningService/todayMenu/'
              }, {
                title: '娱乐点导航',
                desc: '丰盛的饭菜，绝对吊足你的胃口',
                preview: entertainmentNavigation,
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
    router:React.PropTypes.object  
} 

export default  Index;
