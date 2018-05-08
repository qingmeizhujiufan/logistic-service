import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, Tabs } from 'antd-mobile';
import '../index.less';

const tabs = [
  { title: '企业文化' },
  { title: '服务咨询' },
  { title: '企业相册' },
  { title: '节日活动' }
];

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
                <Tabs tabs={tabs}
                  initialPage={1}
                  onChange={(tab, index) => { console.log('onChange', index, tab); }}
                  onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                    Content of first tab
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                    Content of second tab
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '150px', backgroundColor: '#fff' }}>
                    Content of third tab
                  </div>
                </Tabs>
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
