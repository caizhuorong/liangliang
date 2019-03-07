const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const util  = require('../../utils/util.js');
let template = require('../../component/template/template.js');
import { uploadErrorInfoFn, delNull, getUrl, numto, baseShare,mathRandom  } from '../../utils/util.js';
import { version, saveFormId, saveFormIdTitle, nonspecificSharePage, getAnalyzeResult, getAnalyzeResultTitle, selectMinePageContents, selectMinePageContentsTitle } from '../../config.js';
Page({
  data: {
    info:{
      totalCount:0,
      usedCount:0,
    },
    followCount:0,
    praiseCount:0,
    fansCount:0,
    aishow:true,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  closeTips(){
    this.setData({
      tips_type:false
    })
  },
  onTabItemTap(item) {
    if (delNull(wx.getStorageSync('userInfo').userId) == '' || delNull(wx.getStorageSync('userInfo').sex) == '' ){
      wx.reLaunch({
        url: '../../pages/welcome/welcome',
      })
    }
  },
  templateClick(e) {
    let para = {
      userId: user_id,
      version: version,
      smallprogramNo: smallProgramNo,
      formId: e.detail.formId
    };
    util.post(`${saveFormId}`, para).then(res => {
     
    }).catch(error => {
      uploadErrorInfoFn(`${saveFormIdTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
    })
  },
  gotofriend(){
    wx.navigateTo({
      url: '../friend/friend',
    })
  },
  gotoAi() {
    wx.removeStorageSync('detailtodesign');
    wx.removeStorageSync('chooseHeart');
    if (wx.getStorageSync('lookphoneToAi').info.newFlag ){
      wx.setStorageSync('aifn',true)
      wx.navigateTo({
        url: '../test/test?from=user',
      })
    }else{
      wx.navigateTo({
        url: '../AIanalysis/AIanalysis?from=user',
      })
    }
   
  },
  goToIntegral(){
    wx.navigateTo({
      url: '../../other_pages/integral/integral',
    })
  },
  goTosetting(){
    wx.openSetting();
  },
  gotoCard(){
    wx.navigateTo({
      url: '../../other_pages/card/card',
    })
  },
  gotocenters(){
    let data = this.data.info.isStylist == 2 || this.data.info.isStylist == 0 ? 0 : 1;
    wx.navigateTo({
      url: '../../others_pages/heart_center/heart_center?isStylist=' + data + '&id=' + this.data.info.sHairUserStylist.userId,
    })
  },
  goToConsumption(){
    wx.navigateTo({
      url: '../consumption/consumption',
    })
  },
  tatos(){
    wx.showToast({
      title: '正在审核中，请稍候~',
      icon:'none'
    })
  },
  gotofans(){
    wx.navigateTo({
      url: '../fans/fans?userId='+wx.getStorageSync('userInfo').userId,
    })
  },
  gotofollow(){
    wx.navigateTo({
      url: '../follow/follow?userId='+wx.getStorageSync('userInfo').userId,
    })
  },
  onShow: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
  
		let para={
			userId: user_id,
			version: version
		}
		util.get(`${selectMinePageContents}`,para).then(res=>{
			if (res.code == 0) {
			  if (res.info.sHairUserStylist == undefined ){
			    res.info.sHairUserStylist = res.info.userResp.user;
			  }else{
			    res.info.sHairUserStylist = res.info.sHairUserStylist.user;
			  }
			  _this.setData({
			    tips_type: res.info.isStylist == '0' ? true:false,
			    info: res.info,
			    followCount: res.info.followCount == null ? '0' : numto(res.info.followCount),
			    praiseCount: res.info.praiseCount == null ? '0' : numto(res.info.praiseCount),
			    fansCount: res.info.fansCount == null ? '0' : numto(res.info.fansCount),
			    points: res.info.points == null ? '0' : numto(res.info.points),
			    couponCount: res.info.couponCount == null ? '0' : numto(res.info.couponCount),
			    couponIsRead: res.info.couponIsRead
			  })
			} else {
        uploadErrorInfoFn(`${selectMinePageContentsTitle}`, `event:进页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${selectMinePageContentsTitle}`, `event:进页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
		util.get(`${getAnalyzeResult}`,para).then(res=>{
			var data = res;
			var code = data.code;
			if (code == 0) {
				_this.setData({
					aishow: true,
				})
        wx.setStorageSync('lookphoneToAi', data);
			} else if (code == 2002) {
				_this.setData({
					aishow: false,
				})
			} else {
        uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:进页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
				let notice = '出错啦';
				wx.navigateTo({
					url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
			}
			wx.hideLoading();
			wx.stopPullDownRefresh();
		}).catch(error=>{
      uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:进页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			wx.hideLoading();
			let title = "系统通知";
			let notice = '出错啦';
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
		})
  },
  gotocenter (){
    let data = this.data.info.isStylist == 2 || this.data.info.isStylist == 0 ? 0 : 1;
    console.log(data);
    wx.navigateTo({
      url: '../user_center/user_center?data=' + data,
    })
  },
  onLoad(){
    wx.hideTabBar();
    user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    template.tabbar("tabBar", 3, _this);
		let para={
			userId:user_id,
			version: version
		}
		util.get(`${getAnalyzeResult}`,para).then(res=>{
			var data = res;
			var code = data.code;
			if (code == 0) {
        wx.setStorageSync('lookphoneToAi', data);
			} else if (code == 2002) {
				_this.setData({
					aishow:false,
				})
			} else {
        uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:进页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				let title = "系统通知";
				let notice = '出错啦';
				wx.navigateTo({
					url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
			}
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:进页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			wx.hideLoading();
			let title = "系统通知";
			let notice = '出错啦';
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
		})
  },
  onPullDownRefresh(){
    const _this = this;
		let para={
			userId: user_id,
			version: version
		}
		util.get(`${getAnalyzeResult}`,para).then(res=>{
		  var data = res;
			var code = data.code;
			if (code == 0) {
				_this.setData({
					aishow: true,
				})
        wx.setStorageSync('lookphoneToAi', data);
			} else if (code == 2002) {
				_this.setData({
					aishow: false,
				})
			} else {
        uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:下拉请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
				let notice = '出错啦';
				wx.navigateTo({
					url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
			}
			wx.hideLoading();
			wx.stopPullDownRefresh();
		}).catch(error=>{
      uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:下拉请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			wx.hideLoading();
			let title = "系统通知";
			let notice = '出错啦';
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
		})
  },
  gotorzheartman() {
    wx.navigateTo({
      url: `../user_center/user_center?data=2&type=1&from=user`,
    })
  },
  goToabout(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  goTomyHeart(){
    wx.navigateTo({
      url: '../my_heart/my_heart',
    })
  },
  goTofeedback(){
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: false
    });
    const _this = this;
    baseShare(_this);
    let storageShareInfo = wx.getStorageSync('shareInfo');
    let shareTitle = storageShareInfo.otherTitle.split('|');
    let x = mathRandom(shareTitle);
    let shareImageUrl = '';
    if (storageShareInfo.otherFlag == '1') {
      shareImageUrl = storageShareInfo.otherPicture;
    } else {
      shareImageUrl = '';
    }
    var shareObj = {
      title: shareTitle[x],
      desc: '拍照就能造型，为你量身打造适合你的发型',
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  },
})