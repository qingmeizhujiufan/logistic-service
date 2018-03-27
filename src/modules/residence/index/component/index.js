import React from 'react';
import { NavBar, Icon, Grid } from 'antd-mobile';
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
        >宿舍公寓</NavBar>
        <div className='zui-content index zui-scroll-wrapper'>
          <div className="zui-scroll">
             
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
