import WeCropper from '../../we-cropper/we-cropper.js'
const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const height = device.windowHeight - 50;
import {
  getUrl,
  baseShare,
  get,
  post,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  version,
  uploadStylistHeadImgFile,
  uploadStylistHeadImgFileTitle,
  uploadUserHeadImgFile,
  uploadUserHeadImgFileTitle
} from '../../config.js';
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300,
      }
    },
		shareLayer:false,
    layerBanner:'',
    layerLabel:'',
    layerTips:'',
    type:0,
    isStylist:0,
    isTakePhoto: true,
    isCorrect: true,
    loading: false,
    errorTip: "",
    takePhotoImgUrl: "",
    takePhotoImgUrlOrig: "",
    devicePosition: "front",
    flash: "off",
    userInfo: {},
    isCamera: true,
    deviceWidth: "",
    deviceHeight: "",
    pixelRatio: "",
    standardWidth: "375",
    standardHeight: "603",
    standardPixelRatio: "2",
    isCanvas: false,
    rotate: 0,
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    const _this = this;
    _this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        wx.showLoading({
          title: '加载中...',
          mask:true
        })
        if (_this.data.type == 1) {
          const ctx = wx.createCanvasContext('cans');
          wx.getImageInfo({
            src: avatar,
            success(res1){
              ctx.fillRect(0, 0, 200, 200);
              ctx.drawImage(res1.path, 0, 0, res1.width, res1.height,0,0,200,200);
              ctx.draw(true, setTimeout(function(){
                wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: 200,
                  height:200,
                  destWidth: 200,
                  destHeight: 200,
                  canvasId: 'cans',
                  quality: .5,
                  success: function (ress) {
                    if (_this.data.isStylist == 1) {
                      let param = {
                        userId: user_id,
                        version: version,
                      }
                      wx.uploadFile({
                        url: uploadStylistHeadImgFile,
                        filePath: ress.tempFilePath,
                        name: 'file',
                        formData: param,
                        success: function (res) {
                          var data = JSON.parse(res.data);
                          var code = data.code;
                          if (code == 0) {
                            wx.navigateBack({
                              delta:1
                            })
                          }else{
                            uploadErrorInfoFn(`${uploadStylistHeadImgFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(data)}`);
                            wx.hideLoading();
                            let title = "系统通知";
                            let notice = '出错啦';
                            wx.navigateTo({
                              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                            })
                          };
                        },
                        fail: function (error) {
                          uploadErrorInfoFn(`${uploadStylistHeadImgFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
                          wx.hideLoading();
                          let title = "系统通知";
                          let notice = '出错啦';
                          wx.navigateTo({
                            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                          })
                        }
                      })
                    } else {
                      let para = {
                        userId: user_id,
                        personId: wx.getStorageSync('userInfo').personId
                      }
                      wx.uploadFile({
                        url: uploadUserHeadImgFile,
                        filePath: ress.tempFilePath,
                        name: 'file',
                        formData:para,
                        success: function (res) {
                          var data = JSON.parse(res.data);
                          var code = data.code;
                          if (code == 0) {
                            wx.navigateBack({
                              delta: 1
                            })
                          }else{
                            uploadErrorInfoFn(`${uploadUserHeadImgFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
                            wx.hideLoading();
                            let title = "系统通知";
                            let notice = '出错啦';
                            wx.navigateTo({
                              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                            })
                          };
                        },
                        fail: function (errors) {
                          uploadErrorInfoFn(`${uploadUserHeadImgFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(errors)}`);
                          wx.hideLoading();
                          let title = "系统通知";
                          let notice = '出错啦';
                          wx.navigateTo({
                            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                          })
                        }
                      });
                    }
                    wx.hideLoading();
                  },
                  fail(error) {

                  },
                })
              },300))
            },
          })
        };
      };
    })
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const src = res.tempFilePaths[0]
        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
		user_id = wx.getStorageSync('userInfo').userId;
    this.setData({
      type:option.type,
      isStylist: option.isStylist
    })
    const {
      cropperOpt
    } = this.data
    if (option.src) {
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {})
        .on('beforeImageLoad', (ctx) => {
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {})
        .updateCanvas()
    };
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        var rate = res.windowWidth / that.data.standardWidth;
        that.setData({
          pixelRatio: res.pixelRatio,
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight,
          rate: rate
        });
      }
    })
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