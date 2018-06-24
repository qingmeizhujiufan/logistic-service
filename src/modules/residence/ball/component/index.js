import React from 'react';
import {Link} from 'react-router';
import {Button, Flex, WingBlank, WhiteSpace, Toast, NavBar, Icon} from 'antd-mobile';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import '../index.less';
import noData from 'Img/no-data.png';

const getGymDetailUrl = restUrl.ADDR + 'Survey/getGymDetailByType';

const companyData = [3, 4, 5];

class Residence extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '场馆信息',
            data: {
                ball_content: ''
            }
        };
    }

    componentWillMount() {
        const id = this.props.params.id;
        let title;
        if(id === '1') title = '羽毛球馆';
        else if(id === '2') title = '足球场';
        else if(id === '3') title = '篮球馆';
        else if(id === '4') title = '台球室';
        else if(id === '5') title = '乒乓球馆';
        else if(id === '6') title = '健身馆';
        else if(id === '7') title = '瑜伽馆';
        else if(id === '8') title = '网球场';

        this.setState({
            title,
        });
    }

    componentDidMount() {
        this.getGymDetail();
    }

    //获取球馆详情
    getGymDetail = (id) => {
        let param = {};
        param.type = this.props.params.id;
        Toast.loading('正在加载...', 0);
        ajax.getJSON(getGymDetailUrl, param, (data) => {
            if (data.success) {
                data = data.backData;
                if (data.ball_content && data.ball_content !== '') {
                    data.ball_content = JSON.parse(data.ball_content);
                    data.contentHtml = draftToHtml(data.ball_content);
                    console.log('contentHtml === ', data.contentHtml);
                    this.setState({
                        data
                    });
                }
            }
            Toast.hide();
        });
    }

    btnClick = (url) => {
        this.context.router.push(url);
    }

    //返回
    callback = () => {
        this.context.router.push('/?id=2');
    }

    render() {
        let {title, data} = this.state;
        return (
            <div className="">
                <NavBar
                    mode="light"
                    icon={<Icon type="left"/>}
                    leftContent="返回"
                    onLeftClick={this.callback}
                >{title}</NavBar>
                <div className='zui-content zui-scroll-wrapper article'>
                    {
                        data.ball_content !== '' ? (
                            <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.contentHtml}}></div>
                        ) : (
                            <div className="wrap-no-data">
                                <img src={noData}/>
                            </div>
                        )
                    }
                </div>
            </div>
        );
    }
}

Residence.contextTypes = {
    router: React.PropTypes.object
}

export default Residence;
