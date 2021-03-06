import React from 'react';
import {NavBar, Icon, Toast} from 'antd-mobile';
import QueueAnim from 'rc-queue-anim';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import noData from 'Img/no-data.png';

const getDailyDishUrl = restUrl.ADDR + 'server/getDailyDish';

const tabs = [
    {
        label: '早餐',
    }, {
        label: '午餐',
    }, {
        label: '晚餐',
    }
];

class TodayMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 1,
            data: []
        };
    }

    componentDidMount() {
        this.getDailyDish();
    }

    getDailyDish = () => {
        Toast.loading('正在加载...', 0);
        var param = {};
        param.id = this.props.params.id;
        ajax.getJSON(getDailyDishUrl, param, (data) => {
            data = data.backData;
            this.setState({
                data
            });
            if (data.length === 0) {
                Toast.info('管理员暂未设置今天菜单', 1);
            }
            Toast.hide();
        });
    }

    filterData = (data) => {
        const {tabIndex} = this.state;
        const dataSource = data;
        return dataSource.filter((item) => {
            return item.dish_type === tabs[tabIndex - 1].label && item.dish_week && item.dish_week.indexOf(new Date().getDay().toString()) > -1
        })
    }

    //返回
    callback = () => {
        this.context.router.goBack();
    }

    changeTab = (index) => {
        console.log('index === ', index);
        this.setState({
            tabIndex: index
        });
    }

    render() {
        const {tabIndex, data} = this.state;
        const dataSource = this.filterData(data);
        return (
            <div className="todayMenu">
                <NavBar
                    mode="light"
                    icon={<Icon type="left"/>}
                    leftContent="返回"
                    onLeftClick={this.callback}
                >今日菜单</NavBar>
                <div className='zui-content zui-scroll-wrapper'>
                    <div className="zui-scroll">
                        <div className="tab-button-group">
                            <QueueAnim delay={500}>
                                {
                                    tabs.map((item, index) => {
                                        const _class = `tab-button ${tabIndex === (index + 1) ? 'active' : ''}`;
                                        return (
                                            <span key={index} className={_class}
                                                  onClick={() => this.changeTab(index + 1)}>{item.label}</span>
                                        )
                                    })
                                }
                            </QueueAnim>
                        </div>
                        <div>
                            <ul className="zui-list-unstyled dish-list">
                                {
                                    dataSource.length > 0 ? dataSource.map((item, index) => {
                                        return (
                                            <li key={index}>
                                                <div>
                                                    <div className='wrap-img'>
                                                        <img
                                                            src={restUrl.BASE_HOST + 'UpLoadFile/' + item.dish_img + '.png'}/>
                                                    </div>
                                                    <div className="title">{item.dish_title}</div>
                                                    <div className="desc">{item.dish_content}</div>
                                                </div>
                                            </li>
                                        )
                                    }) : (
                                        <div className="wrap-no-data">
                                            <img src={noData}/>
                                        </div>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TodayMenu.contextTypes = {
    router: React.PropTypes.object
}

export default TodayMenu;
