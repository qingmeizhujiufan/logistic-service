import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, List } from 'antd-mobile';
import '../index.less';
import HealthFood from 'Img/health-food.jpg';
const Item = List.Item;
const Brief = Item.Brief;

class healthLife extends React.Component {
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

    goTo = (path) => {
      this.context.router.push(path);
    }

    render() {
        return (
          <div className="healthFood">
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >健康生活</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                <List>
                  <Item
                    thumb={HealthFood}
                    onClick={() => {this.goTo('/pub/healthFood/detail/1/1')}}
                  >春天健身保养小常识<Brief>春天到了，春天湿气重人们应该多吃红…</Brief><Brief>发布日期：2018-02-22</Brief></Item>
                  <Item
                    thumb={HealthFood}
                    onClick={() => {}}
                  >
                    春天健身保养小常识<Brief>春天到了，春天湿气重人们应该多吃红…</Brief><Brief>发布日期：2018-02-22</Brief>
                  </Item>
                </List>
              </div>   
            </div>
          </div>
        );
    }
}

healthLife.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  healthLife;
