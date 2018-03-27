import React from 'react'; 
import { Link } from 'react-router';
import { NavBar, Icon, Accordion, List } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax'; 
import '../deviceCalendar.less';

const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/dev/pjtrun/findById";
const settings = {
      weeks: ['日', '一', '二', '三', '四', '五', '六'],
      month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    };

class DeviceCalendar extends React.Component{ 
  constructor(props) {
    super(props);

    this.state = {
      common: {},
      weekday:null,
      month:null,
      backDataDay:{},
      o:[]
    };
  } 
 
  componentDidMount = () => {
    const param = {
      id: this.props.params.id
    }
    ajax.getJSON(
      findByIdUrl,
      param,
      data => {
        var backData = data.backData; 
        var year =new Date(backData.common.date).getFullYear();
        var month = new Date(backData.common.date).getMonth();
         
        this.setState({
          common: backData.common,
          backDataDay:backData.content
        });
        console.log(this.state.backDataDay); 
        let backDay = this.state.backDataDay;
        let o = this.state.o;
        for(var z=0 ; z<backDay.length; z++ ){ 
            o.push(backDay[z].day);
            this.setState({
              o:o
            }) 
        }
        console.log(o)
        this.showCalendar(year, month+1,o); 
          let td = document.getElementsByClassName('sign'); 
          console.log(td)
          for(let i=0; i<td.length; i++){
            for(let j = 0; j < backData.content.length; j++) {
              if((i+1) == backData.content[j].day) {
                  console.log(td[i+1]);  
                  let common = this.state.common;
                  console.log((common.date).substring(0,4));
                  if((common.date).substring(0,4) == 2018){
                    td[i+1].classList.add('active');
                    td[i+1].onclick = function() { 
                    window.location.href = "#/device/deviceRunDetail/"+ param.id + "/" + (i+1)
                  }   
                  } else {
                    td[i].classList.add('active');
                    td[i].onclick = function() { 
                    window.location.href = "#/device/deviceRunDetail/"+ param.id + "/" + (i+1)
                  }   
                  }
                    
              }
            }
          }
      });
  } 
// 一个月的第一天
  get_first_date = (year, month) => {
    return new Date(year, month, 1);
  } 
// 一个月的最后一天
  get_last_date = (year, month) => {
    return new Date(year, month + 1, 0);
  } 

  showCalendar = (year, month, backDay) =>{
    console.log(backDay)
    var now = new Date();
    year = year ? year : now.getFullYear();
    month = month ? month - 1 : now.getMonth();

    var firstday = this.get_first_date(year, month).getDay();//月第一天是星期几
    var lastday = this.get_last_date(year, month).getDay();//月最后一天是星期几
    var lastdate = this.get_last_date(year, month).getDate();//月最后一天的日期

    var html = '<table class="weekday"><tbody><tr>';
    for(var i in settings.weeks) {
      html += '<th>' + settings.weeks[i] + '</th>';
    }
    html += '</tr>';

    html += '<tr>';
    var d = 0;
    var space_day = 0;
    if(firstday != 0) { //如果第一天不是星期天，补上上个月日期
      var last_month_lastdate = this.get_last_date(year, month - 1).getDate();
      var last_month_last_sunday = last_month_lastdate - firstday + 1;
      space_day = last_month_lastdate - last_month_last_sunday + 1;
      for(var j = last_month_last_sunday; j <= last_month_lastdate; j++) {
        html += '<td class="no sign" >' + j + '</td>';
        d++; 
      }  
    } 
    for(var k = 1; k <= lastdate; k++) {
      var  pathname = '/device/deviceRunDetail/' + this.props.params.id + '/' + k;
      if((k + space_day) % 7 == 0 || (k + space_day - 1) % 7 == 0) { 
        html += '<td class="highlight sign" data-date = "'+k+'" >'+k+'</td>';  
      } else {
        html += '<td data-date = "'+k+'" class="sign">'+k+'</td>';
      }
  
      d++;
      if(d == 7) {
        d = 0;
        html += '</tr>';
        if(lastday != 6) {
          html += '<tr>';
        }
      } 
    }

    if(lastday != 6) { //如果最后一天不是周六，补上下个月日期
      var last_month_saturday = 6 - lastday;
      for(var l = 1; l <= last_month_saturday; l++) {
        html += '<td class="no" class="sign">' + l + '</td>';
      }
      html += '</tr>';
    }

    html += '</tbody></table>';  
    this.setState({
      weekday:html,
      month:settings.month[month]
    }) 
  } 
 // 返回
  callback = () => {
    this.context.router.goBack();
  } 
 
  render() {  
  const common= this.state.common;   
  const weekday= this.state.weekday;   
  const month= this.state.month;    
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备运行记录</NavBar>
          <div className = "deviceCalendar zui-scroll-wrapper">
            <div className = 'zui-scroll'>
              <div className="calendar">
                <div className="calendar-month">
                  <span className="calendar-date" dangerouslySetInnerHTML={{__html:this.state.month}}></span>
                </div>
                <div className="calendar-weekday">
                  <div className="calendar-weekday-title" dangerouslySetInnerHTML={{__html:this.state.weekday}}> 

                  </div>
                  <div className="record-tip">有设备运行记录单</div>
                </div>
              </div>
              <div className="total">
                <h3 className="total-header">本月合计<span>最后更新&nbsp;&nbsp;<span>{common.modifytime && common.modifytime.substring(0,10)}</span></span></h3>
                <ul className="total-list">
                  <li className="clearfix">
                    <div className="left">
                      <span>制度台日：</span><span>{common.systemDay ? common.systemDay : '0'}天</span>
                    </div>
                    <div className="left">
                      <span>完成台日数：</span><span>{common.intactDay ? common.intactDay : '0'}天</span>
                    </div>
                  </li>
                  <li className="clearfix">
                    <div className="left">
                      <span>实做台日：</span><span>{common.actualDay ? common.actualDay : '0'}天</span>
                    </div>
                    <div className="left">
                      <span>实做台时数：</span><span>{common.intactHour ? common.intactHour : '0'}时</span>
                    </div>
                  </li>
                  <li className="clearfix">
                    <div className="left">
                      <span>加班台日：</span><span>{common.overtimeDay ? common.overtimeDay : '0'}天</span>
                    </div>
                    <div className="left">
                      <span>加班台时数：</span><span>{common.overtimeHour ? common.overtimeHour : '0'}时</span>
                    </div>
                  </li>
                  <li className="clearfix percent_login">
                    <div className="left">
                      <span>完成率：</span><span className="number">{common.intactPercent ? common.intactPercent : '0'}%</span>
                    </div>
                    <div className="left">
                      <span>利用率：</span><span className="number">{common.usePercent ? common.usePercent : '0'}%</span>
                    </div>
                  </li>
                </ul> 
              </div>
            </div>
          </div>
          
      </div>
    );
  }
};

DeviceCalendar.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceCalendar;
