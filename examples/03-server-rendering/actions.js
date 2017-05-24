import * as consts from './actionTypes';
import $ from 'jquery';

/**
	@returns {{type}}
*/
export function tryRestoreComponent(){
	return {
		type: consts.MSG_LIST_PAGE_TRY_RESTORE_COMPONENT
	}
}

function _fetchItems(page,dispatch){
	setTimeout(()=>{
		$.ajax({
			url:'test/msg-list',
			data:{page:page},
			type:'GET',
			dataType:'json',
			success: (response)=>{
				dispatch({
					type:consts.MSG_LIST_PAGE_FETCH_ITEMS_SUCCESS,
					items:response.data.items,
					page:page,
				})
			},
			error: ()=>{
				dispatch({
					type: consts.MSG_LIST_PAGE_FETCH_ITEMS_FAIL,
					page:page,
				})
			}
		})
	},500);
}

//发起刷新
export function beginRefresh(){
	return (dispatch)=>{
		dispatch({
			type:consts.MSG_LIST_PAGE_UPDATE_PULLDOWN_STATUS,
			nextPullDownStatus:3,
		});
		_fetchItems(1,dispatch);
	}
}

//发起加载更多
export function beginLoad(){
	return (dispatch,getState)=>{
		dispatch({
			type:consts.MSG_LIST_PAGE_UPDATE_PULLUP_STATUS,
			nextPullUpStatus:2,
		});
		_fetchItems(getState().ListReducer.page,dispatch);
	}
}

//更新loading状态
export function updateLoadingStatus(nextStatus){
	return {
		type:consts.MSG_LIST_PAGE_UPDATE_LOADING_STATUS,
		nextStatus:nextStatus,
	}
}

//更新下拉状态
export function updatePullDownStatus(nextPullDownStatus){
	return {
		type:consts.MSG_LIST_PAGE_UPDATE_PULLDOWN_STATUS,
		nextPullDownStatus:nextPullDownStatus,
	}
}

//更新上拉状态
export function updatePullUpStatus(nextPullUpStatus){
	return {
		type:consts.MSG_LIST_PAGE_UPDATE_PULLUP_STATUS,
		nextPullUpStatus:nextPullUpStatus,
	}
}

//备份y轴
export function backupIScrollY(y){
	return {
		type:const.MSG_LIST_PAGE_BACKUP_ISCROLL_Y,
		y: y,
	}
}







