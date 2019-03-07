const app = getApp();
const baseShare = require('../../utils/util.js').baseShare;
const nonspecificSharePage = require('../../config.js').nonspecificSharePage;
const getUrl = require('../../utils/util.js').getUrl;
const mathRandom = require('../../utils/util.js').mathRandom;

Page({
  data: {
    title:"出错啦",
    notice:["网络不给力，请稍候重试"],
    isError:true,
    imgurl:'',
    btntitle:'',
    btnshow:true,
    },
  onLoad: function (options) {
    var title=options.title||undefined;
    var notice = options.notice || undefined;
    // notice ="是第三方第三个第四个<BR>是第三方第三个第四个<BR>是第三方第三个第四个<BR>是第三方第三个第四个<BR>"
    if (title && notice){
      notice = notice.split("<BR>");
      this.setData({
        title: title,
        notice: notice,
        isError: options.btnshow == undefined ? true : options.btnshow,
        btntitle: options.btntitle == undefined ? '返回首页' : options.btntitle,
        imgurl: options.imgurl == undefined ? 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/bmi_wrong.png' : options.imgurl,
      });
    }
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: false
    });
		baseShare(this);
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
  back:function(){
    wx.switchTab({
      url: '../../pages/index/index'
    })
  }
})