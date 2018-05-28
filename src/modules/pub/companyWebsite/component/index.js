import React from 'react';
import {NavBar, Icon, Card, WingBlank, WhiteSpace, Tabs} from 'antd-mobile';
import '../index.less';

import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import draftToHtml from 'draftjs-to-html';
import noData from 'Img/no-data.png';
//获取公司信息
const getCompanyListUrl = restUrl.ADDR + 'company/GetCompanyList';
//获取公司服务信息
const getServiceListUrl = restUrl.ADDR + 'company/GetServiceList';

let tabs = [
    {title: '企业文化'},
    {title: '服务资讯'},
    {title: '企业相册'},
    {title: '节日活动'}
];

class CompanyWebsite extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            companyId: '',
            data: {},
            service: [],
            holiday: [],
            fileList: [],
            loading: false
        };
    }

    componentWillMount() {
        if (this.props.params.id === '1' || this.props.params.id === '2') {
            tabs = [
                {title: '企业文化'},
                {title: '企业相册'},
                {title: '节日活动'}
            ];
            this.setState({
                companyId: this.props.params.id
            });
        }
    }

    componentDidMount() {
        this.getCompanyInfo();
        this.getServiceList();
    }

    getCompanyInfo = () => {
        ajax.getJSON(getCompanyListUrl, null, (data) => {
            if (data.success) {
                let backData = data.backData;
                backData.map(item => {
                    let photos = item.photo.split(',');
                    let photoList = [];
                    if (photos[0] !== '') {
                        photos.map(photo => {
                            photoList.push({
                                url: restUrl.BASE_HOST + 'UpLoadFile/' + photo + '.png',
                            });
                        });
                    }

                    if (item.culture && item.culture !== '') {
                        item.culture = draftToHtml(JSON.parse(item.culture));
                    }
                    if (item.companyId === this.props.params.id) {
                        this.setState({
                            data: item,
                            fileList: photoList
                        });
                    }
                });
            }
        });
    }

    //获取公司服务信息
    getServiceList = () => {
        ajax.getJSON(getServiceListUrl, null, (data) => {
            if (data.success) {
                let backData = data.backData;
                let service = [];
                let holiday = [];
                backData.map(item => {
                    item.key = item.id;
                    if (item.companyId === this.props.params.id) {
                        if (item.service_type === '服务咨询') {
                            service.push(item);
                        } else if (item.service_type === '节日活动') {
                            holiday.push(item);
                        }
                    }
                });
                this.setState({
                    service,
                    holiday,
                });
            }
        });
    }

    showDetail = id => {
        this.context.router.push('/pub/serviceDetail/' + id);
    }

    //返回
    callback = () => {
        this.context.router.goBack();
    }

    render() {
        let {data, fileList, service, holiday, companyId} = this.state;
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={<Icon type="left"/>}
                    leftContent="返回"
                    onLeftClick={this.callback}
                >企业官网</NavBar>
                <div className='zui-content index zui-scroll-wrapper article website'>
                    <Tabs tabs={tabs}
                          initialPage={0}
                          swipeable={false}
                    >
                        <div>
                            {
                                data.culture !== '' ? (
                                    <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.culture}}></div>
                                ) : (
                                    <div className="wrap-no-data">
                                        <img src={noData}/>
                                    </div>
                                )
                            }
                        </div>
                        {
                            (companyId === '1' || companyId === '2') ? '' : (
                                <div>
                                    {
                                        service.length > 0 ? service.map(item => {
                                            return (
                                                <div key={item.key} className="list"
                                                     onClick={this.showDetail.bind(null, item.id)}>
                                                    {item.service_title}
                                                </div>
                                            )
                                        }) : (
                                            <div className="wrap-no-data">
                                                <img src={noData}/>
                                            </div>
                                        )
                                    }
                                </div>
                            )
                        }
                        <div>
                            {
                                fileList.length > 0 ? fileList.map((item, index) => {
                                    return (
                                        <div key={index} className="wrap-img">
                                            <img src={item.url}/>
                                        </div>
                                    )
                                }) : (
                                    <div className="wrap-no-data">
                                        <img src={noData}/>
                                    </div>
                                )
                            }
                        </div>
                        <div>
                            {
                                holiday.length > 0 ? holiday.map(item => {
                                    return (
                                        <div key={item.key} className="list"
                                             onClick={this.showDetail.bind(null, item.id)}>
                                            {item.service_title}
                                        </div>
                                    )
                                }) : (
                                    <div className="wrap-no-data">
                                        <img src={noData}/>
                                    </div>
                                )
                            }
                        </div>
                    </Tabs>
                </div>
            </div>
        );
    }
}

CompanyWebsite.contextTypes = {
    router: React.PropTypes.object
}

export default CompanyWebsite;
