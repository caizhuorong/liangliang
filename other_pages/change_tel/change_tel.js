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
  updateHairStylistInfo,
  updateHairStylistInfoTitle,
  version,
} from '../../config.js';
Page({
  data: {
    value:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    this.setData({
      value:options.data
    })
  },
  btn(){
    const _this = this;
    let _data = _this.data.value;
    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;	//电话	
    var phone = _data;	
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon:'none'
      })
      return false;	
    }else{
			wx.showLoading({
				title:'加载中...',
				mask:true
			})
      let para = {
        userId: user_id,
        version: version,
        telephone: _this.data.value
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
            url: '../error/error?title=' + title + "&notice=" + notice,
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
    }
  },
  ins(e){
    this.setData({
      value:e.detail.value
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