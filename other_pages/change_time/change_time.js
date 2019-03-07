const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  uploadErrorInfoFn,
  getUrl,
  baseShare,
  post
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  updateHairStylistInfo,
  updateHairStylistInfoTitle,
  version
} from '../../config.js';
Page({
  data: {
    value1:0,
    value2: 0,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    if( options.start.indexOf('-') != -1 ){
      options.start = options.start.replace('-',''); 
    }
    this.setData({
      value1:options.start,
      value2:options.end,
    })
  },
  bindTimeChange(e){
    this.setData({
      value1:e.detail.value
    })
  },
  bindTimeChanges(e){
    this.setData({
      value2: e.detail.value
    })
  },
  btn(){
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
    const _this = this;
    let para={
      userId: user_id,
      version: version,
      timeFrom: _this.data.value1,
      timeEnd: _this.data.value2
    }
    post(`${updateHairStylistInfo}`,para).then(res=>{
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      var title = "系统通知";
      var notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
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
      path: `/pages/index/index?shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  },
})