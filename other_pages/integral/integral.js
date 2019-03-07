const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import {
  uploadErrorInfoFn,
  getUrl,
  delNull,
  baseShare,
	mathRandom
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  version,
  friendSharePage,
  selectMyPointsInfo,
  selectMyPointsInfoTitle,
  exchangeHairPoints,
  exchangeHairPointsTitle,
} from '../../config.js';
Page({
  data: {
   fS:0,
   info:{},
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    curr:1,
    curr_text:'赚取积分'
  },
  exchange(e){
    let _e = e.currentTarget.dataset;
    const _this = this;
    let para = {
      version: version,
      userId: user_id,
      pointsCode: _e.id,
      points: _e.points
    }
    util.post(`${exchangeHairPoints}`, para).then(res => {
      if (res.code == 0) {
        wx.showToast({
          title: '积分兑换成功',
          icon:'none'
        })
        _this.getAjax();
      } else {
        uploadErrorInfoFn(`${exchangeHairPointsTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        return;
      };
    }).catch(e => {
      uploadErrorInfoFn(`${exchangeHairPointsTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      return;
    })
  },
  sdile_nav(e){
    const _this = this;
    let _curr = e.currentTarget.dataset.curr;
    let _curr_text = '';
    if (_curr == 1 ){
      _curr_text = '赚取积分';
    }else if( _curr == 2 ){
      _curr_text = '积分记录';
    }else{
      _curr_text ='积分兑换';
    }
    _this.setData({
      curr: _curr,
      curr_text:_curr_text
    });
  },
  onLoad: function (options) {
    user_id = wx.getStorageSync('userInfo').userId;
    console.log(options);
    this.getAjax();
  },
  //设置字体大小
  setFontSize(){
    console.log(this.data.info.points)
    let w = 70* (750/wx.getSystemInfoSync().windowWidth);
    let fLength = this.data.info.points.toString().length;
    this.setData({
      fS: w/fLength+fLength*5
    })
  },
  buttonLink(e){
    const _this = this;
    const _e = e.currentTarget.dataset;
    let json = JSON.parse(_e.url);
      if (json.type == 1) {
        if (json.level == 1) {
          if (json.param != undefined) {
            wx.setStorageSync('active_once', json.param);
          };
          wx.switchTab({
            url: json.page,
          })
        } else {
          if (json.param != undefined) {
            wx.navigateTo({
              url: json.page + json.param,
            })
          } else {
            wx.navigateTo({
              url: json.page,
            })
          }
        }
      } else if( json.type == 0 ) {

      }else{
        console.log('跳转到H5')
      }

  },
  getAjax(){
    const _this = this;
      let para = {
        version: version,
        userId: wx.getStorageSync('userInfo').userId,
      }
    util.get(`${selectMyPointsInfo}`,para).then(res=>{
      if( res.code == 0 ){
        res.info.lstPoints.forEach(function(y,x){
          y.buttonCaption = delNull(y.buttonCaption);
          y.name = delNull(y.name);
          y.label = delNull(y.label);
          y.points = delNull(y.points);
        })
        _this.setData({
          info:res.info
        },()=>{
          _this.setFontSize();
        })
      }else{
        uploadErrorInfoFn(`${selectMyPointsInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        return;
      };
    }).catch(e=>{
      uploadErrorInfoFn(`${selectMyPointsInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      return;
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    wx.showShareMenu({
      withShareTicket: false
    })
    const _this = this;
    var getAjax = new Promise(function (resolve, reject) {
      baseShare(_this,resolve);
    });
    getAjax.then(()=>{
      _this.getAjax();
    })
   
    let storageShareInfo = wx.getStorageSync('shareInfo');
    let shareTitle = storageShareInfo.otherTitle.split('|');
    let x = mathRandom(shareTitle);
    let shareImageUrl = '';
    if (storageShareInfo.otherFlag == '1') {
      shareImageUrl = storageShareInfo.otherPicture;
    } else {
      shareImageUrl = '';
    }
    return {
      title: shareTitle[x],
      path: `/pages/index/index?shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: (res) => {
      }
    }
  },
})