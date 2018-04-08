import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types'
import './index.less';

class CardList extends React.Component {
    constructor(props) {
        super(props);
    }
  
    componentDidMount() {
      // const { todolist } = this.props;
      console.log('this props === ', this.props);
      // console.log('todolist === ', todolist);
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    render() {
      const { list, increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props;

      return (
        <div>
          <ul className="zui-list-unstyled card-list">
            {
              (list ? list.tabContent : []).map((item, index) => {
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
          <p>
            Clicked: {counter} times
            {' '}
            <button onClick={increment}>+</button>
            {' '}
            <button onClick={decrement}>-</button>
            {' '}
            <button onClick={incrementIfOdd}>Increment if odd</button>
            {' '}
            <button onClick={() => incrementAsync()}>Increment async</button>
          </p>
        </div>
      );
    }
}


CardList.contextTypes = {  
  router: React.PropTypes.object,
  // value: PropTypes.number.isRequired,
  // onIncreaseClick: PropTypes.func.isRequired
} 

export default CardList;
