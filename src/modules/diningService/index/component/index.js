import React from 'react';
import { NavBar, Tabs, Card, WingBlank, WhiteSpace } from 'antd-mobile';
import '../index.less';
//引入图片
import todayMenu from 'Img/today-menu.jpg';

const tabs = [
  { title: '就餐指南' },
  { title: '企业官网' }
];

class Index extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
        };
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
        return (
          <div>
            <NavBar
              mode="light"
            >就餐服务</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                  <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                  >
                    <div>
                        <WingBlank size="lg">
                            <WhiteSpace size="lg" />
                            <Card onClick={() => this.btnClick('/diningService/todayMenu')}>
                                <Card.Header
                                  title="今日菜单"
                                  thumb={todayMenu}
                                />
                                <Card.Body>
                                  <div>丰盛的饭菜，绝对吊足你们的胃口，快来看看吧~</div>
                                </Card.Body>
                            </Card>
                        </WingBlank>
                        <WingBlank size="lg">
                            <WhiteSpace size="lg" />
                            <Card onClick={() => this.btnClick('/diningService/canteenPicture')}>
                                <Card.Header
                                  title="食堂画面"
                                  thumb={todayMenu}
                                />
                                <Card.Body>
                                  <div>一睹干净、卫生的食堂吧~</div>
                                </Card.Body>
                            </Card>
                        </WingBlank>
                        <WingBlank size="lg">
                            <WhiteSpace size="lg" />
                            <Card>
                                <Card.Header
                                  title="满意度调查"
                                  thumb={todayMenu}
                                />
                                <Card.Body>
                                  <div>一睹干净、卫生的食堂吧~</div>
                                </Card.Body>
                            </Card>
                        </WingBlank>
                        <WingBlank size="lg">
                            <WhiteSpace size="lg" />
                            <Card>
                                <Card.Header
                                  title="健康饮食"
                                  thumb={todayMenu}
                                />
                                <Card.Body>
                                  <div>一睹干净、卫生的食堂吧~</div>
                                </Card.Body>
                            </Card>
                        </WingBlank>
                        <WingBlank size="lg">
                            <WhiteSpace size="lg" />
                            <Card>
                                <Card.Header
                                  title="失误招领"
                                  thumb={todayMenu}
                                />
                                <Card.Body>
                                  <div>一睹干净、卫生的食堂吧~</div>
                                </Card.Body>
                            </Card>
                        </WingBlank>
                        <WhiteSpace size="lg" />
                    </div>
                    <div>
                      Content of second tab
                    </div>
                  </Tabs>
              </div>   
            </div>
          </div>
        );
    }
}

Index.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  Index;
