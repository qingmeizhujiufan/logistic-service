import React from 'react';
import { TabBar } from 'antd-mobile';

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
                    icon={<div style={{
                      width: '22px',
                      height: '22px',
                      background: 'url(https://zos.alipayobjects.com/rmsportal/sifuoDUQdAFKAVcFGROC.svg) center center /  21px 21px no-repeat' }}
                    />
                    }
                    selectedIcon={<div style={{
                      width: '22px',
                      height: '22px',
                      background: 'url(https://zos.alipayobjects.com/rmsportal/iSrlOTqrKddqbOmlvUfq.svg) center center /  21px 21px no-repeat' }}
                    />
                    }
                    selected={this.state.selectedTab === 'blueTab'}
                    badge={1}
                    onPress={() => {
                      this.setState({
                        selectedTab: 'blueTab',
                      });
                    }}
                    data-seed="logId"
                  >
                    <DiningService />
                  </TabBar.Item>
                  <TabBar.Item
                    icon={
                      <div style={{
                        width: '22px',
                        height: '22px',
                        background: 'url(https://zos.alipayobjects.com/rmsportal/psUFoAMjkCcjqtUCNPxB.svg) center center /  21px 21px no-repeat' }}
                      />
                    }
                    selectedIcon={
                      <div style={{
                        width: '22px',
                        height: '22px',
                        background: 'url(https://zos.alipayobjects.com/rmsportal/IIRLrXXrFAhXVdhMWgUI.svg) center center /  21px 21px no-repeat' }}
                      />
                    }
                    title="宿舍公寓"
                    key="Friend"
                    dot
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
                    icon={{ uri: 'https://zos.alipayobjects.com/rmsportal/asJMfBrNqpMMlVpeInPQ.svg' }}
                    selectedIcon={{ uri: 'https://zos.alipayobjects.com/rmsportal/gjpzzcrPMkhfEqgbYvmN.svg' }}
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