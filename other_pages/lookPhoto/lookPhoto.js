const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
// import WeCropper from '../we-cropper/we-cropper.js'
const device = wx.getSystemInfoSync();
const util = require('../../utils/util.js');
import {
  getUrl,
  uploadErrorInfoFn,
  baseShare,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  nonspecificSharePage,
  faceSwap,
  faceSwapTitle,
  uploadFaceFile,
  uploadFaceFileTitle,
  faceAnalyze,
  faceAnalyzeTitle
} from '../../config.js';
let rate = '';
let failNum = 0;
Page({
  data: {
    isCorrect: true,
    loading: false,
    errorTip: "",
    takePhotoImgUrl: "",
    devicePosition: "front",
    flash: "off",
    isCamera: true,
    deviceWidth: "",
    deviceHeight: "",
    pixelRatio: "",
    standardWidth: "375",
    standardHeight: "603",
    standardPixelRatio: 2,
    isCanvas: false,
    isTake: false,
    rotate: 0,
    from:'',
    templateNo:'',
    takePhotoImgUrls:'',
    me_loading_type: 0,
    meloadingvalue: '加载中...',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    msgList:[],
    errtype:false,
    tramsHidden: true,
    sex:'0',
  },
  showLoading(value) {
    this.setData({
      me_loading_type: 1,
      meloadingvalue: value
    })
  },
  showLoadings() {
    this.setData({
      tramsHidden: false
    })
  },
  hidenLoadings() {
    const _this = this;
      _this.setData({
        tramsHidden: true
      })
  }, 
  hidenLoading() {
    this.setData({
      me_loading_type: 0,
      meloadingvalue: '加载中...'
    })
  },
  onLoad: function(options) {
		user_id = wx.getStorageSync('userInfo').userId;
    var that = this;
    var takePhotoImgUrl = options.imgUrl;
    var isTake = options.isTake;
    rate = device.windowWidth / that.data.standardWidth;
    that.setData({
      takePhotoImgUrl: takePhotoImgUrl,
      isTake: isTake,
      from: options.from,
      templateNo: options.templateNo == undefined || options.templateNo == null ? '' : options.templateNo,
      pixelRatio: device.pixelRatio,
      deviceWidth: device.windowWidth,
      deviceHeight: device.windowHeight,
    });
  },
  bindGetPhoto: function(e) {
    var that = this;
    var width = e.detail.width;
    var height = e.detail.height;
    var imgWidth = 750;
    var imgHeight = 750 * height / width;
    this.setData({
      imgWidth: imgWidth,
      imgHeight: imgHeight
    },()=>{
      setTimeout(function(){
        that.bindNext()
      },100);
    });
  },
  getCanvasImg: function(failNum) {
    var tempFilePaths = this.data.takePhotoImgUrls == '' ? this.data.takePhotoImgUrl : this.data.takePhotoImgUrls;
    var that = this;
    this.setData({
      isCanvas: true
    });
    const ctx = wx.createCanvasContext('myCanvas');
    var standardPixelRatio = this.data.standardPixelRatio;
    var rate = this.data.rate;
    var width = 750;
    var height = height_orig * width / width_orig;
    ctx.drawImage(tempFilePaths, 0, 0, width_orig, height_orig, 0, 0, that.data.imgWidth, that.data.imgHeight);
    ctx.draw(true, function() {
      wx.canvasToTempFilePath({
        quality: 1,
        canvasId: 'myCanvas',
        fileType:'jpg',
        success: function success(res) {
          wx.getImageInfo({
            src: res.tempFilePath,
            success(a){
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(c){

                }
              })
            },
          })
        },
        fail: function(e) {
          wx.hideLoading();
          failNum += 1; //失败数量，可以用来提示用户
          that.getCanvasImg(failNum);
        }
      });
    });
  },
  toJpg(getres){
    var that = this;
    let  ctx = wx.createCanvasContext('myCanvas');
    var tempFilePaths = this.data.takePhotoImgUrls == '' ? this.data.takePhotoImgUrl : this.data.takePhotoImgUrls;
    that.setData({
      isCanvas: true
    });
    var standardPixelRatio = that.data.standardPixelRatio;
    var rate = that.data.rate;
    let canWidth = that.data.imgWidth;
    let canHeight=that.data.imgHeight;
    var width = 750;
    let dw = device.windowWidth;
    let dh = device.windowHeight;
    let pw = getres.width;
    let ph = getres.height;
    let sw = dw;
    let sh = ph * dw / pw;
    ctx.drawImage(tempFilePaths, 0, 0, sw, sh);
    ctx.draw(true, function () {
      wx.canvasToTempFilePath({
        width: canWidth,
        height: canHeight,
        destWidth: canWidth,
        destHeight: canHeight,
        quality: 1,
        canvasId: 'myCanvas',
        fileType: 'jpg',
        success: function success(res) {
          wx.getFileInfo({
            filePath: res.tempFilePath,
            success(res22) {
              if (res22.size > 1024*1024 ){
                that.setData({
                  takePhotoImgUrls: res.tempFilePath,
                }, () => {
                  wx.compressImage({
                    src: res.tempFilePath,
                    quality:60,
                    success(ys_img){
                    },
                  })
                });
              }
              that.setData({
                takePhotoImgUrls: res.tempFilePath,
                isCanvas: false
              }, () => {
                that.uploadFaceFile();
              });
            }
          })
        },
        fail: function (e) {
          wx.hideLoading();
          failNum += 1; //失败数量，可以用来提示用户
          that.getCanvasImg(failNum);
        }
      });
    });
  },
  bindNext: function() {
    wx.setStorageSync('aifn', false);
    var that = this;
   that.showLoading('正在脸型分析,请稍候');
    wx.getImageInfo({
      src:that.data.takePhotoImgUrls == '' ? that.data.takePhotoImgUrl : that.data.takePhotoImgUrls,
      success(getres){
        that.setData({
          takePhotoImgUrl: getres.path
        },()=>{
          that.toJpg(getres);
        })
      },
    })
  },

  //出现警告，继续分析
  uploadFaceFiles(){
    wx.setStorageSync('aifn', false);
    let that = this;
    if (wx.getStorageSync('back')) {
      if (that.data.templateNo != undefined && that.data.templateNo != '') {
        // wx.navigateTo({
        //   url: '../../pages/AIanalysis/AIanalysis?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
        // })
        wx.navigateTo({
          url: '../../pages/test/test?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
        })
      } else {
        wx.navigateTo({
          url: '../../pages/test/test?from=' + that.data.from,
        })
      };
      wx.removeStorageSync('back')
      return false;
    }
    that.showLoading('正在脸型分析,请稍候');
    wx.getImageInfo({
      src: that.data.takePhotoImgUrls == '' ? that.data.takePhotoImgUrl : that.data.takePhotoImgUrls,
      success(imgs) {
        let p = {
          userId: user_id,
          width: imgs.width,
          height: imgs.height,
          foreFlag: 1,
          pagePath: getUrl()
        }
        if( wx.getStorageSync('chooseHeart') == 1 ){
          p['analyzeFlag'] = 1;
        
        }
        console.log(p);
        wx.uploadFile({
          url: faceAnalyze,
          filePath: that.data.takePhotoImgUrls == '' ? that.data.takePhotoImgUrl : that.data.takePhotoImgUrls,
          name: 'file',
          formData: p,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.hidenLoading();
            var data = JSON.parse(res.data);
            var code = data.code;
            if (code == 0) {
              that.setData({
                errtype:true
              })
              wx.removeStorageSync('noPhoneToTakePhone');
              wx.setStorageSync('lookphoneToAi', data);
              if (wx.getStorageSync('chooseHeart') == 1) {
                // wx.navigateTo({
                //   url: '../../heart_designs/heart_designs',
                // })
                that.faceSwaps();
                return  false;
              }
              if (that.data.templateNo != undefined && that.data.templateNo != '') {
                // wx.navigateTo({
                //   url: '../../pages/AIanalysis/AIanalysis?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
                // })
                wx.navigateTo({
                  url: '../../pages/test/test?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
                })
              } else {
                // wx.navigateTo({
                //   url: '../../pages/AIanalysis/AIanalysis?from=' + that.data.from,
                // })
                wx.navigateTo({
                  url: '../../pages/test/test?from=' + that.data.from,
                })
              };
              that.hidenLoading();
            } else if (code == 100) {//警告
              that.setData({
                isCorrect: false,
                msgList: data.info.msgList,
                errtype: true
              })
              that.hidenLoading();
            } else if (code == 200) {//error
              let str = data.info.msgList.join('\r\n');
              wx.showModal({
                title: data.info.msgTitle,
                content: str,
                showCancel: false,
                confirmText: '我知道了',
                success(modeRes) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              });
              that.setData({
                isCorrect: false,
              })
              that.hidenLoading();
            } else {
              uploadErrorInfoFn(`${faceAnalyzeTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(p)};errorinfo:${JSON.stringify(data)}`);
              that.hidenLoading();
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            }
          },
          fail: function (error) {
            uploadErrorInfoFn(`${faceAnalyzeTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(p)};errorinfo:${JSON.stringify(error)}`);
            that.hidenLoading();
            let title = "系统通知";
            let notice = '出错啦';
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
          }
        })
      },
    });
  },
  onUnload(){
    wx.removeStorageSync('back')
  },
  uploadFaceFile: function() {
    var that = this;
    wx.setStorageSync('aifn', false);
    if (wx.getStorageSync('back') ){
      if (that.data.templateNo != undefined && that.data.templateNo != '') {
        // wx.navigateTo({
        //   url: '../../pages/AIanalysis/AIanalysis?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
        // })
        wx.navigateTo({
          url: '../../pages/test/test?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
        })
      } else {
        wx.navigateTo({
          url: '../../pages/test/test?from=' + that.data.from,
        })
      };
      wx.removeStorageSync('back')
      return false;
    }
    that.showLoading('正在脸型分析,请稍候');
    wx.getImageInfo({
      src: that.data.takePhotoImgUrls == '' ? that.data.takePhotoImgUrl : that.data.takePhotoImgUrls,
      success(imgs) {
        let p={
          userId: user_id,
          width: imgs.width,
          height: imgs.height,
          pagePath: getUrl(),
          foreFlag: 0,
        }
        if (wx.getStorageSync('chooseHeart') == 1) {
          p['analyzeFlag'] = 1;
        }
        wx.uploadFile({
          url: faceAnalyze,
          filePath: that.data.takePhotoImgUrls == '' ? that.data.takePhotoImgUrl : that.data.takePhotoImgUrls,
          name: 'file',
          formData:p,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.hidenLoading();
            var data = JSON.parse(res.data);
            var code = data.code;
            if (code == 0) {
              that.setData({
                errtype: true
              })
              wx.removeStorageSync('noPhoneToTakePhone');
              wx.setStorageSync('lookphoneToAi', data);
              if (wx.getStorageSync('chooseHeart') == 1) {
                that.faceSwaps();
                // wx.navigateTo({
                //   url: '../../heart_designs/heart_designs',
                // })
                return false;
              }
              if (that.data.templateNo != undefined && that.data.templateNo != '') {
                // wx.navigateTo({
                //   url: '../../pages/AIanalysis/AIanalysis?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
                // })
                wx.navigateTo({
                  url: '../../pages/test/test?from=' + that.data.from + '&templateNo=' + that.data.templateNo,
                })
              } else {
                wx.navigateTo({
                  url: '../../pages/test/test?from=' + that.data.from,
                })
              };
              that.hidenLoading();
            } else if (code == 100) {//警告
              that.setData({
                isCorrect: false,
                msgList: data.info.msgList,
                errtype: true
              })
              that.hidenLoading();
            } else if (code == 200) {//error
              let str = data.info.msgList.join('\r\n');
              wx.showModal({
                title: data.info.msgTitle,
                content: str,
                showCancel: false,
                confirmText: '我知道了',
                success(modeRes) {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              });
              that.setData({
                isCorrect: false,
              })
              that.hidenLoading();
            } else {
              uploadErrorInfoFn(`${faceAnalyzeTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(p)};errorinfo:${JSON.stringify(data)}`);
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            }
          },
          fail: function (error) {
            uploadErrorInfoFn(`${faceAnalyzeTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(p)};errorinfo:${JSON.stringify(error)}`);
            that.hidenLoading();
            let title = "系统通知";
            let notice = '出错啦';
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
          }
        })
      },
    });
  },
  faceSwaps(){
    const _this = this;
    let para={
      userId:user_id,
      version: version,
      templateNo: _this.data.templateNo,
    }
    _this.showLoadings();
    util.post(`${faceSwap}`,para).then(res=>{
      _this.hidenLoadings();
      let datas = res.info;
        if (res.code == 0) {
          wx.setStorageSync('faceinfo', datas);
          if (JSON.stringify(res.info.points) != "{}" && res.info.points != null) {
            wx.setStorageSync('faceLayer', res.info.points.points);
            if (wx.getStorageSync('hairLayer') != 1) {
              wx.setStorageSync('hairLayer', 0);
            }
          };
					let stroageFace = wx.getStorageSync('userInfo');
					if( stroageFace.paymentInfo.isPopup == 0 && stroageFace.paymentInfo.isPaymentUser == 1 ){
						stroageFace.paymentInfo.detectCounts = stroageFace.paymentInfo.detectCounts  +1;
					}
					wx.setStorageSync('userInfo',stroageFace);
          wx.navigateTo({
            url: '../../pages/heart_designs/heart_designs',
          })
        } else if (res1.code == 5004) {
          wx.showToast({
            title: '你还没有拍照！',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../../other_pages/takephoto/takephoto?first=true',
            })
          }, 1500);
        } else {
          uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = "出错啦";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          _this.hidenLoadings();
          return;
        }
    }).catch(error=>{
      uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      _this.hidenLoadings();
    })
  },
  bindRetake: function() {
    wx.navigateBack({
      delta:1
    });
    this.setData({
      isCorrect: true
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