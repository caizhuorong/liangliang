const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  get,
  post,
  getUrl,
  baseShare,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  updateHairStylistInfo,
  updateHairStylistInfoTitle,
  updateUserInfo,
  updateUserInfoTitle,
  nonspecificSharePage,
} from '../../config.js';
Page({
  data: {
    value:'',
    isStylist:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    this.setData({
      value:options.data,
      isStylist: options.isStylist
    })
  },
  changvalue(e){
    this.setData({
      value:e.detail.value
    })
  },
  btn(){
    var _this = this;
    if (_this.data.value == ''){
      wx.showToast({
        title: '请填写昵称',
        icon:'none'
      })
      return false;
    }
    wx.showLoading({
      title: '加载中',
			mask:true
    })
    let url='';
    let urlTitle = '';
    let datas = {
      userId: user_id,
      version: version,
      nick: _this.data.value,
    };
    if (_this.data.isStylist == 0 ){
      url = updateUserInfo;
      urlTitle = updateUserInfoTitle;
      datas['personId'] = wx.getStorageSync('userInfo').personId
    }else{
      url = updateHairStylistInfo;
      urlTitle = updateHairStylistInfoTitle;
    }
		post(`${url}`,datas).then(res=>{
			var code = res.code;
			if (code == 0) {
			  wx.navigateBack({
			    delta:1
			  })
			}else{
        uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datas)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice ='出错啦';
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
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  },
})