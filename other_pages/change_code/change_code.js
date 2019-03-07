const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  baseShare,
  getUrl,
  get,
  post,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  version,
  uploadWeChatQRCodeFile,
  uploadWeChatQRCodeFileTitle,
} from '../../config.js';
Page({
  data: {
    url:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    this.setData({
      url:options.data
    })
  },
  upload(){
    const _this = this;
    wx.chooseImage({ 
      count: 1, // 默认9      
      sizeType: ['compressed', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有      
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有      
      success: function (res) {        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片        
        var tempFilePaths = res.tempFilePaths;        
        _this.setData({
          url: tempFilePaths
        })     
      }
    })  
  },
  btn(){
    const _this = this;
    wx.showLoading({
      title: '二维码上传中...',
      mask:true
    })
    let para = {
      userId: user_id,
      version: version,
      personId: wx.getStorageSync('userInfo').personId,
    };
    wx.uploadFile({
      url: uploadWeChatQRCodeFile,      //此处换上你的接口地址          
      filePath: _this.data.url[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data",
      },
      formData: para,
      success: function (res) {
        let data = res.data;
        data = JSON.parse(data);
        if (data.code == 0 ){
          wx.navigateBack({
            delta:1
          })
        }else{
          uploadErrorInfoFn(`${uploadWeChatQRCodeFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(data)}`);
          let title = "系统通知";
          let notice = '出错啦';
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        }
        wx.hideLoading();
      },
      fail: function (error) {
        uploadErrorInfoFn(`${uploadWeChatQRCodeFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        });
        wx.hideLoading();
      },
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