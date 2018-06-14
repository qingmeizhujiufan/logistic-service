import React from 'react';
import {Link} from 'react-router';
import {Button, Flex, WingBlank, WhiteSpace} from 'antd-mobile';
import '../index.less';
//引入自定义组件
import MenuList from '../../../../containers/menuList';
//引入图片
import propertyInformation from 'Img/property-information.jpg';
import mall from 'Img/mall.jpg';
import survey from 'Img/survey.jpg';
import healthLife from 'Img/health-life.jpg';
import lost from 'Img/lost.jpg';
import need from 'Img/need.jpg';
import ball_1 from 'Img/ball_1.png';
import ball_2 from 'Img/ball_2.png';
import ball_3 from 'Img/ball_3.png';
import ball_4 from 'Img/ball_4.png';
import ball_5 from 'Img/ball_5.png';
import ball_6 from 'Img/ball_6.png';
import ball_7 from 'Img/ball_7.png';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {
                title: '宿舍公寓',
                tabIndex: 1,
                activeTab: this.props.activeTab,
                website: '/pub/companyWebsite/',
                tabs: [
                    {
                        value: '3',
                        label: '学生公寓1号',
                    }, {
                        value: '4',
                        label: '学生公寓2号',
                    }, {
                        value: '5',
                        label: '教师公寓',
                    }, {
                        value: '10',
                        label: '运动场馆',
                    }, {
                        value: '6',
                        label: '学生公寓3号',
                    }, {
                        value: '7',
                        label: '学生公寓4号',
                    }, {
                        value: '8',
                        label: '学生公寓5号',
                    }, {
                        value: '9',
                        label: '学生公寓6号',
                    }
                ],
                tabContent: [
                    {
                        title: '房源信息',
                        desc: '问您提供最优质最全面的房源',
                        preview: propertyInformation,
                        path: '/residence/residence/'
                    }, {
                        title: '大堂画面',
                        desc: '随时随地查看大堂画面',
                        preview: mall,
                        path: '/pub/canteenPicture/'
                    }, {
                        title: '满意度调查',
                        desc: '您的满意就是我们工作的动力',
                        preview: survey,
                        path: '/pub/survey/'
                    }, {
                        title: '健康生活',
                        desc: '生活无限美好，健康最重要',
                        preview: healthLife,
                        path: '/pub/healthLife/'
                    }, {
                        title: '便民服务',
                        desc: '为您提供温馨的便民服务',
                        preview: lost,
                        path: '/pub/lost/'
                    }, {
                        title: '提出你的需求',
                        desc: '有更好的建议想对我们讲请点击进来',
                        preview: need,
                        path: '/pub/need/'
                    }
                ],
                blankList: {
                    keys: ['4'],
                    contentList: [{
                        key: '4',
                        tabContent: [
                            {
                                title: '羽毛球馆',
                                desc: '打羽毛球从现在开始！',
                                preview: ball_1,
                                path: '/residence/ball/1'
                            }, {
                                title: '足球场',
                                desc: '跟我一起踢足球，尽情奔跑吧！',
                                preview: ball_2,
                                path: '/residence/ball/2'
                            }, {
                                title: '篮球场',
                                desc: '走！一起打篮球啊！',
                                preview: ball_3,
                                path: '/residence/ball/3'
                            }, {
                                title: '台球室',
                                desc: '千万不要让你的白球进袋啦！',
                                preview: ball_4,
                                path: '/residence/ball/4'
                            }, {
                                title: '乒乓球馆',
                                desc: '来看我用国球战胜你！',
                                preview: ball_5,
                                path: '/residence/ball/5'
                            }, {
                                title: '健身馆',
                                desc: '来一次酣畅淋漓的出汗吧！',
                                preview: ball_6,
                                path: '/residence/ball/6'
                            }, {
                                title: '瑜伽馆',
                                desc: '让你的身体带动心灵来一次放松和升华！',
                                preview: ball_7,
                                path: '/residence/ball/7'
                            }
                        ]
                    }]
                }

            }
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    btnClick = (url) => {
        this.context.router.push(url);
    }

    render() {
        let {data} = this.state;

        return (
            <div className="residence">
                <div className='zui-scroll-wrapper'>
                    <div className="zui-scroll">
                        <MenuList data={data}/>
                    </div>
                </div>
            </div>
        );
    }
}

Index.contextTypes = {
    router: React.PropTypes.object
}

export default Index;
