import React from 'react';
import { NavBar, Icon, List, Radio, InputItem, TextareaItem, Toast, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import '../businessCulture.less';

class BusinessCulture extends React.Component {
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
            >企业文化</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                  
              </div>   
            </div>
          </div>
        );
    }
}

BusinessCulture.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  BusinessCulture;
