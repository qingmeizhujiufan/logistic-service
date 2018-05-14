import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, List } from 'antd-mobile';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
const Item = List.Item;
const Brief = Item.Brief;

const getLiveUrl = restUrl.ADDR + 'health/getLiveList';

class LiveList extends React.Component {
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
      ajax.getJSON(getLiveUrl, null, _data => {
        if(_data.success){
          let backData = _data.backData;
          let data = [];
          backData.map(item => {
            item.create_time = item.create_time.substring(0, 10);
          });
          this.setState({
            data: backData
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
          <div className="liveList">
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >动态列表</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                <List>
                {
                  data.map(item => {
                    return (
                      <Item
                        key={item.id}
                        thumb={restUrl.BASE_HOST + 'UpLoadFile/' + item.live_cover + '.png'}
                        onClick={() => {this.goTo('/live/detail/' + item.id)}}
                      >{item.live_title}<Brief>{item.live_desc}</Brief><Brief>发布日期：{item.create_time}</Brief>
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

LiveList.contextTypes = {  
    router: React.PropTypes.object  
} 

export default LiveList;
