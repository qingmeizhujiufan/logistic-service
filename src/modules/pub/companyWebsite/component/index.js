import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';

class CompanyWebsite extends React.Component {
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
            >企业官网</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
              </div>   
            </div>
          </div>
        );
    }
}

CompanyWebsite.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  CompanyWebsite;
