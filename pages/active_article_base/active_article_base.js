const app = getApp();
const version = require('../../config.js').version;
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
const h5Active = require('../../config.js').h5Active;
const setTemplateRaffle = require('../../config.js').setTemplateRaffle;
const baseShare = require('../../utils/util.js').baseShare;
const isEmpty = require('../../utils/util.js').isEmpty;
const getUrl = require('../../utils/util.js').getUrl;
import {delNull} from '../../utils/util.js';
Page({
  data: {
    userId: wx.getStorageSync('userInfo').userId,
    url: ``,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    shareTitle:'',
    showDialog:false,
    showDialogs:false,
  },
  onLoad(options){
    let userId = wx.getStorageSync('userInfo').userId != undefined ? wx.getStorageSync('userInfo').userId:options.shareUserId ;
    if(delNull(userId) != ''){
      this.setData({
        userId: userId,
      })
    }
   
    if (delNull(options.url) != '' ){
      this.setData({
        url: decodeURIComponent(options.url)
      })
    };
    if (delNull(options.shareTitle) != '' ){
      this.setData({
        shareTitle:options.shareTitle
      })
    }
    wx.setNavigationBarTitle({
      title: options.title
    })
    let s = {
      sex:1,
      typeTab:2
    }
    wx.setStorageSync('active_tab', s);
  },
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: false
    });
    const _this = this;
    let para = {
      userId: wx.getStorageSync('userInfo').userId,
      version: version,
    }
    baseShare(_this);
    var shareObj = {
      title: _this.data.shareTitle,
      desc: '拍照就能造型，为你量身打造适合你的发型',
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl:'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/sharezhuanfa20190215.png',
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  },
  onMyEvent(e){
    console.log(e);
    let userId = wx.getStorageSync('userInfo').userId != undefined ? wx.getStorageSync('userInfo').userId : options.shareUserId;
    if (delNull(userId) != '') {
      this.setData({
        userId: userId,
      })
    }
  },
  points(e){
    if (delNull(e.detail.points.points.background) == '' ){
      return false;
    }
    let banner_url = e.detail.points.points.background;
    let _show;
       
      if (wx.getStorageSync('signLayer') == 1) {
        _show = false;
      } else {
        _show = true;
      }
    
    this.setData({
      shareLayer: _show,
      layerBanner: `${banner_url}`,
      layerLabel: e.detail.points.points.prompt,
      layerTips: e.detail.points.points.points,
      code: e.detail.points.points.code
    });
  },
  onShow(){
    let s = {
      sex: 1,
      typeTab: 2
    }
    wx.setStorageSync('active_tab', s);
  },
  onUnload(){
    wx.removeStorageSync('active_tab');
  },
  onHide(){
    // wx.removeStorageSync('active_tab');
  },
  giftlayer(e){
    console.log(e);
  },
})