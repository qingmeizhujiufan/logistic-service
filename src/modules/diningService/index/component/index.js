import React from 'react';
import { NavBar, SegmentedControl } from 'antd-mobile';
import '../index.less';

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
        };
    }
  
    componentDidMount() {
    }

    render() {
        return (
          <div>
            <NavBar
              mode="light"
            >就餐服务</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                <div style={{padding: 10}}>
                    <SegmentedControl values={['就餐指南', '企业官网']} />
                </div>
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
