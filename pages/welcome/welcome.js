const app = getApp();
const version = require('../../config.js').version;
let user_id = wx.getStorageSync('userInfo').userId;
const login = require('../../config').login;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
let param = '';
let formid='';
import { uploadErrorInfoFn, getUrl, delNull,mathRandom } from '../../utils/util.js';
import { loginTitle} from '../../config.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authorization: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    info: {},
    shareLayer: false,
    layerBanner: '',
    layerLabel: '',
    layerTips: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		 wx.hideShareMenu();
    if (options.param != undefined) {
      param = options.param
    }
  },
  onReady: function () {

  },
  getFormId(e){
    formid = e.detail.formId;
  },
  gotouser() {
    wx.navigateTo({
      url: '../../others_pages/user_protocol/user_protocol',
    })
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
                        uploadErrorInfoFn(`微信API-getLocation`, `event:点击按钮;requestParameters:无;errorinfo:${JSON.stringify(r)}`);
                        that.getCode(res, resCode.code, 0, 0);
                      }
                    })
                  } else {
                    that.getCode(res, resCode.code, 0, 0);
                  }
                },
                fail(error) {
                  uploadErrorInfoFn(`微信API-getSetting`, `event:点击按钮;requestParameters:无;errorinfo:${JSON.stringify(error)}`);
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
            fail(error) {
              uploadErrorInfoFn(`微信API-getUserInfo`, `event:点击按钮;requestParameters:无;errorinfo:${JSON.stringify(error)}`);
              wx.showToast({
                title: '抱歉，貌似出了点小故障',
                icon: 'none',
                mask: true,
              })
            },
          })
        },
        fail(error) {
          uploadErrorInfoFn(`微信API-login接口`, `event:点击按钮;requestParameters:无;errorinfo:${JSON.stringify(error)}`);
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
    if (formid != "the formId is a mock one" ){
      para['formId'] = formid;
    }
    if (ops.shareTicket != undefined) {
      wx.getShareInfo({
        shareTicket: ops.shareTicket,
        success: function (res1) {
          para['encryptedDataForShare'] = res1.encryptedData;
          para['ivForShare'] = res1.iv;
					util.post(`${login}`,para).then(res2=>{
						//测试用数据开始
						// res2.data.code = 3001;
						//测试用数据结束
						var code = res2.code;
						if (code == 0 && delNull(res2.info.userId) != '') {
						  if (res2.info.personIcon.indexOf('https') <= -1) {
						    res2.info.personIcon = res2.info.personIcon.replace('http', 'https');
						  };
              if (delNull(res2.info.shareInfo) != '') {
                wx.setStorageSync('shareInfo', res2.info.shareInfo);
              }
              if ( delNull(res2.info.sex) == '' ){
                 res2.info.sex= '1';
              }
						  wx.setStorageSync('userInfo', res2.info);
						  if (res2.info.points != null && res2.info.points.points.showFlag == 1  ) {
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
              if (res2.info.notice != undefined && res2.info.notice != null &&  res2.info.notice.length != 0  ) {
                let _d4 = {
                  detail: res2.info.notice
                }
                wx.setStorageSync('wx_noticelayer', _d4);
              };
              if (delNull(res2.info.showRaffleActive) != '' && res2.info.showRaffleActive.length != 0 ) {
						    if (res2.info.showRaffleActive[0].showFlag == 1 ){
						      let _d3 = {
						        detail: res2.info
						      }
						      wx.setStorageSync('wx_activelayer', _d3);
						    }
						  }
              if (delNull(res2.info.templateNotice) != '' && res2.info.templateNotice === '1') {
                let templateNoticeInfo = {
                  detail: {
                    now: res2.info.now,
                    templateNoticeTags: res2.info.templateNoticeTags,
                    templateNoticeTagsLabel: res2.info.templateNoticeTagsLabel
                  }
                }
                wx.setStorageSync('templateNotice', templateNoticeInfo);
              }
						  let shareUrl = wx.getStorageSync('ops');
             
              if (res2.info.newFlag == '1' ){
                wx.switchTab({
                  url: '../../pages/heart_design/heart_design',
                })
              }
						  if ( shareUrl.path.indexOf('index') != -1 ){
                wx.switchTab({
						      url: '../../pages/index/index',
						    })
						  } else if (shareUrl.path.indexOf('hear_detail') != -1 ){
						    wx.navigateTo({
						      url: `../../pages/heart_detail/hear_detail?shareUserId=${shareUrl.shareUserId}&isTemplate=${shareUrl.isTemplate}&templateNo=${shareUrl.templateNo}`,
						    })
						  } else if (shareUrl.path.indexOf('heart_center') != -1 ){
						    wx.navigateTo({
						      url: `../../others_pages/heart_center/heart_center?shareUserId=${shareUrl.shareUserId}&isStylist=${shareUrl.isStylist}&id=${shareUrl.id}`,
						    })
						  } else if (shareUrl.path.indexOf('AIanalysis') != -1  ){
						    wx.navigateTo({
						      url: `../../pages/AIanalysis/AIanalysis?shareUserId=${shareUrl.shareUserId}&from=${shareUrl.from}&share=true	`,
						    })
						  } else if (shareUrl.path.indexOf('active_20181217') != -1 ){
						    wx.navigateTo({
						      url: `../../pages/active_20181217/active_20181217?shareUserId=${shareUrl.query.shareUserId}`,
						    })
              } else if (shareUrl.path.indexOf('test') != -1) {
                wx.navigateTo({
                  url: `../../pages/test/test?shareUserId=${shareUrl.query.shareUserId}&from=user&share=true`,
                })
              }else{
						    wx.switchTab({
						      url: '../../pages/index/index',
						    })
						  }
						} else {
              uploadErrorInfoFn(`${loginTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res2)}`);
						  wx.showToast({
						    title: '抱歉，貌似出了点小故障',
						    icon: 'none',
						    mask: true,
						  })
						}
					}).catch(error=>{
            uploadErrorInfoFn(`${loginTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
						wx.showToast({
						  title: '抱歉，貌似出了点小故障',
						  icon: 'none',
						  mask: true,
						})
					})
        },
        fail(error) {
          uploadErrorInfoFn(`微信API-getShareInfo`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        },
      });
    } else {
			util.post(`${login}`,para).then(res=>{
				//测试用数据开始
				// res.data.code = 3001;
				// res.data.info.userId = 12312;
				// res.data.info.userId = null;
				// res.data.info.userId = '';
				//测试用数据结束
				var code = res.code;
        if (code == 0 && delNull(res.info.userId) != ''  ) {
				  if (res.info.personIcon.indexOf('https') <= -1) {
				    res.info.personIcon = res.info.personIcon.replace('http', 'https');
				  };
          if (delNull(res.info.shareInfo) != '') {
            wx.setStorageSync('shareInfo', res.info.shareInfo);
          }
          if ( delNull(res.info.sex) == '' ){
            res.info.sex = '1';
          }
          wx.setStorageSync('userInfo', res.info);
				  if (res.info.points != null  ) {
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
          if (delNull(res.info.showRaffleActive) != '' && res.info.showRaffleActive.length != 0  ) {
				    if (res.info.showRaffleActive[0].showFlag == 1 ){
				      let _d3 = {
				        detail: res.info
				      }
				      wx.setStorageSync('wx_activelayer', _d3);
				    }
				  }
          if (delNull(res.info.templateNotice) != '' && res.info.templateNotice === '1') {
            let templateNoticeInfo = {
              detail: {
                now: res.info.now,
                templateNoticeTags: res.info.templateNoticeTags,
                templateNoticeTagsLabel: res.info.templateNoticeTagsLabel
              }
            }
            wx.setStorageSync('templateNotice', templateNoticeInfo);
          }
				  let shareUrl = wx.getStorageSync('ops');
          if (res.info.newFlag == '1') {
            wx.switchTab({
              url: '../../pages/heart_design/heart_design',
            })
          }
				  if (shareUrl.path.indexOf('index') != -1) {
            wx.switchTab({
				      url: '../../pages/index/index',
				    })
				  } else if (shareUrl.path.indexOf('hear_detail') != -1) {
				    wx.navigateTo({
				      url: `../../pages/heart_detail/hear_detail?shareUserId=${shareUrl.query.shareUserId}&isTemplate=${shareUrl.query.isTemplate}&templateNo=${shareUrl.query.templateNo}`,
				    })
				  } else if (shareUrl.path.indexOf('heart_center') != -1) {
				    wx.navigateTo({
				      url: `../../others_pages/heart_center/heart_center?shareUserId=${shareUrl.query.shareUserId}&isStylist=${shareUrl.query.isStylist}&id=${shareUrl.query.id}`,
				    })
				  } else if (shareUrl.path.indexOf('AIanalysis') != -1) {
				    wx.navigateTo({
				      url: `../../pages/AIanalysis/AIanalysis?shareUserId=${shareUrl.query.shareUserId}&from=${shareUrl.query.from}&share=true	`,
				    })
				  } else if (shareUrl.path.indexOf('active_20181217') != -1) {
				    wx.navigateTo({
				      url: `../../pages/active_20181217/active_20181217?shareUserId=${shareUrl.query.shareUserId}`,
				    })
          } else if (shareUrl.path.indexOf('test') != -1) {
            wx.navigateTo({
              url: `../../pages/test/test?shareUserId=${shareUrl.query.shareUserId}&from=user&share=true`,
            })
          }else {
            wx.switchTab({
				      url: '../../pages/index/index',
				    })
				  }
				} else {
          console.log('----------------------');
          uploadErrorInfoFn(`${loginTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				    wx.showToast({
				      title: '抱歉，貌似出了点小故障',
				      icon: 'none',
				      mask: true,
				    })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${loginTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				wx.showToast({
				  title: '抱歉，貌似出了点小故障',
				  icon: 'none',
				  mask: true,
				})
			})
    }
  },
  onShareAppMessage: function () {

  }
})
