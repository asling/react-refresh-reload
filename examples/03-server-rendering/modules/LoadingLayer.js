import React from 'react';
import $ from 'jquery';
import style from './LoadingLayer.css';

export default class LoadingLayer extends React.Component{
	constructor(props,context){
		super(props,context);
	}
	render(){
		let outerStyle = this.props.outerStyle? this.props.outerStyle: {};
		let innerStyle = this.props.innerStyle ? this.props.innerStyle : {};
		let onRetry = this.props.onRetry ? this.props.onRetry : {};
		let loadingStatus = this.props.loadingStatus ? this.props.loadingStatus : 0; // 0: wait for loading 1: isloading 2 loading ok 3: loading fail
		let loadingTips = (<span>wait to start loading</span>);
		if(loadingStatus === 1){
			loadingTips = (
				<div className={style.overlayLoader}>
					<div className={style.loader}>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				</div>
			)
		}else if (loadingStatus === 2){
			loadingTips = (<span>loading done, switch to your component.</span>);
		}else if(loadingStatus === 3){
			loadingTips = (<span>loading fail, click to retry loading.</span>);
		}

		return (
			<div id={style.outer} style={outerStyle}>
				<div id={style.inner} style={innerStyle} onClick={onRetry}>
					{loadingTips}
				</div>
			</div>
		)

	}
}

LoadingLayer.contextTypes = {
	router: React.propTypes.object.required
}
