import React from 'react';
import { Button, Flex, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';
//引入图片
import todayMenu from 'Img/today-menu.jpg';

const tabs = [
  { title: '就餐指南' },
  { title: '企业官网' }
];

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          floor: 1,
        };
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
      let { floor } = this.state;
      let floor_first_headerclass = `tab-button ${floor === 1 ? 'active' : ''}`;
      let floor_second_headerclass = `tab-button ${floor === 2 ? 'active' : ''}`;

      return (
        <div className="diningService">
          <div className='zui-content zui-scroll-wrapper'>
            <div className="zui-scroll">
              <div className="tab-button-group">
                <span className={floor_first_headerclass}>一楼食堂</span>
                <span className={floor_second_headerclass}>二楼食堂</span>
              </div>
              <Flex justify="between">
                <h1 style={{fontSize: 20}}>就餐服务</h1>
                <span style={{fontSize: 14, color: '#888'}}>企业官网-></span>
              </Flex>
              <ul className="zui-list-unstyled card-list">
                <li>
                  <div className="wrap-img">
                    <img src={todayMenu} />
                  </div>
                  <div className="title">今日菜单</div>
                  <div className="desc">丰盛的饭菜，绝对吊足你的胃口</div>
                </li>
              </ul>
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
