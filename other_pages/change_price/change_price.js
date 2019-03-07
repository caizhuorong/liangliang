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
  updateHairServiceInfo,
  updateHairServiceInfoTitle,
  nonspecificSharePage
} from '../../config.js';
Page({
  data: {
    value:[],
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    this.setData({
      value:JSON.parse(options.data),
    })
  },
  input(e){
    let _data = this.data.value;
    _data[e.currentTarget.dataset.id].priceMin = e.detail.value;
    this.setData({
      value: _data
    })
  },
  inputs(e){
    let _data = this.data.value;
    _data[e.currentTarget.dataset.id].priceMin = e.detail.value;
    this.setData({
      value: _data
    })
  },
  inputss(e) {
    let _data = this.data.value;
    _data[e.currentTarget.dataset.id].priceMax = e.detail.value;
    this.setData({
      value: _data
    })
  },
  btn(){
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
    const _this = this;
    let type = true;
    let datas = [];
    _this.data.value.forEach(function (x, y) {
      if (x.priceFlag == 1 && x.priceMin != null && x.priceMin != ''  ){
        if (/^\d+(\.\d{1,2})?$/.test(x.priceMin)) {
        } else {
          type = false;
        };
      }
      if (x.priceFlag != 1 ){
        if (x.priceMax != null && x.priceMax != '' && x.priceMin != null && x.priceMin != ''  ){
          if (/^\d+(\.\d{1,2})?$/.test(x.priceMax) && /^\d+(\.\d{1,2})?$/.test(x.priceMin) ) {
          } else {
            type = false;
          }
        }else{
        }
      }
    })
    if( type ){
      _this.data.value.forEach(function (x, y) {
        if (x.priceFlag == 1) {
          datas.push({
            service: x.service,
            priceMin: x.priceMin,
            serviceLabel: x.serviceLabel,
          })
        } else {
          datas.push({
            service: x.service,
            priceMin: x.priceMin,
            priceMax: x.priceMax,
            serviceLabel: x.serviceLabel,
          })
        }
      });
      let para = {
        userId: user_id,
        version: version,
        serviceInfos: JSON.stringify(datas)
      }
      post(`${updateHairServiceInfo}`, para).then(res=>{
        if (res.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          uploadErrorInfoFn(`${updateHairServiceInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = '出错啦';
          wx.navigateTo({
            url: '../error/error?title=' + title + "&notice=" + notice,
          })
        }
        wx.hideLoading();
      }).catch(error=>{
        uploadErrorInfoFn(`${updateHairServiceInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        var title = "系统通知";
        var notice = "出错啦";
        wx.navigateTo({
          url: '../error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      })

    }else{
      wx.showToast({
        icon:'none',
        title: '请输入正确价格',
      })
    };
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