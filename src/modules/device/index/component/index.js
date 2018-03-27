import React from 'react';
import { NavBar, Icon, Grid } from 'antd-mobile';
import '../index.less';
import contractLedgerList from 'Img/contractLedgerList.png';
import jinchang from 'Img/jinchang.png';
import qiting from 'Img/qiting.png';
import deviceAccept from 'Img/deviceAccept.png';
import keywork from 'Img/keywork.png';
import deviceCheck from 'Img/deviceCheck.png';
import deviceService from 'Img/deviceService.png';
import deviceMaintenance from 'Img/deviceMaintenance.png';
import deviceRun from 'Img/deviceRun.png';
import deviceRecord from 'Img/deviceRecord.png';

const data = [
  {
    icon: contractLedgerList,
    text: '合同台账',
    link: '/device/contractLedgerList'
  },{
    icon: jinchang,
    text: '进场通知',
    link: '/device/deviceApproachNoticeList'
  },{
    icon: qiting,
    text: '设备启停租',
    link: '/device/deviceHireList'
  },{
    icon: deviceAccept,
    text: '设备进场验收',
    link: '/device/deviceAcceptList'
  },{
    icon: keywork,
    text: '关键作业',
    link: '/device/keyWorkList'
  },{
    icon: deviceCheck,
    text: '设备检查',
    link: '/device/deviceCheckList'
  },{
    icon: deviceCheck,
    text: '设备检查(无供方)',
    link: '/device/deviceCheckListNoProvider'
  },{
    icon: deviceService,
    text: '设备维修',
    link: '/device/deviceServiceList'
  },{
    icon: deviceMaintenance,
    text: '设备保养',
    link: '/device/deviceMaintenanceList'
  },{
    icon: deviceRun,
    text: '设备运转',
    link: '/device/deviceRunList'
  },{
    icon: deviceRecord,
    text: '单机档案',
    link: '/device/deviceRecordList'
  },{
    icon: deviceRecord,
    text: '扫一扫',
    link: '/device/deviceScanDetail'
  }];

class Index extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      showWave: false
    };
  }
  
  componentDidMount() {
	 this.wave();
  }

  callback = () => {
    if(window.EnvConfig.ISDEBUG){
      this.context.router.goBack();
    }else {
      Bridge_YYPlugin.call("CommonPlugin", "closewindow");
    }
  }

  btnClick = (index) => {
    this.context.router.push(data[index].link);
  }

  // 设备项目部首页波浪动画效果
  wave = () => {
    let that = this;
    var id = this.refs.canvas_wave.id;
  	var canvas = document.getElementById(id);
		var ctx = canvas.getContext('2d');
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		//定义三条不同波浪的颜色
		var lines = ["rgba(58,193,126, 0.3)",
			"rgba(58,193,126, 0.5)",
			"rgba(58,193,126, 0.7)"
		];
		//初始角度为0
		var step = 0;

		function loop() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			step++;
			//画3个不同颜色的矩形
			for(var j = lines.length - 1; j >= 0; j--) {
				ctx.fillStyle = lines[j];
				//每个矩形的角度都不同，每个之间相差45度
				var angle = (step + j * 45) * Math.PI / 180;
				var deltaHeight = Math.sin(angle) * 50;
				var deltaHeightRight = Math.cos(angle) * 50;
				ctx.beginPath();
				ctx.moveTo(0, canvas.height / 1.2 + deltaHeight);
				ctx.bezierCurveTo(canvas.width / 2, canvas.height / 1.2 + deltaHeight - 50, canvas.width / 2, canvas.height / 1.2 + deltaHeightRight - 50, canvas.width, canvas.height / 1.2 + deltaHeightRight);
				ctx.lineTo(canvas.width, canvas.height);
				ctx.lineTo(0, canvas.height);
				ctx.lineTo(0, canvas.height / 1.2 + deltaHeight);
				ctx.closePath();
				ctx.fill();
			}
			requestAnimFrame(loop);
		}
		//如果浏览器支持requestAnimFrame则使用requestAnimFrame否则使用setTimeout
    window.requestAnimFrame = (function() {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function(callback) {
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    loop();
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
        >设备项目组管理</NavBar>
        <div className='zui-content index zui-scroll-wrapper'>
          <div className="zui-scroll">
            <Grid 
              data={data}
              columnNum={3}
              onClick={(obj, index) => this.btnClick(index)}
              renderItem={(dataItem, index) => (
                <div style={{ padding: '12.5px' }}>
                  <img src={dataItem.icon} style={{ width: '12vw', height: '12vw' }} alt="" />
                  <div style={{ color: '#333', fontSize: '14px', marginTop: '12px' }}>
                    <span>{dataItem.text}</span>
                  </div>
                </div>
              )}
            />  
          </div>   
        </div>
        <canvas ref="canvas_wave" id="canvas_wave" style={{'position': 'absolute', 'top': '0px', 'left': '0px', 'bottom': '0', 'zIndex': '1'}}></canvas>
      </div>
    );
  }
}

Index.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  Index;
