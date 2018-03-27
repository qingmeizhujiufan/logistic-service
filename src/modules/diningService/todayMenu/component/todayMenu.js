import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import '../todayMenu.less';

class todayMenu extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
        };
    }
  
    componentDidMount() {
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    } 

    render() {
        return (
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >今日菜单</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
              </div>   
            </div>
          </div>
        );
    }
}

todayMenu.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  todayMenu;
