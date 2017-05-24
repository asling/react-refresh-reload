import * as const from "./actionTypes";

const initState = {
	items: [],
	pullDownStatus: 3,
	pullUpStatus: 0,
	loadingStatus: 1,
	page: 1,
	y: 0,
};

function MSG_LIST_PAGE_TRY_RESTORE_COMPONENT_reducer(state,action){
	return state;
}

function MSG_LIST_PAGE_FETCH_ITEMS_SUCCESS_reducer(state,action){
	let nextState = Object.assign({},state);
	
}