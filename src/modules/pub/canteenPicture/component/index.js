import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';

class canteenPicture extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          title: ''
        };
    }

    componentWillMount() {
      let id = this.props.params.id;
      if(id === '1' || id === '2'){
        this.setState({
          title: '食堂画面'
        });
        return;
      }
      if(id === '3' || id === '4' || id === '5'){
        this.setState({
          title: '大堂画面'
        });
      }
    }
  
    componentDidMount() {
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    } 

    render() {
      let {title} = this.state;
        return (
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >{title}</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
              </div>   
            </div>
          </div>
        );
    }
}

canteenPicture.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  canteenPicture;
