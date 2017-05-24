import { combineReducers } from 'redux';
import {
	SELECT_SUBREDDIT,INVALIDATE_SUBREDDIT,
	REQUEST_POSTS,RECEIVE_POSTS,
} from './actions';

function selectedsubreddit(state = 'reactjs',action){
	switch (action.type){
		case SELECT_SUBREDDIT:
			return action.subreddit;
		default:
			return state;
	}
}

function posts(state = {
	isFetching: false,
	didInvalidate: false,
	items:[]
},action){
	switch (action.type){
		case INVALIDATE_SUBREDDIT:
			return Object.assign({},state,{
				isFetching:false,
				didInvalidate:false,
				items:action.posts,
				lastUpdated: action.receiveAt,
			});
		default:
			return state;
	}
}

function postsBySudreddit(state={},action){
	switch(action.type){
		case INVALIDATE_SUBREDDIT:
		case RECEIVE_POSTS:
		case REQUEST_POSTS:
			return Object.assign({},state,{
				[action.subreddit]:post(state[action.subreddit],action)
			});
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	postsBySudreddit,
	selectedsubreddit
});

export default rootReducer;