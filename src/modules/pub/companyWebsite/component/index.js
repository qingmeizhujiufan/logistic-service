import React from 'react';
import { NavBar, Icon, Card, WingBlank, WhiteSpace, Tabs } from 'antd-mobile';
import '../index.less';

import ajax from 'Utils/ajax';
import restUrl from 'RestUrl';
import draftToHtml from 'draftjs-to-html';

//获取公司信息
const getCompanyListUrl = restUrl.ADDR + 'company/GetCompanyList';
//获取公司服务信息
const getServiceListUrl = restUrl.ADDR + 'company/GetServiceList';

const tabs = [
  { title: '企业文化' },
  { title: '服务咨询' },
  { title: '企业相册' },
  { title: '节日活动' }
];

class CompanyWebsite extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: {},
            service: [],
            holiday: [],
            fileList: [],
            loading: false
        };
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
                    if(photos[0] !== ''){
                        photos.map(photo => {
                            photoList.push({
                                url: restUrl.BASE_HOST + 'UpLoadFile/' + photo + '.png',
                            });
                        });
                    }

                    if(item.culture && item.culture !== '') {
                        item.culture = draftToHtml(JSON.parse(item.culture));
                    }
                    if(item.companyId === this.props.params.id) {
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
                    if(item.companyId === this.props.params.id){
                        if(item.service_type === '服务咨询'){
                            service.push(item);
                        }else if(item.service_type === '节日活动'){
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
        let { data, fileList, service, holiday } = this.state;
        return (
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >企业官网</NavBar>
            <div className='zui-content index zui-scroll-wrapper website'>
              <div className="zui-scroll">
                <Tabs tabs={tabs}
                  initialPage={0}
                  onChange={(tab, index) => { console.log('onChange', index, tab); }}
                  onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                  <div>
                    <div className="wrap-html" dangerouslySetInnerHTML={{__html: data.culture}}></div> 
                  </div>
                  <div>
                    {
                        service.map(item => {
                            return (
                                <div key={item.key} className="list" onClick={this.showDetail.bind(null, item.id)}>
                                    {item.service_title}
                                </div>
                            )
                        })
                    }
                  </div>
                  <div>
                    {
                        fileList.map((item, index) => {
                            return (
                                <div key={index} className="wrap-img">
                                    <img src={item.url} />
                                </div>
                            )
                        })
                    }
                  </div>
                  <div>
                    {
                        holiday.map(item => {
                            return (
                                <div key={item.key} className="list" onClick={this.showDetail.bind(null, item.id)}>
                                    {item.service_title}
                                </div>
                            )
                        })
                    }
                  </div>
                </Tabs>
              </div>   
            </div>
          </div>
        );
    }
}

CompanyWebsite.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  CompanyWebsite;
