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
class DeviceHandover extends React.Component{ 
  constructor(props) {
    super(props);

    this.state = {
      year: null,
      data: [],
      common: {},
      weekday:null,
      month:null,
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
        var month = new Date(backData.common.date).getMonth()+1;
        
        this.showCalendar(year, month);

        this.setState({
          year: year,
          data: backData.content,
          common: backData.common
        });

        let td = document.getElementsByClassName('sign'); 
          console.log(td)
          for(let i=0; i<td.length; i++){
            for(let j = 0; j < backData.content.length; j++) {
              if((td[i]).getAttribute('data-date') == backData.content[j].day) {
                console.log(td[i+1]);  
                td[i].classList.add('active'); 
                  if(td[i].classList.contains('active')==true){  
                    td[i].onclick = function() { 
                      console.log(i)
                      let handoverList = document.getElementsByClassName('handover-list'); 
                      for(var n=0; n<handoverList.length; n++){
                         handoverList[n].classList.add('handover-hiden');
                         if(handoverList[n].getAttribute("data-day") == (td[i]).getAttribute('data-date')){
                            handoverList[n].classList.remove('handover-hiden')
                         }
                      }
                    }  
                  }
              }
                  //document.getElementsByClassName('handover-list').classList.add('handover-hiden');
                  //td[i].onclick = function() { 
                    // if(document.getElementsByClassName('handover-list').getAttribute('data-date')).hasClass('hidden')== backData.content[j].day){
                    //   $('.handover-list[data-day="' + num + '"]').removeClass('hidden');
                    //   $('.handover-list[data-day="' + num + '"]').show(); 
                    // } 
                   //}

              }
            }
          }
        // $('.calendar .calendar-weekday .weekday td').each(function() { 
        //     for(let i = 0; i < backData.content.length; i++) {
        //       if($(this).attr('data-date') == backData.content[i].day) {
        //         $(this).addClass('active');       
        //       }
        //     }
        //   });
        // $('.calendar .calendar-weekday .weekday td.active').on('click',function() { 
        //     var num = $(this).attr('data-date'); 
        //     $('.handover-list').addClass('hidden');
        //     if($('.handover-list[data-day="' + num + '"]').hasClass('hidden')){
        //       $('.handover-list[data-day="' + num + '"]').removeClass('hidden');
        //       $('.handover-list[data-day="' + num + '"]').show(); 
        //     } 
        //   });
    )} 
// 一个月的第一天
  get_first_date = (year, month) => {
    return new Date(year, month, 1);
  } 
// 一个月的最后一天
  get_last_date = (year, month) => {
    return new Date(year, month + 1, 0);
  } 

  showCalendar = (year, month) => {
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
        html += '<td class="no sign">' + j + '</td>';
        d++;
      }
    }
    for(var k = 1; k <= lastdate; k++) {
      var  pathname = '/device/deviceRunDetail/' + this.props.params.id + '/' + k;
      if((k + space_day) % 7 == 0 || (k + space_day - 1) % 7 == 0) {
        html += '<td class="highlight sign" data-date = "'+k+'">'+k+'</td>';
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
        html += '<td class="no sign">' + l + '</td>';
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
  const {data,common}= this.state;  
  const weekday= this.state.weekday;   
  const month= this.state.month;
  const row = {};                                       
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备交接班</NavBar>
          <div className = "deviceCalendar zui-scroll-wrapper">
            <div className = 'zui-scroll'>
              <div className="calendar">
                <div className="calendar-month">
                  <span className="calendar-date" dangerouslySetInnerHTML={{__html:this.state.month}}></span>
                </div>
                <div className="calendar-weekday">
                  <div className="calendar-weekday-title" dangerouslySetInnerHTML={{__html:this.state.weekday}}> 
                  </div>
                  <div className="record-tip">有交接班记录</div>
                </div>
              </div>
              <div >
                {
                  (data ? data : []).map(function(dataItem,index1){  
                    return  <ul key = {index1} className = "handover-list handover-hiden" data-day = {dataItem.day}>
                        {
                          (dataItem.shiftArr ? dataItem.shiftArr : []).map(function(item,index2){
                         return (item.id == null) ?  null :(
                            <li key = {index2} className="mylist">
                              <Link to ={{pathname: '/device/deviceHandoverRecord/' + item.id + '/' + dataItem.day}}>
                                  <div className="login">
                                    <div className="clearfix"><span className = "class" style = {{backgroundColor: (item.shift==1) ? '#B17FFC' : ((item.shift==2) ? '#3DC14C' : '#F7C001')}}>{(item.shift ===1) ? 'Ⅰ班' : ((item.shift === 2) ? 'Ⅱ班' : 'Ⅲ班')}</span>
                                      <span>交接时间：<span>{item.shiftDate}</span></span>
                                    </div>
                                    <div className="exchange clearfix">
                                      <div>项目编号：<span>{item.projectId}</span></div>
                                      <div>统一编号：<span>{item.spotId}</span></div>
                                      <div>使用单位：<span>{item.hireComp}</span></div>
                                      <div>班长：<span>{item.respUsername}</span></div>
                                    </div>
                                  </div>
                               </Link>
                            </li>
                             )                          
                          })
                        }
                      </ul>
                  })
                }
              </div>
            </div>
          </div>
      </div>
    );
  }
};

DeviceHandover.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceHandover;
