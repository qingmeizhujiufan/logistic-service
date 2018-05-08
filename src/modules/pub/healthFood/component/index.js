import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, List } from 'antd-mobile';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
const Item = List.Item;
const Brief = Item.Brief;

const getHealthUrl = restUrl.ADDR + 'health/getHealthList';

class healthFood extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: []
        };
    }
  
    componentDidMount() {
      this.getList();
    }

    getList = () => {
      ajax.getJSON(getHealthUrl, null, _data => {
        if(_data.success){
          let backData = _data.backData;
          let data = [];
          backData.map(item => {
            item.create_time = item.create_time.substring(0, 10);
            if(item.companyId === this.props.params.id){
              data.push(item);
            }
          });
          this.setState({
            data
          });
        }
      });
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    } 

    goTo = (path) => {
      this.context.router.push(path);
    }

    render() {
      const { data } = this.state;
        return (
          <div className="healthFood">
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >健康饮食</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                <List>
                {
                  data.map(item => {
                    return (
                      <Item
                        key={item.id}
                        thumb={restUrl.BASE_HOST + 'UpLoadFile/' + item.health_cover + '.png'}
                        onClick={() => {this.goTo('/pub/healthFood/detail/' + item.id)}}
                      >{item.health_title}<Brief>{item.health_desc}</Brief><Brief>发布日期：{item.create_time}</Brief>
                      </Item>
                    )
                  })
                }
                </List>
              </div>   
            </div>
          </div>
        );
    }
}

healthFood.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  healthFood;
