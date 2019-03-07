const app = getApp();
const baseShare = require('../../utils/util.js').baseShare;
const nonspecificSharePage = require('../../config.js').nonspecificSharePage;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
const getUrl = require('../../utils/util.js').getUrl;
const mathRandom = require('../../utils/util.js').mathRandom;
Page({

  data: {
    pay: {},
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  btn(){
    wx.switchTab({
      url: '../heart_design/heart_design',
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