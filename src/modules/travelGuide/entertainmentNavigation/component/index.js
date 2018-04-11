import React from 'react';
import '../index.less';

class BusInformation extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          
        };
    }

    componentWillMount() {
      
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
      let { data } = this.state;

      return (
        <div className="travelGuide">
          <div className='zui-scroll-wrapper'>
            <div className="zui-scroll">
            </div>   
          </div>
        </div>
      );
    }
}

BusInformation.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  BusInformation;
