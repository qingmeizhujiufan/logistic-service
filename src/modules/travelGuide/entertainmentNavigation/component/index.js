import React from 'react';
import { NavBar, Icon, List, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';

const Item = List.Item;
const Brief = Item.Brief;
const getUrl = destination => `http://api.map.baidu.com/direction?origin=latlng:30.543613,114.489567|name:武汉高铁职业技能训练段&destination=${destination}&mode=driving&region=武汉&output=html&src=fxhh`;
const trafficPoint = [
    {
        title: '武汉站',
        desc: '湖北省武汉市洪山区杨春湖南侧'
    },{
        title: '武昌站',
        desc: '湖北省武汉市武昌区中山路'
    },{
        title: '汉口站',
        desc: '湖北省武汉市江汉区发展大道金家墩1号'
    },{
        title: '武汉天河国际机场',
        desc: '武汉市黄陂区机场大道'
    },
];

const school = [
    {
        title: '武汉大学',
        desc: '985工程 211工程 研究生院'
    },{
        title: '华中师范大学',
        desc: '211工程 双一流（世界一流学科建设高校）2011计划 111计划 '
    },{
        title: '华中科技大学',
        desc: '211工程 985工程 七校联合办学 双一流（世界一流大学A类建设高校）教育部直属高校 全国重点大学 2011计划'
    },{
        title: '武汉理工大学',
        desc: '211工程 985平台 111计划'
    },
];

const tour = [
    {
        title: '武汉植物园',
        desc: '中国湖北省武汉市武昌区磨山'
    },{
        title: '武汉动物园',
        desc: '武汉市汉阳区墨水湖畔'
    },{
        title: '磨山',
        desc: '国家AAAAA级旅游景区'
    },{
        title: '武汉东湖风景区',
        desc: '国家5A级旅游景区'
    },{
        title: '东湖绿道',
        desc: '5A级旅游景区'
    },{
        title: '武汉欢乐谷',
        desc: '东湖生态旅游风景区欢乐大道196号（近武汉火车站）'
    },
];

const shopping = [
    {
        title: '光谷广场',
        desc: '武汉轨道交通2号线1期东南端的首末站'
    },{
        title: '楚河汉街',
        desc: '湖北省武汉市核心地段，武昌区东湖和沙湖之间'
    },{
        title: '群光广场',
        desc: ''
    },{
        title: '司门口',
        desc: ''
    }
];

const hostpital = [
    {
        title: '光谷同济医院',
        desc: ''
    },{
        title: '武汉大学中南医院',
        desc: ''
    },{
        title: '湖北省中医院',
        desc: ''
    }
];

class BusInformation extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          
        };
    }

    componentWillMount() {
      
    }
  
    componentDidMount() {
    }

    BaiduGuide = (url) => {
      window.location.href = url;
    }

    //返回
    callback = () => {
      this.context.router.push('/?id=3');
    } 

    render() {
      let { data } = this.state;

      return (
        <div className="entertrainment">
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            leftContent="返回" 
            onLeftClick={this.callback}
          >生活导航</NavBar>
          <div className="zui-content zui-scroll-wrapper">
            <div className="zui-scroll">
                <List renderHeader={() => '重要交通点'}>
                    {
                        trafficPoint.map((item, index) => {
                            return (
                                <Item
                                    key={index}
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => this.BaiduGuide(getUrl(item.title))}
                                    platform="android"
                                >
                                    {item.title}<Brief>{item.desc}</Brief>
                                </Item>
                            )
                        })
                    }
                </List>
                <List renderHeader={() => '知名高校'}>
                    {
                        school.map((item, index) => {
                            return (
                                <Item
                                    key={index}
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => this.BaiduGuide(getUrl(item.title))}
                                    platform="android"
                                >
                                    {item.title}<Brief>{item.desc}</Brief>
                                </Item>
                            )
                        })
                    }
                </List>
                <List renderHeader={() => '旅游景点'}>
                    {
                        tour.map((item, index) => {
                            return (
                                <Item
                                    key={index}
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => this.BaiduGuide(getUrl(item.title))}
                                    platform="android"
                                >
                                    {item.title}<Brief>{item.desc}</Brief>
                                </Item>
                            )
                        })
                    }
                </List>
                <List renderHeader={() => '逛街购'}>
                    {
                        shopping.map((item, index) => {
                            return (
                                <Item
                                    key={index}
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => this.BaiduGuide(getUrl(item.title))}
                                    platform="android"
                                >
                                    {item.title}<Brief>{item.desc}</Brief>
                                </Item>
                            )
                        })
                    }
                </List>
                <List renderHeader={() => '医院'}>
                    {
                        hostpital.map((item, index) => {
                            return (
                                <Item
                                    key={index}
                                    arrow="horizontal"
                                    multipleLine
                                    onClick={() => this.BaiduGuide(getUrl(item.title))}
                                    platform="android"
                                >
                                    {item.title}<Brief>{item.desc}</Brief>
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

BusInformation.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  BusInformation;
