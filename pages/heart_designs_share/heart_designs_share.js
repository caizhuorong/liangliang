const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
import { 
  selectHairStyleResult,
  selectHairStyleResultTitle,
  version,
  login,
  loginTitle,
  faceSwap,
  faceSwapTitle
} from '../../config.js'; 
import { uploadErrorInfoFn, delNull, getUrl,mathRandom} from '../../utils/util.js';
let param = '';
let formid = '';
let shareUserId = '', templateNo = 0, scene = '', shareImgUrl='';
Page({
  data: {
    authorization: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info: {},
    shareLayer: false,
    layerBanner: '',
    layerLabel: '',
    layerTips: '',
    shareImgUrl:'',
    tramsHidden: true,
    sex:'',
    shareshow: false,
  },
  onLoad: function (options) {
    wx.hideShareMenu();
    if (options.param != undefined) {
      param = options.param
    }
    shareUserId = options.shareUserId;
    templateNo = options.templateNo;
    scene = options.scene;
    shareImgUrl = options.shareImgUrl;
    this.setData({
      shareImgUrl: options.shareImgUrl
    })
  },
  onReady: function () {

  },
  showLoadings() {
    this.setData({
      tramsHidden: false
    })
  },
  getFormId(e) {
    formid = e.detail.formId;
  },

  bindGetUserInfo(e) {
    var that = this;
    if (e.detail.userInfo) {
      that.setData({
        showDialog: false
      });
      wx.login({
        success(resCode) {
          wx.getUserInfo({
            success: function (res) {
              wx.getSetting({
                success: function (ress) {
                  if (ress.authSetting['scope.userLocation']) {
                    wx.getLocation({
                      success: function (re) {
                        that.getCode(res, resCode.code, re.latitude, re.longitude);
                      },
                      fail: function (r) {
                        that.getCode(res, resCode.code, 0, 0);
                      }
                    })
                  } else {
                    that.getCode(res, resCode.code, 0, 0);
                  }
                },
                fail() {
                  wx.showToast({
                    title: '抱歉，貌似出了点小故障',
                    icon: 'none',
                    mask: true,
                  })
                },
              });
              //用户已经授权过
              //用户已经授权过detail
            },
            fail() {
              wx.showToast({
                title: '抱歉，貌似出了点小故障',
                icon: 'none',
                mask: true,
              })
            },
          })
        },
        fail() {
          wx.showToast({
            title: '抱歉，貌似出了点小故障',
            icon: 'none',
            mask: true,
          })
        },
      });
    } else {
      //用户按了拒绝按钮
    }
  },
  getCode: function (userInitData, loginCode, latitude, longitude) {
    const that = this;
    that.showLoadings();
    var iv = userInitData.iv;
    var encryptedData = userInitData.encryptedData;
    let ops = wx.getStorageSync('ops');
    let _systeminfo_data = wx.getSystemInfoSync();
    var code = loginCode;
    // wx.setStorageSync('code', code);
    var para = {
      smallprogramNo: smallProgramNo,
      organizationNo: organizationNo,
      code: code,
      iv: iv,
      encryptedData: encryptedData,
      version: version,
      model: _systeminfo_data.model,
      pixelRatio: _systeminfo_data.pixelRatio,
      screenWidth: _systeminfo_data.screenWidth,
      screenHeight: _systeminfo_data.screenHeight,
      windowWidth: _systeminfo_data.windowWidth,
      windowHeight: _systeminfo_data.windowHeight,
      language: _systeminfo_data.language,
      wxVersion: _systeminfo_data.version,
      systemVersion: _systeminfo_data.system,
      platform: _systeminfo_data.platform,
      fontSizeSetting: _systeminfo_data.fontSizeSetting,
      sdkVersion: _systeminfo_data.SDKVersion,
      sceneSystem: wx.getStorageSync('ops').scene,
    };
    if (app.globalData.scene && app.globalData.scene.length > 0) {
      para.scene = app.globalData.scene;
    }
    if (delNull(param)) {
      para.param = param;
    }
    if (latitude != 0) {
      para.latitude = latitude.toString();
    }
    if (longitude != 0) {
      para.longitude = longitude.toString();
    }
    if (ops != '' && ops != undefined && ops != null) {
      if (ops.query.shareUserId != undefined) {
        para['shareUserId'] = ops.query.shareUserId;
      }
    };
    if (formid != "the formId is a mock one") {
      para['formId'] = formid;
    }
    if (ops.shareTicket != undefined) {
      wx.getShareInfo({
        shareTicket: ops.shareTicket,
        success: function (res1) {
          para['encryptedDataForShare'] = res1.encryptedData;
          para['ivForShare'] = res1.iv;
          util.post(`${login}`, para).then(res2 => {
            var code = res2.code;
            if (code == 0 && delNull(res2.info.userId) != '') {
              if (res2.info.personIcon.indexOf('https') <= -1) {
                res2.info.personIcon = res2.info.personIcon.replace('http', 'https');
              };
              if (delNull(res2.info.sex) == '') {
                res2.info.sex = '1';
              }
              that.setData({
                sex:res2.info.sex
              })
              wx.setStorageSync('userInfo', res2.info);
              if (res2.info.points != null && res2.info.points.points.showFlag == 1) {
                let _d1 = {
                  detail: res2.info
                }
                wx.setStorageSync('we_points', _d1);
              }
              if (res2.info.gifts.length != 0) {
                let _d2 = {
                  detail: res2.info.gifts
                }
                wx.setStorageSync('wx_giftlayer', _d2);
              }
              if (res2.info.notice != undefined && res2.info.notice != null && res2.info.notice.length != 0) {
                let _d4 = {
                  detail: res2.info.notice
                }
                wx.setStorageSync('wx_noticelayer', _d4);
              };

              if (delNull(res2.info.showRaffleActive) != '' &&  res2.info.showRaffleActive.length != 0) {
                if (res2.info.showRaffleActive[0].showFlag == 1) {
                  let _d3 = {
                    detail: res2.info
                  }
                  wx.setStorageSync('wx_activelayer', _d3);
                }
              }
              let shareUrl = wx.getStorageSync('ops');
              that.selectHairStyleResults();
            } else {
              uploadErrorInfoFn(`${loginTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res2)}`);
              wx.showToast({
                title: '抱歉，貌似出了点小故障',
                icon: 'none',
                mask: true,
              })
            }
          }).catch(error => {
            uploadErrorInfoFn(`${loginTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
            wx.showToast({
              title: '抱歉，貌似出了点小故障',
              icon: 'none',
              mask: true,
            })
          })
        },
        fail(error) {
        },
      });
    } else {
      util.post(`${login}`, para).then(res => {
        var code = res.code;
        if (code == 0 && delNull(res.info.userId) != '') {
          if (res.info.personIcon.indexOf('https') <= -1) {
            res.info.personIcon = res.info.personIcon.replace('http', 'https');
          };
          if (delNull(res.info.sex) == '') {
            res.info.sex = '1';
          }
          that.setData({
            sex: res.info.sex
          })
          wx.setStorageSync('userInfo', res.info);
          if (res.info.points != null) {
            if (res.info.gifts.length == 0 && res.info.points.points.showFlag == 1) {
              let _d1 = {
                detail: res.info
              }
              wx.setStorageSync('we_points', _d1);
            }
          }
          if (res.info.gifts.length != 0) {
            let _d2 = {
              detail: res.info.gifts
            }
            wx.setStorageSync('wx_giftlayer', _d2);
          }
          if (res.info.notice != undefined && res.info.notice != null && res.info.notice.length != 0) {
            let _d4 = {
              detail: res.info.notice
            }
            wx.setStorageSync('wx_noticelayer', _d4);
          };
          if (delNull(res.info.showRaffleActive) != '' && res.info.showRaffleActive.length != 0) {
            if (res.info.showRaffleActive[0].showFlag == 1) {
              let _d3 = {
                detail: res.info
              }
              wx.setStorageSync('wx_activelayer', _d3);
            }
          }
          let shareUrl = wx.getStorageSync('ops');
          that.selectHairStyleResults();
        } else {
          uploadErrorInfoFn(`${loginTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          wx.showToast({
            title: '抱歉，貌似出了点小故障',
            icon: 'none',
            mask: true,
          })
        }
      }).catch(error => {
        uploadErrorInfoFn(`${loginTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        wx.showToast({
          title: '抱歉，貌似出了点小故障',
          icon: 'none',
          mask: true,
        })
      })
    }
  },
  onShareAppMessage: function () {

  },
  selectHairStyleResults(){
    const _this = this;
    
    let param={
      userId: wx.getStorageSync('userInfo').userId,
      templateNo: templateNo,
      version: version,
    };
    util.post(`${faceSwap}`, param).then(res1 => {
      _this.hidenLoadings();
      let datas = res1.info;
      if( res1.info.sex == '' ){
        res1.info.sex = '1';
      }
      _this.setData({
        heat_info: datas
      }, () => {
        if (res1.code == 0) {
          wx.setStorageSync('faceinfo', datas);
          if (JSON.stringify(res1.info.points) != "{}" && res1.info.points != null) {
            wx.setStorageSync('faceLayer', res1.info.points.points);
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
            url: '../heart_designs/heart_designs',
          })
        } else if (res1.code == 5004) {
          wx.showToast({
            title: '你还没有拍照！',
            icon: 'none'
          })
          setTimeout(function () {
            wx.setStorageSync('chooseHeart', 1);
            wx.navigateTo({
              url: '../../other_pages/takephoto/takephoto?first=true&show=false&templateNo=' + templateNo,
            })
          }, 1500);
        } else {
          uploadErrorInfoFn(`${faceSwapTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res1)}`);
          let title = "系统通知";
          let notice = "出错啦";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          _this.hidenLoadings();
          return;
        }
      })
    }).catch(error => {
      uploadErrorInfoFn(`${faceSwapTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      _this.hidenLoadings();
      return;
    })
  },
  hidenLoadings() {
    const _this = this;
      _this.setData({
        tramsHidden: true
      })
  }, 
  showLoadings() {
    this.setData({
      tramsHidden: false
    })
  },
})
