import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';

//ui component
class Counter extends Component{
	render(){
		const { value, onIncreseClick } = this.props;
		return (
			<div>
				<span>{value}</span>
				<button onClick={onIncreseClick}>Increase</button>
			</div>
		)
	}
};

Counter.propTypes = {
		value: PropTypes.number.isRequired,
		onIncreseClick:PropTypes.func.isRequired,
};

//Action
const increaseAction = { type: 'increase'};

//Reducer
function couter(state = { count : 0}, action){
	const count = state.count;
	switch (action.type){
		case "increase":
			return { count : count + 1}
		default:
			return state
	}
}

//Store
const store = createStore(couter);

//redux state to component props
function mapStateToProps(state){
	return {
		value: state.count,
	}
}

//redux actions to component props
function mapDispatchToProps(dispatch){
	return {
		onIncreseClick: ()=> dispatch(increaseAction)
	}
}

const App = connect(mapStateToProps,mapDispatchToProps)(Counter);

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('root')
);






