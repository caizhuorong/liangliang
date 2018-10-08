const app = getApp();
const login = require('../../config').login;
const getCarouselList = require('../../config').getCarouselList;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const insertScanHistory = require('../../config.js').insertScanHistory;
const getSystemNotice = require('../../config.js').getSystemNotice;
const version = require('../../config.js').version;
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js');

Page({
  data: {
    indexBgImg: {
      // url: "../../img/hair_home_bg.png",
      // link: ""
    },
    userInfo: {},
    hasUserInfo: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showDialog: false,
    showCameraDialog: false,
    backgroundImgs: [],
    indicatorDots: true, //是否显示指示点
    vertical: false,
    autoplay: true, //是否自动播放
    interval: 3000, //幻灯片自动播放间隔时长
    duration: 500, //幻灯片切换时长
    haveRequest: false,
    scene: "", //用来存储
    goOnload: false,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    head_img:[
      {
        url:'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name:'小A老师'
      },
      {
        url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '小A老师'
      },
      {
        url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '小A老师'
      },
      {
        url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '小A老师'
      },
      {
        url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '小A老师'
      },
      {
        url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '小A老师'
      },
      {
        url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '小A老师'
      },
      {
        url: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
        name: '小A老师'
      },
    ],
    note: [
      {
        name: '大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼',
        heart_num: '1',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '212312',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '3',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }, {
        name: '大脸猫爱吃鱼',
        heart_num: '4',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '5',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '6',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '7',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img4.imgtn.bdimg.com/it/u=2748975304,2710656664&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }, {
        name: '大脸猫爱吃鱼',
        heart_num: '8',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img2.imgtn.bdimg.com/it/u=1561660534,130168102&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }
    ],
  },
  goToabout(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  onLoad: function (options) {

    var that = this;
    var goOnload = true;
    var scene = "";
    if (options && options.scene) {
      scene = decodeURIComponent(options.scene)
    }
    this.setData({
      scene: scene,
      goOnload: goOnload
    });
    //请求系统是否处于工作状态
    // this.requestSystemNotice();
    // this.loadNext();
    wx.getLocation({
      success(res){
        console.log(res);
        wx.setStorage({
          key: 'user_location',
          data: {
            latitude: res.latitude,
            longitude: res.longitude
          },
        })
      }
    })
  },
  //请求requestSystemNotice
  requestSystemNotice: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var para = {
      smallprogramNo: smallProgramNo
    };
    wx.request({
      url: getSystemNotice,
      data: para,
      success: function (res) {
        var code = res.data.code;
        if (code == 0) {
          wx.hideLoading();
          that.loadNext();
        } else if (code == 1002) {
          var title = res.data.message || "亲！您是洗剪吹还是烫拉染啊？";
          var notice = res.data.info.systemNotice.notice || "AI大乐正在设计新发型，请稍候再来~~";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        } else {
          var title = "亲！您是洗剪吹还是烫拉染啊？";
          var notice = "AI大乐正在设计新发型，请稍候再来~~";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
        // wx.hideLoading();
      },
      fail: function () {
        var title = "系统通知";
        var notice = "系统维护中";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    })
  },
  loadNext: function () {
    console.log(9);
    var that = this;
    //请求轮播图
    // this.requestBg();
    //用户信息存在
    console.log(app.globalData.userInfo);
    if (app.globalData.userInfo) {
      // wx.showModal({
      //   title: 'aaa',
      //   content: 'aaa',
      // })
      if (!that.data.hasUserInfo) {
        wx.setStorageSync('userInfo', app.globalData.userInfo);
        that.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true,
        })
      }
      if (this.data.scene && this.data.scene.length > 0) {
        var para = {
          userId: this.data.userInfo.userId,
          scene: this.data.scene,
          smallProgramNo: smallProgramNo,
          new_flag: "0",
          version: version
        };
        console.log(para)
        wx.request({
          url: insertScanHistory,
          data: para,
          success: function (res) {
            var code = res.data.code;
            if (code == 0) {
              that.setData({
                scene: ""
              })
            } else {
              wx.navigateTo({
                url: '../../other_pages/error/error',
              })
            }
          },
          fail: function () {
            wx.navigateTo({
              url: '../../other_pages/error/error',
            })
          }
        })

      }
    } else {
      // wx.showModal({
      //   title: 'bb',
      //   content: 'bb',
      // })
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            that.setData({
              showDialog: false
            });
            wx.getUserInfo({
              success: function (res) {
                console.log("用户已经授权过" + res)
                //用户已经授权过
                that.getCode(res);
              },
            })
          } else { //用户没有授权过
            wx.getUserInfo({
              success: res => {
                that.setData({
                  showDialog: false
                });
                console.log("用户没有授权过" + res);
                that.getCode(res);
              },
              fail: res => {
                console.log("用户没有授权过" + res)
                that.setData({
                  showDialog: true
                });
              }
            })
          }
        }
      })

    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!this.data.goOnload && !app.globalData.userInfo) {
      this.onLoad();
      // wx.showModal({
      //   title: 'cc',
      //   content: 'cc',
      // })
    }
  },
  onHide: function () {
    this.setData({
      goOnload: false
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.aldstat.sendEvent('首页', {
      "btn": "用户点击右上角分享"
    })
    var shareObj = {
      title: app.globalData.userInfo.showNick + '叫你一起来体验',
      desc: '拍照就能造型，为你量身打造适合你的发型',
      imageUrl: "/img/shareIndex.png",
      path: '/pages/index/index',
      success: function (res) { // 转发成功之后的回调
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') { }
      },
      fail: function () {　 // 转发失败之后的回调
      },
      complete: function () {　 // 转发结束之后的回调（转发成不成功都会执行）
      }
    }
    return shareObj;
  },

  //请求轮播图
  requestBg: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: getCarouselList,
      data: {},
      success: function (res) {
        that.setData({
          haveRequest: true
        })
        var code = res.data.code;
        if (code == 0) {
          var list = res.data.info.carouselList;
          var interval = res.data.info.hariCarouselSpeed;
          // list=[list[1]];
          if (list.length == 1) {
            that.setData({
              indexBgImg: list[0]
            });
          }
          that.setData({
            backgroundImgs: list,
            interval: interval
          });
        } else {
          wx.hideLoading();
          wx.navigateTo({
            url: '../../other_pages/error/error',
          })
        } 
        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
        wx.navigateTo({
          url: '../../other_pages/error/error',
        })
      }
    })
  },
  //轮播图点击事件
  bindLink: function (e) {
    app.aldstat.sendEvent('首页', {
      "img": "用户点击轮播图链接"
    })
    var link = e.currentTarget.dataset.link;
    if (link.length > 0) {
      wx.navigateTo({
        url: '../thirdParty/thirdParty?url=' + link,
      })
    }

  },

  //用户点击‘知道了’之后获取用户信息
  getUserInfo: function (e) {
    app.aldstat.sendEvent('首页', {
      "btn": "用户点击获取用户信息知道了"
    })
    //当用户点击允许用户获取用户信息之后返回用户信息
    console.log(e.detail.userInfo)
    var that = this;
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      that.setData({
        showDialog: false
      });
      this.getCode(e.detail);
    } else {
      //用户按了拒绝按钮
      that.setData({
        showDialog: true
      });
    }
  },
  //通过后台请求用户信息
  getCode: function (userInitData) {
    wx.showLoading({
      title: '加载中',
    })

    var iv = userInitData.iv;
    var encryptedData = userInitData.encryptedData;
    var that = this;

    // 登录,获取code
    wx.login({
      success: res => {
        // console.log(res);
        var code = res.code;
        var para = {
          smallprogramNo: smallProgramNo,
          organizationNo: organizationNo,
          code: code,
          iv: iv,
          encryptedData: encryptedData,
          version:version
        }
        if (that.data.scene && that.data.scene.length > 0) {
          para.scene = that.data.scene;
        }
        //发送code，encryptedData，iv到后台解码，获取用户信息
        wx.request({
          url: login,
          method: "POST",
          data: para,
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: res => {
            var code = res.data.code;
            if (code == 0) {
              console.log(res);

              if (res.data.info.personIcon.indexOf('https') <= -1) {
                res.data.info.personIcon = res.data.info.personIcon.replace('http', 'https');
              }

              wx.setStorageSync('userInfo', res.data.info);
              app.globalData.userInfo = res.data.info;
              that.setData({
                userInfo: res.data.info,
                hasUserInfo: true,
              })
              wx.hideLoading();
            } else {
              wx.hideLoading();
              console.log("getuserInfoError" + res);
              wx.navigateTo({
                url: '../../other_pages/error/error',
              })
            }
          },
          fail: function () {
            wx.hideLoading();
            wx.navigateTo({
              url: '../../other_pages/error/error',
            })
          }
        })
      },
      fail: function () {
        wx.hideLoading();
        wx.navigateTo({
          url: '../../other_pages/error/error',
        })
      }
    })
  },
  //用户点击了“去设置”
  openSetting: function (e) {
    var that = this;
    console.log(e.detail.authSetting.camera);

    if (e.detail.authSetting['scope.camera']) {
      that.setData({
        showCameraDialog: false
      });
      wx.navigateTo({
        url: '../takePhoto/takePhoto',
      })
    } else {
      that.setData({
        showCameraDialog: true
      });
    }
  },
  //跳转到拍照
  bindHairDesign: function () {
    var that = this;
    app.aldstat.sendEvent('首页', {
      "btn": "用户点击拍照"
    })

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.camera']) {
          //用户已经授权过
          wx.navigateTo({
            url: '../takePhoto/takePhoto',
          })

        } else {
          //用户没有授权过 
          wx.authorize({
            scope: 'scope.camera',
            success(res) {
              that.setData({
                showCameraDialog: false
              });
              wx.navigateTo({
                url: '../takePhoto/takePhoto',
              })
            },
            fail() {
              that.setData({
                showCameraDialog: true
              });
            }
          })


          // that.setData({
          //   showCameraDialog:true
          // });

          // wx.showModal({
          //   title: '提示',
          //   content: '我们希望获取您的摄像头。',
          //   showCancel: false,
          //   confirmText: '去设置',
          //   success: res => {
          //     if (res.confirm) {
          //       wx.authorize({
          //         scope: 'scope.camera',
          //         success(res) {
          //           console.log('保存图片授权成功')
          //           wx.navigateTo({
          //             url: '../takePhoto/takePhoto',
          //           })
          //         },
          //         fail() {
          //           setTimeout(function() {
          //             wx.openSetting({
          //               success: (res) => {
          //                 if (res.authSetting['scope.camera']) {
          //                   // wx.navigateBack({
          //                   // })
          //                   console.log('开启权限成功');
          //                   wx.navigateTo({
          //                     url: '../takePhoto/takePhoto',
          //                   })
          //                 }
          //               }
          //             })
          //           }, 300);
          //         }
          //       })


          //     }
          //   }
          // })
        }
      }
    })

  },
  //跳转到我的
  bindMy: function () {
    app.aldstat.sendEvent('首页', {
      "btn": "用户点击跳转到我的"
    })
    wx.navigateTo({
      url: '../my/my',
    })
  }
})