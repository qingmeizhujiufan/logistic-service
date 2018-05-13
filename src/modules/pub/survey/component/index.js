import React from 'react';
import { NavBar, Icon, List, Radio, InputItem, TextareaItem, Toast, Button, WhiteSpace, WingBlank } from 'antd-mobile';
import restUrl from 'RestUrl';
import ajax from 'Utils/ajax';
import '../index.less';

const RadioItem = Radio.RadioItem;
const data = [
      { value: 0, label: '满意' },
      { value: 1, label: '一般' },
      { value: 2, label: '差' },
    ];
const addSurveyUrl = restUrl.ADDR + 'survey/saveSurvey';

class Survey extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          loading: false,
          value: 0,
          dish: 0,
          clean: 0
        };
    }
  
    componentDidMount() {
    }

    onCheckChange = (value) => {
      this.setState({
        value,
      });
    }

    onDishChange = (dish) => {
      this.setState({
        dish,
      });
    }

    onCleanChange = (clean) => {
      this.setState({
        clean,
      });
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    }

    submitSurvey = () => {
      const { value, dish, clean } = this.state;

      let param = {};
      param.companyId = this.props.params.id;
      param.satisfaction = data[value].label;
      param.dish = data[dish].label;
      param.clean = data[clean].label;
      this.setState({
        loading: true
      });
      ajax.postJSON(addSurveyUrl, JSON.stringify(param), data => {
        this.setState({
          loading: false
        });
        Toast.success('谢谢您的建议', 1.5);
        setTimeout(() => {
          this.context.router.goBack();
        }, 1000);
      });
    }

    render() {
        let {loading, value, dish, clean} = this.state;

        return (
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >满意度调查</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                  <List renderHeader={() => '服务'}>
                    {data.map(i => (
                      <RadioItem key={i.value} checked={value === i.value} onChange={() => this.onCheckChange(i.value)}>
                        {i.label}
                      </RadioItem>
                    ))}
                  </List>
                  {
                    this.props.params.id === '1' || this.props.params.id === '2' ? (
                      <List renderHeader={() => '菜品'}>
                        {data.map(i => (
                          <RadioItem key={i.value} checked={dish === i.value} onChange={() => this.onDishChange(i.value)}>
                            {i.label}
                          </RadioItem>
                        ))}
                      </List>
                    ) : null
                  }              
                  <List renderHeader={() => '卫生'}>
                    {data.map(i => (
                      <RadioItem key={i.value} checked={clean === i.value} onChange={() => this.onCleanChange(i.value)}>
                        {i.label}
                      </RadioItem>
                    ))}
                  </List>
                  
                  <WhiteSpace />
                  <WhiteSpace />
                  <WhiteSpace />
                  <WingBlank>
                    <Button type="primary" onClick={this.submitSurvey} loading={loading}>提交</Button>
                  </WingBlank>
                  <WhiteSpace />
                  <WhiteSpace />
                  <WhiteSpace />
                  <WhiteSpace />
                  <WhiteSpace />
                  <WhiteSpace />
              </div>   
            </div>
          </div>
        );
    }
}

Survey.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  Survey;
