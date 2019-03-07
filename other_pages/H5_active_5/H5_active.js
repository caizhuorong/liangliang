const app = getApp();
const version = require('../../config.js').version;
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
const setTemplateRaffle = require('../../config.js').setTemplateRaffle;
const baseShare = require('../../utils/util.js').baseShare;
const isEmpty = require('../../utils/util.js').isEmpty;
const getUrl = require('../../utils/util.js').getUrl;
import {delNull} from '../../utils/util.js';
Page({
  data: {
    userId: wx.getStorageSync('userInfo').userId,
    url: wx.getStorageSync('goToH5').url,
    share:wx.getStorageSync('goToH5').share,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    giftShow: false,
    activeShow: false,
    activeInfo: {},
    giftLayerBanner: [],
    scene: "", //用来存储
    param: '',
    showDialogs: false,
    showDialog: false,
    shareLayer: false,
    layerBanner: '',
    layerLabel: '',
    layerTips: '',
    code: '',
  },
  onLoad(options){
    const _this = this;
    util.utilOnLoad(options,_this);
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('goToH5').title
    })
    if ( delNull(wx.getStorageSync('goToH5').url) != '' ){
      _this.setData({
        url: wx.getStorageSync('goToH5').url
      })
    }
    if (delNull(wx.getStorageSync('goToH5').share) != '' ){
      _this.setData({
        share: wx.getStorageSync('goToH5').share
      })
    }
  },
  onMyEvent() {
    user_id = wx.getStorageSync('userInfo').userId;
    const _this  = this;
    util.utilOnMyEvent(_this);
  },
  activelayer(e) {
    const _this = this;
    util.utilActiveLayer(e,_this);
  },
  points(e) {
    const _this = this;
    util.utilPoints(e,_this);
  },
  giftlayer(e) {
    const _this = this;
    util.utilGiftLayer(e,_this);
  },
  onShareAppMessage: function (res) {
    wx.showShareMenu({
      withShareTicket: false
    });
    const _this = this;
    baseShare(_this);
    let sharetext=[
      '了解一下！能设计发型还能每天抽奖！',
      '哈哈！今日份大礼包已到手，还不进来看看我在玩什么'
    ];
    let x = Math.round(Math.random() * 1);
    var shareObj = {
      title: sharetext[x],
      desc: '拍照就能造型，为你量身打造适合你的发型',
      path: `/pages/index/index?shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/sharezhuanfa20190215.png',
      success: function (res) { // 转发成功之后的回调
      },
    }
    if (wx.getStorageSync('goToH5').shareImg ) {
      shareObj['imageUrl'] = wx.getStorageSync('goToH5').shareImg
    }
    if (wx.getStorageSync('goToH5').shareTitle ){
      shareObj.title = wx.getStorageSync('goToH5').shareTitle
    };
    return shareObj;
  },
})