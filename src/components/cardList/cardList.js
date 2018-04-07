import React from 'react';
import { Link } from 'react-router';
import './cardList.less';

class CardList extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: this.props.list
        };
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
      let { data } = this.state;

      return (
        <ul className="zui-list-unstyled card-list">
          {
            data.tabContent.map((item, index) => {
              return (
                <li key={index}>
                  <Link to={item.path}>
                    <div className="wrap-img">
                      <img src={item.preview} />
                    </div>
                    <div className="title">{item.title}</div>
                    <div className="desc">{item.desc}</div>
                  </Link>
                </li>
              )
            })
          }
        </ul>
      );
    }
}

CardList.contextTypes = {  
    router:React.PropTypes.object  
} 

export default  CardList;
