import React from 'react';
import { TabBar } from 'antd-mobile';

import index_1 from 'Img/index_1.png';
import index_2 from 'Img/index_2.png';
import index_3 from 'Img/index_3.png';
import index_1_active from 'Img/index_1_active.png';
import index_2_active from 'Img/index_2_active.png';
import index_3_active from 'Img/index_3_active.png';

/* 就餐服务 */ 
import DiningService from '../../diningService/index/component/';

/* 宿舍公寓 */ 
import Residence from '../../residence/index/component/';

/* 出行指南 */ 
import TravelGuide from '../../travelGuide/index/component/';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          selectedTab: '1',
          params: {}
        };
    }

    componentWillMount() {
      const params = this.getRequest();
      console.log('params === ', params);
      if(params.id){
        this.setState({
          selectedTab: params.id
        });
      }
      this.setState({
        params: params
      });
    }

    getRequest() {   
       var url = location.href.substring(location.href.indexOf('?')); //获取url中"?"符后的字串   
       var theRequest = new Object();   
       if (url.indexOf("?") != -1) {   
          var str = url.substr(1);   
          var strs = str.split("&");   
          for(var i = 0; i < strs.length; i ++) {   
             theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
          }   
       }   
       return theRequest;   
    } 

    render() {
        return (
            <div>
              <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, height: '100%'}}>
                <TabBar
                  unselectedTintColor="#AAAFB9"
                  tintColor="#3D3D3D"
                  barTintColor="white"
                >
                  <TabBar.Item
                    title="就餐服务"
                    key="Life"
                    icon={<img style={{
                        width: '22px',
                        height: '20px',
                      }}
                      src={index_1}
                    />
                    }
                    selectedIcon={<img style={{
                        width: '22px',
                        height: '20px',
                      }}
                      src={index_1_active}
                    />
                    }
                    selected={this.state.selectedTab === '1'}
                    className='active'
                    onPress={() => {
                      this.setState({
                        selectedTab: '1',
                      });
                      sessionStorage.setItem('selectedTab', '1');
                    }}
                  >
                    <DiningService activeTab={this.state.params.subid} />
                  </TabBar.Item>
                  <TabBar.Item
                    icon={<img style={{
                        width: '22px',
                        height: '20px',
                      }}
                      src={index_2}
                    />
                    }
                    selectedIcon={<img style={{
                        width: '22px',
                        height: '20px',
                      }}
                      src={index_2_active}
                    />
                    }
                    title="宿舍公寓"
                    key="Friend"
                    selected={this.state.selectedTab === '2'}
                    onPress={() => {
                      this.setState({
                        selectedTab: '2',
                      });
                      sessionStorage.setItem('selectedTab', '2');
                    }}
                  >
                    <Residence activeTab={this.state.params.subid} />
                  </TabBar.Item>
                  <TabBar.Item
                    icon={<img style={{
                        width: '22px',
                        height: '20px',
                      }}
                      src={index_3}
                    />
                    }
                    selectedIcon={<img style={{
                        width: '22px',
                        height: '20px',
                      }}
                      src={index_3_active}
                    />
                    }
                    title="出行指南"
                    key="my"
                    selected={this.state.selectedTab === '3'}
                    onPress={() => {
                      this.setState({
                        selectedTab: '3',
                      });
                      sessionStorage.setItem('selectedTab', '3');
                    }}
                  >
                    <TravelGuide />
                  </TabBar.Item>
                </TabBar>
              </div>
            </div>
        );
    }
}