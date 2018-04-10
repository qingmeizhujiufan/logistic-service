import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, Flex } from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import '../index.less';

const tabs = [
  {
    label: '早餐',
  }, {
    label: '午餐',
  }, {
    label: '晚餐',
  }
];

import todayMenu from 'Img/today-menu.jpg';

class TodayMenu extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          tabIndex: 1,
        };
    }
  
    componentDidMount() {
      console.log('props === ', this.props);
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    } 

    changeTab = (index) => {
      console.log('index === ', index);
      this.setState({
        tabIndex: index
      });
    }

    render() {
        const { tabIndex } = this.state;

        return (
          <div className="todayMenu">
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >今日菜单</NavBar>
            <div className='zui-content zui-scroll-wrapper'>
              <div className="zui-scroll">
                <div className="tab-button-group">
                  <QueueAnim delay={500}>
                    {
                      tabs.map((item, index) => {
                        const _class = `tab-button ${tabIndex === (index + 1) ? 'active' : ''}`;
                        return (
                          <span key={index} className={_class} onClick={() => this.changeTab(index + 1)}>{item.label}</span>
                        )
                      })
                    }
                  </QueueAnim>
                </div>
                <div>
                  <ul className="zui-list-unstyled dish-list">
                    <li>
                      <div>
                        <div className='wrap-img'>
                          <img src={todayMenu} />
                        </div>
                        <div className="title">鱼香肉丝</div>
                        <div className="desc">精选猪后腿肉与冬笋翻炒…</div>
                      </div>
                    </li>
                    <li>
                      <div>
                        <div className='wrap-img'>
                          <img src={todayMenu} />
                        </div>
                        <div className="title">鱼香肉丝</div>
                        <div className="desc">精选猪后腿肉与冬笋翻炒…</div>
                      </div>
                    </li>
                    <li>
                     <div>
                        <div className='wrap-img'>
                          <img src={todayMenu} />
                        </div>
                        <div className="title">鱼香肉丝</div>
                        <div className="desc">精选猪后腿肉与冬笋翻炒…</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>   
            </div>
          </div>
        );
    }
}

TodayMenu.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  TodayMenu;
