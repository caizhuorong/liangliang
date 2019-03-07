let user_id = wx.getStorageSync('userInfo').userId;
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
  uploadFaceFile,
  uploadFaceFileTitle,
  getNewlyUsedPic,
  getNewlyUsedPicTitle,
  faceSwap,
  faceSwapTitle,
  useNewlyPicFaceSwap,
  useNewlyPicFaceSwapTitle,
  getCountInfo,
  getCountInfoTitle,
} from '../../config.js';
let takePhotoing = true;
const errorToast = {
  1: "正面看镜头笑一个呗~",
  2: "眉毛被挡住啦~掀起了你的盖头来~",
  3: "眉毛被挡住啦~掀起了你的盖头来~",
  4: "可以摘下眼镜给我一个爱的眼神吗~",
  5: "你这么好看，怎么可以被挡住~让我看看你的全脸"
};
const device = wx.getSystemInfoSync();
const app = getApp();
function getCameraAuth() {
  wx.authorize({
    scope: 'scope.camera',
    success: function() {
    },
    fail: function() {
      getCameraAuth();
    }
  })
}
let takePhotoImgUrl = '';
Page({
  data: {
    isTakePhoto: true,
    isCorrect: true,
    loading: false,
    errorTip: "",
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
    first:false,
    ai:false,
    from:'',
    templateNo:'',
    ctx:{},
    height:0,
    last_img:[],
    last_img_hiden:false,
    nophone: true,
    maskTop: 0,
    remind:false,
    me_loading_type: 0,
    meloadingvalue: '加载中...',
    asd:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
		shareType:true,
  },
  closeShare(){
    this.setData({
      shareType:true,
    })
  },
  kf(){
    const _this = this;
    let para={
      userId: user_id,
      version: version,
    }
    util.post(`${setCustomerRelation}`, para).then(res => {

    }).catch(error=>{

    })
  },
  showLoading(value) {
    this.setData({
      me_loading_type: 1,
      meloadingvalue: value
    })
  },
  hidenLoading() {
    this.setData({
      me_loading_type: 0,
      meloadingvalue: '加载中...'
    })
  },
  getNewlyUsedPic(){
    const _this = this;
    let para = {
      userId: wx.getStorageSync('userInfo').userId,
      version: version
    }
    util.get(`${getNewlyUsedPic}`,para).then(res=>{
      if( res.code == 0 ){
        let last_img_hiden = true;
        if (_this.data.from == 'index') {
          last_img_hiden = false;
        } else {
          last_img_hiden = true;
        };
        _this.setData({
          last_img: res.info.usedPicList,
          last_img_hiden: last_img_hiden
        })
      }else{
        uploadErrorInfoFn(`${getNewlyUsedPicTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
      }
    }).catch(e=>{
      uploadErrorInfoFn(`${getNewlyUsedPicTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  onUnload(){
    this.setData({
      ctx:{}
    })
  },
  remindChange(){
    this.setData({
      remind: !this.data.remind
    });
  },
  maskTop() {
    let systemInfo = wx.getSystemInfoSync();
    let pixe = systemInfo.windowWidth / 750;
    let maskTop = (systemInfo.windowHeight / pixe - 750) / 2;
    this.setData({
      maskTop: maskTop
    })
  },
  phone_content_btn(){
    this.setData({
      nophone:true,
    })
    wx.setStorageSync('remind', this.data.remind);
  },
  changeHeight(){
    let r = 750 / device.windowWidth;
    let h = device.windowHeight*r - 1000;
    this.setData({
      height:h
    })
  },
  onLoad: function(options) {
		user_id = wx.getStorageSync('userInfo').userId;
    var that = this;
    that.maskTop();
    that.changeHeight();
    that.setData({
      first:options.first ? true:false,
      from: options.from == undefined ? '' : options.from,
    })
    if (options.templateNo != undefined ){
      that.setData({
        templateNo: options.templateNo,
      })
    };
    if (options.form == 'design' || wx.getStorageSync('remind') == true){
      that.setData({
        nophone:true
      })
    }else{
      if( wx.getStorageSync('chooseHeart') != 1 ){
        that.setData({
          nophone: false
        })
      }
     
    }
    wx.getSystemInfo({
      success: function(res) {
        var rate = res.windowWidth / that.data.standardWidth;
        that.setData({
          pixelRatio: res.pixelRatio,
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight,
          rate: rate
        });
      }
    });
  },
  onShow: function() {
    const _this = this;
    wx.removeStorageSync('take_type');
    var userInfo = wx.getStorageSync('userInfo');
    _this.setData({
      userInfo: userInfo
    });
    _this.getNewlyUsedPic();
  },
  bindRotate: function(e) {
    if (this.data.rotate >= 360) {
      this.data.rotate = 0;
    }
    this.data.rotate = this.data.rotate + 90;
    this.setData({
      rotate: this.data.rotate
    });
    this.animation.rotate(this.data.rotate).step()

    this.setData({
      animation: this.animation.export()
    })
  },
  bindFlash: function(e) {
    var flash = this.data.flash == "off" ? "on" : "off";
    this.setData({
      flash: flash
    });
  },
  bindDevicePosition: function() {
    var devicePosition = this.data.devicePosition == "back" ? "front" : "back";
    this.setData({
      devicePosition: devicePosition
    });
  },
  goInstruction: function() {
    wx.navigateTo({
      url: '../../others_pages/pictureDescription/pictureDescription',
    })
  },
  goPhoto: function() {
    var that = this;
    wx.setStorageSync('aifn', false);
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          isTakePhoto: false,
        });
        takePhotoImgUrl = tempFilePaths[0];

        if (that.data.templateNo != '' && that.data.templateNo != undefined) {
          wx.navigateTo({
            url: '../lookPhoto/lookPhoto?imgUrl=' + tempFilePaths[0] + "&isTake=true&first=" + that.data.first + '&from=' + that.data.from + '&templateNo=' + that.data.templateNo,
          })
        } else {
          wx.navigateTo({
            url: '../lookPhoto/lookPhoto?imgUrl=' + tempFilePaths[0] + "&isTake=true&first=" + that.data.first + '&from=' + that.data.from,
          })
        }
      }
    })
  },
  goToLook(e){
    const _this = this;
    let option_data = {
      userId: user_id,
      version: version,
      faceId: e.currentTarget.dataset.faceid,
      filePath: e.currentTarget.dataset.filepath,
    }
    if (wx.getStorageSync('detailtodesign') != '' || _this.data.templateNo != '' && _this.data.templateNo != undefined && _this.data.templateNo != 'undefined') {
      option_data['templateNo'] = _this.data.templateNo;
    };
    let pp = {
      userId:user_id,
      version:version
    }
    util.get(`${getCountInfo}`,pp).then(res=>{
      if (res.code == 0) {
        if (res.info.remainedCount <= 0 && !res.info.isUsed) {
					_this.setData({
						shareType: false
					})
        } else if (res.info.usedCount == 0) {
          _this.setData({
            nophone: false,
          })
        } else {
          wx.showLoading({
            title: '加载中...',
            mask: true
          })
          util.post(`${useNewlyPicFaceSwap}`, option_data).then(res1 => {
            let datas = res1;
            if (datas.code == 0) {
              wx.setStorageSync('faceinfo', datas.info);
							if (JSON.stringify(datas.info.points) != "{}" && datasinfo.points != null ){
                wx.setStorageSync('faceLayer', datas.info.points.points );
								if( wx.getStorageSync('hairLayer') != 1 ){
									wx.setStorageSync('hairLayer',0);
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
              wx.hideLoading();
            } else {
              wx.hideLoading();
              wx.showToast({
                title: res1.message,
                icon: 'none'
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../../other_pages/takephoto/takephoto?from=index',
                })
              }, 1500);
            }
            _this.setData({
              faceSwapLoading: false
            })
          }).catch(es => {
            uploadErrorInfoFn(`${useNewlyPicFaceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(es)}`);
            let title = "系统通知";
            let notice = "出错啦";
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
            wx.hideLoading();
            return;
          })
        }
      }else{
        uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(pp)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
      }
    }).catch(e=>{
      uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(pp)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  takePhoto() {
    wx.setStorageSync('aifn',false)
    var that = this;
    let ctx = {};
    if (takePhotoing ){
      takePhotoing = false;
      if (wx.createCameraContext()) {
        ctx = wx.createCameraContext('camera');
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
      ctx.takePhoto({
        quality: 'high',
        success: (res) => {
          var tempFilePaths = res.tempImagePath;
          takePhotoImgUrl= tempFilePaths,
          setTimeout(function(){
           wx.getImageInfo({
             src: tempFilePaths,
             success(a) {
               takePhotoing = true;
             }
           });
           if (that.data.templateNo != '' && that.data.templateNo != undefined  ){
            wx.navigateTo({
              url: '../lookPhoto/lookPhoto?imgUrl=' + tempFilePaths + "&isTake=true&first=" + that.data.first + '&from=' + that.data.from + '&templateNo=' + that.data.templateNo,
            })
          }else{
            wx.navigateTo({
              url: '../lookPhoto/lookPhoto?imgUrl=' + tempFilePaths + "&isTake=true&first=" + that.data.first + '&from=' + that.data.from,
            })
          }
         },300)
        }
      })
     }
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
    });
  },
  getCanvasImg: function(failNum) {
    var tempFilePaths = takePhotoImgUrl;
    var that = this;
    that.setData({
      isCanvas: true
    });
    const ctx = wx.createCanvasContext('myCanvas');
    var standardPixelRatio = that.data.standardPixelRatio;
    var rate = that.data.rate;
    wx.getImageInfo({
      src: tempFilePaths,
      success: function(res) {
        var width_orig = res.width;
        var height_orig = res.height;
        var width = 750;
        var height = height_orig * width / width_orig;
        ctx.drawImage(tempFilePaths, 0, 0, width / standardPixelRatio * rate, height / standardPixelRatio * rate);
        ctx.draw(true, function() {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: width,
            height: height,
            destWidth: width,
            destHeight: height,
            quality: 0.7,
            canvasId: 'myCanvas',
            success: function success(res) {
              that.setData({
                isCanvas: false
              });
              takePhotoImgUrl=res.tempFilePath,
              that.uploadFaceFile();
            },
            fail: function(e) {
              wx.hideLoading();
              failNum += 1;
              that.getCanvasImg(failNum);
            }
          });
        });
      },
      fail: function() {
        wx.hideLoading();
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    })
  },
  bindNext: function() {
    var that = this;
    wx.showLoading({
      title: '加载中...',
			mask:true
    })
    wx.getFileInfo({
      filePath: takePhotoImgUrl,
      success(res) {
        var size = res.size;
        if (size > 1024 * 1024) {
          that.getCanvasImg(0);
        } else {
          that.uploadFaceFile();
        }
      },
      fail: function() {
        wx.hideLoading();
        wx.redirectTo({
          url: '../error/error',
        })
      }
    })
  },
  uploadFaceFile: function() {
    wx.showLoading({
      title: '加载中',
			mask:true
    })
    var that = this;
    wx.getImageInfo({
      src: takePhotoImgUrl,
      success(imgs){
        let para = {
          userId: that.data.userInfo.userId,
          width: imgs.width,
          height: imgs.height
        }
        wx.uploadFile({
          url: uploadFaceFile,
          filePath:takePhotoImgUrl,
          name: 'file',
          formData: para,
          success: function (res) {
            var data = JSON.parse(res.data);
            var code = data.code;
            if (code == 0) {
              that.setData({
                isTakePhoto: false
              });
              var info = data.info;
              info.comeFrom = "takePhoto";
              wx.setStorageSync('faceinfo', info);
              wx.setStorageSync("useModelInfo", "");
              wx.redirectTo({
                url: '../styleDesign/styleDesign',
              })
            } else if (code == 5002) {
              that.setData({
                isTakePhoto: false,
                isCorrect: false,
                errorTip: ["咦？人呢？重新上传一张你的盛世美颜吧"]
              })
            } else if (code == 50021) {
              that.setData({
                isTakePhoto: false,
                isCorrect: false,
                errorTip: ["哎呀有好多人啊~大乐都不知道先给谁设计好了"]
              })
            } else if (code == 5003) {
              var errorInfo = data.info.errorInfo;
              var errorConetent = [];
              for (var i = 0; i < errorInfo.length; i++) {
                errorConetent.push(errorToast[errorInfo[i]]);
              }
              that.setData({
                isTakePhoto: false,
                isCorrect: false,
                errorTip: errorConetent
              })
            } else {
              uploadErrorInfoFn(`${uploadFaceFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(data)}`);
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            }
            wx.hideLoading();
          },
          fail: function (error) {
            uploadErrorInfoFn(`${uploadFaceFileTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
            wx.hideLoading();
            let title = "系统通知";
            let notice = '出错啦';
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
          }
        })
      },
    })
    
  },
  bindRetake: function() {
    app.aldstat.sendEvent('拍照', {
      "btn": "用户点击重拍"
    })
    this.setData({
      isTakePhoto: true,
      isCorrect: true
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