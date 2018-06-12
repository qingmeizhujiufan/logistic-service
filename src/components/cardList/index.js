import React from 'react';
import PropTypes from 'prop-types';
import {Flex} from 'antd-mobile';
import _ from 'lodash';
import QueueAnim from 'rc-queue-anim';
import './index.less';
import arrow from 'Img/right-arrow.png';

class CardList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: this.props.data.tabIndex,
            tabContent: this.props.data.tabContent
        };
    }

    componentWillMount() {
        if (this.props.data.activeTab) {
            this.setState({
                tabIndex: parseInt(this.props.data.activeTab)
            });
        }
    }

    componentDidMount() {
    }

    btnClick = (url) => {
        this.context.router.push(url);
    }

    changeTab = (index) => {
        const {tabIndex, tabContent} = this.state;
        const {data} = this.props;
        console.log('index === ', index);
        if(data.blankList){
            const blankList = data.blankList;
            if(blankList.keys.findIndex(key => key === `${index}`) > -1) {
                const content = _.find(blankList.contentList, {key: `${index}`}).tabContent;
                this.setState({
                    tabIndex: index,
                    tabContent: content
                });
            }else {
                this.setState({
                    tabIndex: index,
                    tabContent: data.tabContent
                });
            }
        }else{
            this.setState({
                tabIndex: index
            });
        }
    }

    showTab = () => {
        const {tabIndex} = this.state;
        const {data} = this.props;
        if (data.tabs) {
            return (
                <div className="tab-button-group">
                    <QueueAnim delay={500}>
                        {
                            data.tabs.map((item, index) => {
                                const _class = `tab-button ${tabIndex === (index + 1) ? 'active' : ''}`;
                                return (
                                    <span key={index} className={_class}
                                          onClick={() => this.changeTab(index + 1)}>{item.label}</span>
                                )
                            })
                        }
                    </QueueAnim>
                </div>
            )
        }
    }

    render() {
        const {tabIndex, tabContent} = this.state;
        const {data} = this.props;

        return (
            <div>
                {this.showTab()}
                <Flex justify="between" style={{marginTop: 20}}>
                    <h1 style={{fontSize: 20}}>{data.title}</h1>
                    {
                        data.website ? (
                            <span style={{fontSize: 14, color: '#888'}}
                                  onClick={() => this.btnClick(data.website + data.tabs[tabIndex - 1].value)}>企业官网<img
                                src={arrow} style={{width: 10, marginLeft: 5}}/></span>
                        ) : null
                    }
                </Flex>
                <ul className="zui-list-unstyled card-list">
                    <QueueAnim delay={500} type={'bottom'}>
                        {
                            tabContent.map((item, index) => {
                                return (
                                    <li key={index}
                                        onClick={() => this.btnClick(item.path + (tabIndex ? data.tabs[tabIndex - 1].value : ''))}>
                                        <div className="wrap-img">
                                            <img src={item.preview}/>
                                        </div>
                                        <div className="title">{item.title}</div>
                                        <div className="desc">{item.desc}</div>
                                    </li>
                                )
                            })
                        }
                    </QueueAnim>
                </ul>
            </div>
        );
    }
}


CardList.contextTypes = {
    router: React.PropTypes.object,
    // value: PropTypes.number.isRequired,
    // onIncreaseClick: PropTypes.func.isRequired
}

export default CardList;
