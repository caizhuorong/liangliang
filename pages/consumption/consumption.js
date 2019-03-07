const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
import {
  version,
  selectConsumptionList,
  selectConsumptionListTitle,
  nonspecificSharePage
} from '../../config.js';
import {
  getUrl,
  delNull,
  baseShare,
  numto,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    list: [],
    isnolist:false,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  btn() {
    wx.navigateTo({
      url: '../release/release',
    })
  },
  onShow: function () {
    this.getAjax();
  },
  getAjax() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const _this = this;
		let para={
			userId: wx.getStorageSync('userInfo').userId,
			version: version
		};
		util.get(`${selectConsumptionList}`,para).then(res=>{
			if (res.code == 0) {
			  let data = [];
			  _this.setData({
			    list: res.info.list,
			  });
			} else if (res.code == 2002) {
			  _this.setData({
			    list: [],
			    isnolist: true
			  })
			} else {
        uploadErrorInfoFn(`${selectConsumptionListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			};
			wx.stopPullDownRefresh();
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${selectConsumptionListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			wx.hideLoading();
			wx.navigateTo({
			  url: '../../other_pages/error/error',
			})
		})
  },
  onPullDownRefresh: function () {
    this.getAjax();
  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: false
    })
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
  }
})