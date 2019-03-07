const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  getUrl,
  baseShare,
  uploadErrorInfoFn,
  get,
  post,
	mathRandom
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  version,
  updateUserInfo,
  updateUserInfoTitle,
  updateHairStylistInfo,
  updateHairStylistInfoTitle
} from '../../config.js';
Page({
  data: {
    num:0,
    value:'',
    isStylist: '',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    _this.setData({
      value:options.data,
      isStylist: options.isStylist
    })
  },
  val(e){
    this.setData({
      num:e.detail.cursor,
      value: e.detail.value
    })
  },
  btn(){
    const _this = this;
    wx.showLoading({
      title: '加载中...',
			mask:true
    })
    let url = '';
    let urlTitle = '';
    let datas = {
      userId: user_id,
      version: version,
      sign: _this.data.value == '' ? ' ':_this.data.value,
    };
    if (_this.data.isStylist == 0) {
      url = updateUserInfo;
      datas['personId'] = wx.getStorageSync('userInfo').personId;
      urlTitle = updateUserInfoTitle;
    } else {
      url = updateHairStylistInfo;
      urlTitle = updateHairStylistInfoTitle;
    }
    post(`${url}`,datas).then(res=>{
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datas)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datas)};errorinfo:${JSON.stringify(error)}`);
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
      path: `/pages/index/index?shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
       
      },
    }
    return shareObj;
  },
})