import React from 'react';
import { NavBar, Grid } from 'antd-mobile';
import home from 'Img/chartHome.png';

const data = [
  {
    text: '设备项目组',
    link: '/device/index'
  }];

class Index extends React.Component {
  constructor(props) {
    super(props); 
  }

  btnClick = (url) => {
    this.context.router.push(url);
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
        >移动设备</NavBar>
        <div className='zui-content'>
          <Grid data={data}
            columnNum={3}
            renderItem={dataItem => (
              <div style={{ padding: '12.5px' }} onClick={() => this.btnClick(dataItem.link)}>
                <img src={home} style={{ width: '75px', height: '75px' }} alt="" />
                <div style={{ color: '#333', fontSize: '14px', marginTop: '12px' }}>
                  <span>{dataItem.text}</span>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  }
}

Index.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  Index;
