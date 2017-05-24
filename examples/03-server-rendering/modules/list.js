import React,{ Component,PropTypes } from 'react';
import { Link } from 'react-router';
import style from './list.css';
import iScroll from 'iscoll/build/iscroll-probe';
import $ from 'jquery';

import LoadingLayer from './LoadingLayer';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../actions';

class List extends Component{
	constructor(props,context){
		super(props,context);

		this.itemsChanged = false; //本次渲染是否发生了文章列表变化，决定iscroll是否调用refresh
		this.isTouching = false; //是否触屏中

		// 下拉状态文案
        this.pullDownTips = {
            0: '下拉发起刷新',
            1: '继续下拉刷新',
            2: '松手即可刷新',
            3: '正在刷新',
            4: '刷新成功',
            5: '刷新失败'
        };
        // 上拉状态文案
        this.pullUpTips = {
            0: '上拉发起加载',
            1: '松手即可加载',
            2: '正在加载',
            3: '加载成功',
            4: '加载失败'
        };

        this.onItemClicked = this.onItemClicked.bind(this);


        //iscroll events
        this.onScroll = this.onScroll.bind(this);
        this.onScrollEnd = this.onScrollEnd.bind(this);

        //touch events
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
	}

	componentWillMount(){//组件加载前
		//try to backup datas
		//action: LIST_TRY_BACKUP
		this.props.tryRestoreComponent();
	}

	ensureIScrollInstalled(){
		if(this.iScrollInstance){
			return this.iScrollInstance;
		}
		const options = {
			preventDefault :false,
			zoom: false,
			mouseWheel: true,
			probeType: 3,
			bounce: true,
			scrollbars:true,
		}

		this.iScrollInstance = new iScoll(`#${style.ListOutSite}`,options);
		this.iScrollInstance.on("srcoll",this.onScroll);
		this.iScrollInstance.on('srcollEnd',this.onScrollEnd);
		this.iScrollInstance.refresh();
		return this.iScrollInstance;
	}

	componentDidMount(){//组件加载成功后
		if(this.props.loadingStatus === 1){
			this.props.beginRefresh();
		}else{
			this.ensureIScrollInstalled();
			let y = this.props.y;
			if( y > -1*$(this.refs.PullDown).height()){
				y = -1 * $(this.refs.PullDown).height();
			}
			this.iScrollInstance.scrollTo(0,y);

		}
	}

	onItemClicked(ev){
		let item = $(ev.target);
		this.context.router.push(item.attr('to'));
		this.context.router.goForward();
	}

	onTouchStart(ev){
		this.isTouching = true;
	}

	onTouchEnd(ev){
		this.isTouching = false;
	}

	onPullDown(){
		if(this.isTouching){
			if(this.iScrollInstance.y > 5){
				this.props.updatePullDownStatus(2); //松手即可刷新
			}else{
				this.props.updatePullDownStatus(1); //继续下拉刷新
			}
		}
	}

	onPullUp(){
		if(this.isTouching){
			if(this.iScrollInstance.y <= this.iScrollInstance.maxScrollY - 5){
				this.props.updatePullUpStatus(1); //松手即可加载
			}else{
				this.props.updatePullUpStatus(0); //上拉发起加载
			}
		}
	}

	onScroll(){
		let pullDown = $(this.refs.PullDown);

		//判断需执行上拉加载和下拉刷新的位置
		//pull down
		if(this.iScrollInstance.y > -1*pullDown.height()){
			this.onPullDown();
		}else{
			this.props.updatePullDownStatus(0);//下拉发起刷新
		}

		if(this.iScrollInstance.y <= this.iScrollInstance.maxScrollY + 5){
			this.onPullUp();
		}else{
			this.props.updatePullUpStatus(0); //上拉发起加载
		}
	}

	onScrollEnd(){
		let pullDown = $(this.refs.PullDown);

		if(this.iScrollInstance.y > -1*pullDown.height()){
			if(this.props.pullDownStatus <= 1){ //如果还没刷新
				this.iScrollInstance.scrollTo(0,-1*$(this.refs.PullDown).height(),200);  //还原
			}else if(this.props.pullDownStatus == 2){
				this.props.beginRefresh();
			}
		}

		if(this.iScrollInstance.y <= this.iScrollInstance.maxScrollY){
			if(this.props.pullUpStatus == 1){
				this.props.beginLoad();
			}
		}
	}

	//在此之上，react提供了组件生命周期函数，shouldComponentUpdate，组件在决定重新渲染（虚拟dom比对完毕生成最终的dom后）之前会调用该函数，该函数将是否重新渲染的权限交给了开发者，该函数默认直接返回true，表示默认直接出发dom更新
	shouldComponentUpdate(nextProps,nextState){ 
		this.itemsChanged = nextProps.items !== this.props.items;
		return true;
	}

	componentDidUpdate(){//组件重新渲染后
		if(this.props.loadingStatus === 2){
			this.ensureIScrollInstalled();
			if(this.itemsChanged){
				this.iScrollInstance.refresh();
				if(this.props.pullDownStatus === 4 || this.props.pullDownStatus === 5){
					this.iScrollInstance.scrollTo(0,-1*$(this.refs.PullDown).height(),500);
				}
			}
		}
		return true;
	}

	componentWillUnMount(){
		if(this.props.loadingStatus === 2){
			this.props.backupIScollY(this.iScrollInstance.y);
		}
	}

	onRetryLoading(){
		console.log('retry loading...');
		this.props.updateLoadingStatus(1);//huifuloadingjiemian
		this.props.beginRefresh();
	}

	renderLoading(){
		let outerStyle = {
			height: window.innerHeight,
		};
		return (
			<div>
				<LoadingLayer
					outerStyle={outerStyle}
					onRetry={this.onRetryLoading.bind(this)}
					loadingStatus={this.props.loadingStatus} />
			</div>
		);
	}

	renderPage(){
		let lis = this.props.items.map((item,index)=>{
			return (
					<li key={index} to={`/msg-detail-page/${index}`} onClick={this.onItemClicked}>
						{item.title}{item}
					</li>
				)
		});

		return (
			<div>
				<div id={style.ListOutSite} style={{height:window.innerHeight}} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} >
					<ul id={style.ListInSide}>
						<p ref="PullDown" id={style.PullDown}>{this.pullDownStatus[this.props.pullDownStatus]}</p>
						{lis}
						<p ref="PullUp" id={style.PullUp}>{this.pullUpTips[this.props.pullUpStatus]}</p>
					</ul>
				</div>
			</div>	
		)
	}

	render(){
		if(this.props.loadingStatus !== 2){
			return this.renderLoading();
		}else{
			return this.renderPage();
		}
	}



}

List.contextTypes = {
	router: PropTypes.object.isRequired
}

function mapStateToProps(state,ownProps){
	return {
		items: state.ListReducer.items,
		pullDownStatus: state.ListReducer.pullDownStatus,
		pullUpStatus: state.ListReducer.pullUpStatus,
		loadingStatus: state.ListReducer.loadingStatus,
		page: state.ListReducer.page,
		y: state.ListReducer.y
	}
}

function mapDispatchToProps(dispatch){
	return bindActionCreators(actions,dispatch);
}

export default connect(mapStateToProps,mapDispatchToProps)(List);

