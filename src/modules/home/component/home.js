import React from 'react';
import { TabBar } from 'antd-mobile';

import index_1 from 'Img/index_1.png';
import index_2 from 'Img/index_2.png';
import index_3 from 'Img/index_3.png';
import index_1_active from 'Img/index_1_active.png';
import index_2_active from 'Img/index_2_active.png';
import index_3_active from 'Img/index_3_active.png';

/* 就餐服务 */ 
import DiningService from '../../diningService/index/component/index';

/* 宿舍公寓 */ 
import Residence from '../../residence/index/component/index';

/* 出行指南 */ 
import TravelGuide from '../../travelGuide/index/component/index';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          selectedTab: 'blueTab',
          hidden: false,
          fullScreen: false,
        };
    }

    render() {
        return (
            <div>
                <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, height: '100%'}}>
                <TabBar
                  unselectedTintColor="#949494"
                  tintColor="#33A3F4"
                  barTintColor="white"
                  hidden={this.state.hidden}
                >
                  <TabBar.Item
                    title="就餐服务"
                    key="Life"
                    icon={<img style={{
                        width: '22px',
                        height: '22px',
                      }}
                      src={index_1}
                    />
                    }
                    selectedIcon={<img style={{
                        width: '22px',
                        height: '22px',
                      }}
                      src={index_1_active}
                    />
                    }
                    selected={this.state.selectedTab === 'blueTab'}
                    onPress={() => {
                      this.setState({
                        selectedTab: 'blueTab',
                      });
                    }}
                  >
                    <DiningService />
                  </TabBar.Item>
                  <TabBar.Item
                    icon={<img style={{
                        width: '22px',
                        height: '22px',
                      }}
                      src={index_2}
                    />
                    }
                    selectedIcon={<img style={{
                        width: '22px',
                        height: '22px',
                      }}
                      src={index_2_active}
                    />
                    }
                    title="宿舍公寓"
                    key="Friend"
                    selected={this.state.selectedTab === 'greenTab'}
                    onPress={() => {
                      this.setState({
                        selectedTab: 'greenTab',
                      });
                    }}
                  >
                    <Residence />
                  </TabBar.Item>
                  <TabBar.Item
                    icon={<img style={{
                        width: '22px',
                        height: '22px',
                      }}
                      src={index_3}
                    />
                    }
                    selectedIcon={<img style={{
                        width: '22px',
                        height: '22px',
                      }}
                      src={index_3_active}
                    />
                    }
                    title="出行指南"
                    key="my"
                    selected={this.state.selectedTab === 'yellowTab'}
                    onPress={() => {
                      this.setState({
                        selectedTab: 'yellowTab',
                      });
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