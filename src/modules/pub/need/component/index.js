import React from 'react';
import { NavBar, Icon, List, InputItem, TextareaItem, Toast, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';

const saveNeedUrl = restUrl.ADDR + 'survey/saveNeed';

class Need extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          loading: false,
          value: 0,
          hasError: false,
          telephone: '',
          suggestion: ''
        };
    }
  
    componentDidMount() {
    }

    onCheckChange = (value) => {
      console.log('checkbox');
      this.setState({
        value,
      });
    }

    onErrorClick = () => {
      if (this.state.hasError) {
        Toast.info('Please enter 11 digits');
      }
    }

    onChange = (telephone) => {
      if (telephone.replace(/\s/g, '').length < 11) {
        this.setState({
          hasError: true,
        });
      } else {
        this.setState({
          hasError: false,
        });
      }
      this.setState({
        telephone,
      });
    }

    onSugChange = (suggestion) => {
      this.setState({
        suggestion,
      });
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    }

    submitNeed = () => {
      const { hasError, value, telephone, suggestion } = this.state;
      if(hasError){
        Toast.info('请完善手机信息');
        return;
      }
      let param = {};
      param.companyId = this.props.params.id;
      param.telephone = telephone;
      param.suggestion = suggestion;
      this.setState({
        loading: true
      });
      ajax.postJSON(saveNeedUrl, JSON.stringify(param), data => {
        this.setState({
          loading: false
        });
        Toast.success('谢谢!', 2);
        setTimeout(() => {
          this.context.router.goBack();
        }, 1000);
      });
    }

    render() {
        let {loading, value, telephone} = this.state;

        return (
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >提出你的需求</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                  <List renderHeader={() => '填写您的电话信息'}>
                    <InputItem
                      type="phone"
                      placeholder="输入您的电话号码..."
                      error={this.state.hasError}
                      onErrorClick={this.onErrorClick}
                      onChange={this.onChange}
                      value={telephone}
                    >手机号码</InputItem>
                  </List>
                  <List renderHeader={() => '输入您想要的服务'}>
                    <TextareaItem
                      rows={5}
                      count={200}
                      onChange={this.onSugChange}
                    />
                  </List>
                  <WhiteSpace />
                  <WhiteSpace />
                  <WhiteSpace />
                  <WingBlank>
                    <Button type="primary" onClick={this.submitNeed} loading={loading}>提交</Button>
                  </WingBlank>
              </div>   
            </div>
          </div>
        );
    }
}

Need.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  Need;
