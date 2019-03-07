const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  uploadErrorInfoFn,
  getUrl,
  baseShare,
  post,
	mathRandom
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  version,
  updateHairStoreInfo,
  updateHairStoreInfoTitle,
} from '../../config.js';
Page({
  data: {
    value:'',
    no:0,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    this.setData({
      value:options.data,
      no:options.no
    })
  },
  btn(){
    if( this.data.value == '' ){
      wx.showToast({
        title: '请填写店铺名称',
        icon:'none'
      });
      return false;
    }
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
    const _this = this;
    let _data = _this.data.value;
    let para={
      userId: user_id,
      version: version,
      storeName: _data,
      storeNo: _this.data.no
    }
    post(`${updateHairStoreInfo}`,para).then(res=>{
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        uploadErrorInfoFn(`${updateHairStoreInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${updateHairStoreInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      var title = "系统通知";
      var notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  ins(e){
    this.setData({
      value:e.detail.value
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