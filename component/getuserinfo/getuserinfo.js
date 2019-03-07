const app = getApp();
const version = require('../../config.js').version;
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const login = require('../../config').login;
const organizationNo = require('../../config.js').organizationNo;
const delNull = require('../../utils/util.js').delNull;
Component({
  behaviors: [],
  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUse: wx.canIUse('button.open-type.getPhoneNumber'),
    diaglo:true,
  },
  properties: {
    showDialog: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    showDialogs: {
      type: Boolean,
      value: false
    },
    type: {
      type: String,
      value: true,
    },
    url: {
      type: String,
      value: ''
    },
    end: {
      type: String,
      value: '',
    },
    isAgree:{
      value:true,
      type:Boolean
    },
    scene:{
      value:'',
      type:String
    },
    param:{
      type:String,
      value:'',
    }
  },
  methods: {
    getUserInfo(e){
      var that = this;
      if (e.detail.userInfo) {
        //用户按了允许授权按钮
        that.setData({
          showDialog: false
        });
        wx.getSetting({
          success: function (ress) {
            wx.login({
              success(resCode) {
                wx.getUserInfo({
                  success: function (res) {
                    //用户已经授权过detail
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
                  fail(){
                    wx.showToast({
                      title: '抱歉，貌似出了点小故障',
                      icon: 'none',
                      mask:true,
                    })
                    setTimeout(function () {
                      if (delNull(that.data.param) != '') {
                        wx.reLaunch({
                          url: '../../pages/welcome/welcome?param=' + that.data.param,
                        })
                      } else {
                        wx.reLaunch({
                          url: '../../pages/welcome/welcome',
                        })
                      }
                    }, 1500);
                    wx.hideLoading();
                    return;
                  }
                })
              },
              fail() {
                wx.showToast({
                  title: '抱歉，貌似出了点小故障',
                  icon: 'none',
                  mask: true,
                })
                setTimeout(function () {
                  if (delNull(that.data.param) != '') {
                    wx.reLaunch({
                      url: '../../pages/welcome/welcome?param=' + that.data.param,
                    })
                  } else {
                    wx.reLaunch({
                      url: '../../pages/welcome/welcome',
                    })
                  }
                }, 1500)

                wx.hideLoading();
                return;
              }
            });
          },
          fail:function(e){
              wx.showToast({
                title: '抱歉，貌似出了点小故障',
                icon: 'none',
                mask: true,
              })
              setTimeout(function () {
                if (delNull(that.data.param) != '') {
                  wx.reLaunch({
                    url: '../../pages/welcome/welcome?param=' + that.data.param,
                  })
                } else {
                  wx.reLaunch({
                    url: '../../pages/welcome/welcome',
                  })
                }
              }, 1500)

              wx.hideLoading();
              return;
            }
        });
        // that.getCode(e.detail);
      } else {
       
      }
    },
    bindAgreeChange(e) {
      this.setData({
        isAgree: !!e.detail.value.length
      });
      if (e.detail.value[0] == 'agree') {
        this.setData({
          diaglo: true
        })
      } else {
        this.setData({
          diaglo: false
        })
      }
    },
    getCode: function (userInitData, loginCode, latitude, longitude) {
      const that = this;
      var iv = userInitData.iv;
			var encryptedData = userInitData.encryptedData;
      let ops = wx.getStorageSync('ops');
      let _systeminfo_data = wx.getSystemInfoSync();
      var code = loginCode;
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
        sceneSystem:wx.getStorageSync('ops').scene,
      }
      if (latitude != 0  ){
        para.latitude = latitude.toString();
      }
      if (delNull(that.data.param) != '' ){
        para.param = that.data.param;
      }
      if (longitude != 0 ){
        para.longitude = longitude.toString();
      }
      if (app.globalData.scene && app.globalData.scene.length > 0) {
        para.scene = app.globalData.scene;
      }
      if (ops != '' && ops != undefined && ops != null ){
        if (ops.query.shareUserId != undefined ){
          para['shareUserId'] = ops.query.shareUserId;
        }
      };
      if (ops.shareTicket != undefined) {
        wx.getShareInfo({
          shareTicket: ops.shareTicket,
          success: function (res1) {
            para['encryptedDataForShare'] = res1.encryptedData;
            para['ivForShare'] = res1.iv;
            wx.request({
              url: login,
              method: "POST",
              data: para,
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: res2 => {
                var code = res2.data.code;
                if (code == 0 && delNull(res2.data.info.userId) != '' ) {
                  if (res2.data.info.personIcon.indexOf('https') <= -1) {
                    res2.data.info.personIcon = res2.data.info.personIcon.replace('http', 'https');
                  };
                  if( delNull(res2.data.info.shareInfo) != '' ){
                    wx.setStorageSync('shareInfo', res2.data.info.shareInfo);
                  }
                  if ( delNull(res2.data.info.sex) == '' ){
                    res2.data.info.sex = '1';
                  }
                  wx.setStorageSync('userInfo', res2.data.info);
                  if (ree2.data.info.newFlag == 1) {
                    wx.reLaunch({
                      url: '../../pages/heart_design/heart_design',
                    })
                  }
                  if( res2.data.info.newFlag == '1' ){
                    if (res2.data.info.points != null && res2.data.info.points.points.showFlag == 1) {
                      let _d1 = {
                        detail: res2.data.info
                      }
                      wx.setStorageSync('we_points', _d1);
                    }
                    if (res2.data.info.gifts.length != 0) {
                      let _d2 = {
                        detail: res2.data.info.gifts
                      }
                      wx.setStorageSync('wx_giftlayer', _d2);
                    }
                    if (res2.data.info.notice != undefined && res2.data.info.notice.length != 0 ){
                      let _d2 = {
                        detail: res2.data.info.notice
                      }
                      wx.setStorageSync('wx_noticelayer', _d2);
                    };
                    if (res2.data.info.showRaffleActive.length != 0) {
                      if (res2.data.info.showRaffleActive[0].showFlag == 1) {
                        let _d3 = {
                          detail: res2.data.info
                        }
                        wx.setStorageSync('wx_activelayer', _d3);
                      }
                    }
                    return false;
                  }
                  if (delNull(res2.data.info.templateNotice) != '' && res2.data.info.templateNotice === '1' ){
                    let templateNoticeInfo = {
                      detail: {
                        now: res2.data.info.now,
                        templateNoticeTags: res2.data.info.templateNoticeTags,
                        templateNoticeTagsLabel: res2.data.info.templateNoticeTagsLabel
                      }
                    }
                    wx.setStorageSync('templateNotice', templateNoticeInfo);
                  }
                  that.triggerEvent('myevent', true);
                  if (res2.data.info.points != null) {
                    if (res2.data.info.gifts.length == 0 && res2.data.info.points.points.showFlag == 1) {
                      that.triggerEvent('points', res2.data.info);
                    }
                  }
                  if (res2.data.info.showRaffleActive != '' && res2.data.info.showRaffleActive != null && res2.data.info.showRaffleActive != undefined) {
                    if (res2.data.info.showRaffleActive.length != 0 && res2.data.info.showRaffleActive[0].showFlag == 1) {
                      that.triggerEvent('activelayer', res2.data.info);
                    }
                  }
                  if (res2.data.info.gifts.length != 0 && res2.data.info.notice.length != 0 ) {
                    that.triggerEvent('giftlayer', res2.data.info.gifts);
                  }
                  if (res2.data.info.notice != undefined  ){
                    
                    that.triggerEvent('noticelayer', res2.data.info.gifts);
                  }
                  if (delNull(res2.data.info.templateNotice) != '' && res2.data.info.templateNotice === '1') {
                    let templateNoticeInfo = {
                      now: res2.data.info.now,
                      templateNoticeTags: res2.data.info.templateNoticeTags,
                      templateNoticeTagsLabel: res2.data.info.templateNoticeTagsLabel
                    }
                    that.triggerEvent('templateNotice', templateNoticeInfo);
                  }
                } else {
                  wx.showToast({
                    title: '抱歉，貌似出了点小故障',
                    icon: 'none',
                    mask: true,
                  })
                  setTimeout(function () {
                    if (delNull(that.data.param) != '') {
                      wx.reLaunch({
                        url: '../../pages/welcome/welcome?param=' + that.data.param,
                      })
                    } else {
                      wx.reLaunch({
                        url: '../../pages/welcome/welcome',
                      })
                    }
                  }, 1500);
                  wx.hideLoading();
                  return;
                }
              },
              fail: function (error) {
                wx.showToast({
                  title: '抱歉，貌似出了点小故障',
                  icon: 'none',
                  mask: true,
                })
                setTimeout(function () {
                  if (delNull(that.data.param) != '') {
                    wx.reLaunch({
                      url: '../../pages/welcome/welcome?param=' + that.data.param,
                    })
                  } else {
                    wx.reLaunch({
                      url: '../../pages/welcome/welcome',
                    })
                  }
                }, 1500)
                wx.hideLoading();
                return;
              }
            })
          },
          fail(error){

          },  
        });
      }else{
        wx.request({
          url: login,
          method: "POST",
          data: para,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            console.log(res);
            //测试数据开始
            //  res.data.code = 3001;
      // res.data.info.userId = undefined;
      // res.data.info.userId = null;
      // res.data.info.userId = '';
            // res.data.info.userId = '12321312';
            //测试数据结束
            var code = res.data.code;
            if (code == 0 && delNull(res.data.info.userId) != '' ) {
              if (res.data.info.personIcon.indexOf('https') <= -1) {
                res.data.info.personIcon = res.data.info.personIcon.replace('http', 'https');
              };
              if (delNull(res.data.info.shareInfo) != '') {
                wx.setStorageSync('shareInfo', res.data.info.shareInfo);
              }
              if (delNull(res.data.info.sex) == '') {
                res.data.info.sex = '1';
              }
              wx.setStorageSync('userInfo', res.data.info);
              if( res.data.info.newFlag == 1 ){
                wx.reLaunch({
                  url: '../../pages/heart_design/heart_design',
                })
              }
              that.setData({
                showDialogs: false,
                showDialog: false,
              });
              if (res.data.info.newFlag == '1') {
                if (res.data.info.points != null && res.data.info.points.points.showFlag == 1) {
                  let _d1 = {
                    detail: res.data.info
                  }
                  wx.setStorageSync('we_points', _d1);
                }
                if (res.data.info.gifts.length != 0) {
                  let _d2 = {
                    detail: res.data.info.gifts
                  }
                  wx.setStorageSync('wx_giftlayer', _d2);
                }
                if (res.data.info.notice != undefined && res.data.info.notice.length != 0 ){
                  let _d2 = {
                    detail: res.data.info.notice
                  }
                  wx.setStorageSync('wx_noticelayer', _d2);
                }
                if (res.data.info.showRaffleActive.length != 0) {
                  if (res.data.info.showRaffleActive[0].showFlag == 1) {
                    let _d3 = {
                      detail: res.data.info
                    }
                    wx.setStorageSync('wx_activelayer', _d3);
                  }
                }
                return false;
              }
              if (delNull(res.data.info.templateNotice) != '' && res.data.info.templateNotice === '1') {
                let templateNoticeInfo = {
                  detail: {
                    now: res.data.info.now,
                    templateNoticeTags: res.data.info.templateNoticeTags,
                    templateNoticeTagsLabel: res.data.info.templateNoticeTagsLabel
                  }
                }
                wx.setStorageSync('templateNotice', templateNoticeInfo);
              }
              that.triggerEvent('myevent', true);
              wx.hideLoading();
              if (res.data.info.points != null) {
                if (res.data.info.gifts.length == 0 && res.data.info.points.points.showFlag == 1 ) {
                  that.triggerEvent('points',res.data.info);
                }
              }
              if (res.data.info.gifts.length != 0) {
                that.triggerEvent('giftlayer', res.data.info.gifts);
              }
              if (res.data.info.notice != undefined && res.data.info.notice.length != 0) {
                that.triggerEvent('noticelayer', res.data.info.notice);
              }
              if (res.data.info.showRaffleActive != '' && res.data.info.showRaffleActive != null && res.data.info.showRaffleActive != undefined ) {
                if ( res.data.info.showRaffleActive[0].showFlag == 1) {
                  that.triggerEvent('activelayer', res.data.info);
                }
              }
              if (delNull(res.data.info.templateNotice) != '' && res.data.info.templateNotice === '1') {
                let templateNoticeInfo = {
                  now: res.data.info.now,
                  templateNoticeTags: res.data.info.templateNoticeTags,
                  templateNoticeTagsLabel: res.data.info.templateNoticeTagsLabel
                }
                that.triggerEvent('templateNotice', templateNoticeInfo);
              }
            } else {
              wx.hideLoading();
              wx.showToast({
                title: '抱歉，貌似出了点小故障',
                icon: 'none',
                mask: true,
                duration:1500
              })
              setTimeout(function () {
                if( delNull(that.data.param) != '' ){
                  wx.reLaunch({
                    url: '../../pages/welcome/welcome?param='+that.data.param,
                  })
                }else{
                  wx.reLaunch({
                    url: '../../pages/welcome/welcome',
                  })
                }
                
              }, 1500)
              
              return;
            }
          },
          fail: function (error) {
            wx.showToast({
              title: '抱歉，貌似出了点小故障',
              icon: 'none',
              mask: true,
            })
            setTimeout(function () {
              wx.reLaunch({
                url: '../../pages/welcome/welcome',
              })
            }, 1500)

            wx.hideLoading();
            return;
          }
        })
      }
    },
  },
  attached(){
    // wx.showLoading({
    //   title: '加载中',
    //   mask:true,
    //   icon:'none'
    // })
    let _sys_data = wx.getSystemInfoSync();
    console.log(_sys_data.version);
      if (_sys_data.version <= '6.6.7' ){
        const _this = this;
        if (wx.getStorageSync('userInfo').userId == undefined) {
          wx.getSetting({
            success: function (ress) {
              if (ress.authSetting['scope.userInfo']) {
                wx.login({
                  success(resCode) {
                    wx.getUserInfo({
                      success: function (res) {
                        if (ress.authSetting['scope.userLocation'] ){
                          wx.getLocation({
                            success: function(re) {
                              console.log(3);
                              _this.getCode(res, resCode.code, re.latitude, re.longitude);
                            },
                            fail:function(r){
                              _this.getCode(res, resCode.code, 0, 0);
                            }
                          })
                        }else{
                          _this.getCode(res, resCode.code,0,0);
                        }
                        
                        //用户已经授权过
                      },
                      fail(){
                        wx.showToast({
                          title: '抱歉，貌似出了点小故障',
                          icon: 'none',
                          mask: true,
                        })
                        setTimeout(function () {
                          if (delNull(_this.data.param) != '') {
                            wx.reLaunch({
                              url: '../../pages/welcome/welcome?param=' + _this.data.param,
                            })
                          } else {
                            wx.reLaunch({
                              url: '../../pages/welcome/welcome',
                            })
                          }
                        }, 1500)

                        wx.hideLoading();
                        return;
                      },
                    })
                  },
                  fail(){
                    wx.showToast({
                      title: '抱歉，貌似出了点小故障',
                      icon: 'none',
                      mask: true,
                    })
                    setTimeout(function () {
                      if (delNull(_this.data.param) != '') {
                        wx.reLaunch({
                          url: '../../pages/welcome/welcome?param=' + _this.data.param,
                        })
                      } else {
                        wx.reLaunch({
                          url: '../../pages/welcome/welcome',
                        })
                      }
                    }, 1500)

                    wx.hideLoading();
                    return;
                  },
                });
              } else { 
                wx.hideLoading();
                if (delNull(_this.data.param) != '') {
                  wx.reLaunch({
                    url: '../../pages/welcome/welcome?param=' + _this.data.param,
                  })
                } else {
                  wx.reLaunch({
                    url: '../../pages/welcome/welcome',
                  })
                }
              }
            },
            fail(error) {
              wx.hideLoading();
            }
          })
        }
      };
  },
  lifetimes:{
    attached: function () { 
      // wx.showLoading({
      //   title: '加载中',
      //   mask: true,
      //   icon: 'none'
      // })
      let _sys_data = wx.getSystemInfoSync();
      // if (_sys_data.version < '6.6.7' ){
      //   return false;
      // };
      const _this = this;
      if( wx.getStorageSync('userInfo').userId == undefined ){
        wx.getSetting({
          success: function (ress) {
								if (ress.authSetting['scope.userInfo']) {
									_this.setData({
										showDialog: false,
										showDialogs: false,
									});
                  wx.login({
                    success(resCode) {
                      wx.getUserInfo({
                        success: function (res) {
                          if (ress.authSetting['scope.userLocation']) {
                            wx.getLocation({
                              success: function (re) {
                                _this.getCode(res, resCode.code, re.latitude, re.longitude);
                              },
                              fail: function (r) {
                                _this.getCode(res, resCode.code, 0, 0);
                              }
                            })
                          } else {
                            _this.getCode(res, resCode.code, 0, 0);
                          }
                          //用户已经授权过
                        },
                        fail(){
                          wx.showToast({
                            title: '抱歉，貌似出了点小故障',
                            icon: 'none',
                            mask: true,
                          })
                          setTimeout(function () {
                            if (delNull(_this.data.param) != '') {
                              wx.reLaunch({
                                url: '../../pages/welcome/welcome?param=' + _this.data.param,
                              })
                            } else {
                              wx.reLaunch({
                                url: '../../pages/welcome/welcome',
                              })
                            }
                          }, 1500)
                          wx.hideLoading();
                          return;
                        }
                      })
                    },
                    fail(){
                      wx.showToast({
                        title: '抱歉，貌似出了点小故障',
                        icon: 'none',
                        mask: true,
                      })
                      setTimeout(function () {
                        if (delNull(_this.data.param) != '') {
                          wx.reLaunch({
                            url: '../../pages/welcome/welcome?param=' + _this.data.param,
                          })
                        } else {
                          wx.reLaunch({
                            url: '../../pages/welcome/welcome',
                          })
                        }
                      }, 1500)
                      wx.hideLoading();
                      return;
                    },
                  });
								} else { 
                  wx.hideLoading();
                  if (delNull(_this.data.param) != '') {
                    wx.reLaunch({
                      url: '../../pages/welcome/welcome?param=' + _this.data.param,
                    })
                  } else {
                    wx.reLaunch({
                      url: '../../pages/welcome/welcome',
                    })
                  }
								}
          },
          fail(error) {
            wx.showToast({
              title: '抱歉，貌似出了点小故障',
              icon: 'none',
              mask: true,
            })
            setTimeout(function () {
              if (delNull(_this.data.param) != '') {
                wx.reLaunch({
                  url: '../../pages/welcome/welcome?param=' + _this.data.param,
                })
              } else {
                wx.reLaunch({
                  url: '../../pages/welcome/welcome',
                })
              }
            }, 1500)
            wx.hideLoading();
            return;
          }
        })
      }
    },
    detached: function () { },
  }
})

