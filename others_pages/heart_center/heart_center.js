const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  uploadErrorInfoFn,
  numto,
  baseShare,
  getUrl,
  get,post,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  selectStylistInfo,
  selectStylistInfoTitle,
  selectUserInfo,
  selectUserInfoTitle,
  addFollow,
  addFollowTitle,
  deleteFollow,
  deleteFollowTitle,
  hairMan,
  hairManTitle,
} from '../../config.js';
Page({
  data: {
    choose_type: false,
    id: 0,
    data: {},
    year: 0, // 从业年数  当前年数 - workFrom
    zg_type: true,
    teltype: false,
    show:true,
    isStylist: 0,
    showDialog: false,
    showDialogs: false,
    user:{},
    stylist:{},
    shareUserId:'',
    shareshow:false,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    giftShow:false,
    giftLayerBanner:[],
    noticeShow: false,
    noticeLayerBanner: [],
	  activeInfo: {},
  },
  gotodetail(e){
    wx.navigateTo({
      url: `../../pages/heart_detail/hear_detail?templateNo=${e.currentTarget.dataset.no}&isTemplate=${e.currentTarget.dataset.istemplate}`,
    })
  },
  noticelayer(e) {
    this.setData({
      noticeShow: true,
      noticeLayerBanner: e.detail
    })
  },
  giftlayer(e) {
    console.log(e);
    this.setData({
      giftShow: true,
      giftLayerBanner: e.detail
    })
  },
   activelayer(e){
    console.log('设置抽奖弹窗显示');
    this.setData({
      activeShow: true,
      activeInfo: e
    })
  },
  goToFans(){
    if ( this.data.show ){
      wx.navigateTo({
        url: '../../pages/fans/fans?userId=' + this.data.user.userId,
      })
    }else{
      if (this.data.data.fansCount > 0 ){
        wx.navigateTo({
          url: '../../pages/fans/fans?userId=' + this.data.user.userId,
        })
      }
    }
  },
  goToFollow(){
    if (this.data.show) {
      wx.navigateTo({
        url: '../../pages/follow/follow?userId=' + this.data.user.userId,
      })
    } else {
      if (this.data.data.followCount > 0) {
        wx.navigateTo({
          url: '../../pages/follow/follow?userId=' + this.data.user.userId,
        })
      }
    }
  },
  openlocation(e){
    wx.openLocation({
      longitude: Number(e.currentTarget.dataset.longitude),
      latitude: Number(e.currentTarget.dataset.latitude),
      name: e.currentTarget.dataset.name,
      address: e.currentTarget.dataset.address
    })
  },
  onLoad: function(options) {
    let id = options.id;
    const _this = this;
    if( options.shareUserId != undefined ){
      _this.setData({
        id:options.shareUserId
      })
    };
 
    _this.setData({
      id:options.id,
      isStylist: options.isStylist,
      shareUserId: options.shareUserId ? options.shareUserId : '',
      show: options.id == user_id ? true:false,
    });
  
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          _this.setData({
            showDialog: false,
            showDialogs: false,
          });
          if( wx.getStorageSync('userInfo').userId !=undefined ){
            if (options.isStylist == 0) {
              _this.getUserInfo()
            } else {
              _this.getInfo()
            };
          }
        } else { //用户没有授权过
          wx.getUserInfo({
            success: res => {
              wx.setStorageSync('userInfo', app.globalData.userInfo);
              _this.setData({
                showDialog: false,
                showDialogs: false
              });
            },
            fail: res => {
              _this.setData({
                showDialog: true,
                showDialogs: true
              });
            }
          })
        }
      },
      fail(error) {
      }
    })
  },
  points(e){
    console.log(e);
		if (delNull(e.detail.points.points.background) == '' ){
      return false;
    }
    let banner_url = e.detail.points.points.background;
    let _show;
   
      if (wx.getStorageSync('signLayer') == 1) {
        _show = false;
      } else {
        _show = true;
      }

    this.setData({
      shareLayer: _show,
      layerBanner: `${banner_url}`,
      layerLabel: e.detail.points.points.prompt,
      layerTips: e.detail.points.points.points,
      code: e.detail.points.points.code
    });
  },
  onMyEvent() {
    user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    console.log(_this.data.id ,user_id)
    if (_this.data.id == user_id ){
      _this.setData({
        show:true,
      })
    }else{
      _this.setData({
        show: false,
      })
    }
    _this.getajax();
  },
  getajax(){
    if (this.data.isStylist == 0) {
      this.getUserInfo()
    } else {
      this.getInfo()
    };
  },
  getUserInfo() {
    wx.showLoading({
			title:'加载中...',
			mask:true
		});
    const _this = this;
    let para = {
      aimUserId: _this.data.id,
      userId: user_id,
      version: version
    };
    wx.request({
      url: selectUserInfo,
      method: 'get',
      data:para,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code == 0) {
          let user = res.data.info.userResp.user;
          res.data.info.praiseCount = res.data.info.praiseCount ? numto(res.data.info.praiseCount):0;
          res.data.info.fansCount = res.data.info.fansCount ? numto(res.data.info.fansCount) : 0;
          res.data.info.followCount = res.data.info.followCount ? numto(res.data.info.followCount) : 0;
          _this.setData({
            data: res.data.info,
            user: user,
            zg_type: res.data.info.isFollowed == 1 ? false:true
          })
        } else {
          uploadErrorInfoFn(`${selectUserInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res.data)}`);
         let title = "系统通知";
         let notice = "出错啦";
         wx.navigateTo({
         	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
         })
        }
        wx.hideLoading();
      },
      fail(error) {
        uploadErrorInfoFn(`${selectUserInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        wx.stopPullDownRefresh();
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    })
  },
  getInfo() {
    wx.showLoading({
			title:'加载中...',
			mask:true
		});
    const _this = this;
		let para={
			stylistId: _this.data.id,
			userId: user_id,
			version: version,
		};
		get(`${selectStylistInfo}`,para).then(res=>{
			if (res.code == 0) {
			  let data = res.info;
			  let user = data.sHairUserStylist.user;
			  let stylist = data.sHairUserStylist.stylist;
			  let dates = [];
			  if (stylist.workDate != null) {
			    let date_work = stylist.workDate.split(",");
			    date_work.forEach(function (x, y) {
			      if (x == 1) {
			        switch (y) {
			          case 0:
			            dates.push('周一');
			            break;
			          case 1:
			            dates.push('周二');
			            break;
			          case 2:
			            dates.push('周三');
			            break;
			          case 3:
			            dates.push('周四');
			            break;
			          case 4:
			            dates.push('周五');
			            break;
			          case 5:
			            dates.push('周六');
			            break;
			          case 6:
			            dates.push('周日');
			            break;
			        }
			      }
			    });
			    stylist.workDate = dates.join('、');
			  }
			  if (stylist.sHairStore != null) {
			    let freeServiceTags_data = stylist.sHairStore.freeServiceTags;
			    stylist.sHairStore.freeServiceTags = freeServiceTags_data.join("、");
			  }
			  let myDate = new Date();
			  let ysea = myDate.getFullYear();
			  _this.setData({
			    data: data,
			    user: user,
			    stylist: stylist,
			    year: stylist.startYear == null ? '0' : ysea - stylist.startYear + 1,
			    zg_type: data.isFollowed == 1 ? false : true,
			  })
			} else {
        uploadErrorInfoFn(`${selectStylistInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			    url: '../error/error?title=' + title + "&notice=" + notice,
			  })
			}
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${selectStylistInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			wx.stopPullDownRefresh();
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  followType() {
    const _this = this;
    if (_this.data.zg_type) {
      let isid = _this.data.data.sHairUserStylist != undefined ? _this.data.data.sHairUserStylist.user.userId : _this.data.user.userId;
			let para={
				userId:user_id,
				version:version,
				stylistId:isid
			};
			post(`${addFollow}`,para).then(res=>{
				let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  _this.setData({
				    zg_type: !_this.data.zg_type
				  })
				  if (res.info.points.points != undefined) {
						let storage = res.info.points.points;
						let _show;
						let banner_url = storage.background;
						if (wx.getStorageSync('hairLayer') == 1) {
							_show = false;
						} else {
							_show = true;
						}
						_this.setData({
							shareLayer: _show,
							layerBanner: `${banner_url}`,
							layerLabel: storage.prompt,
							layerTips: storage.points,
							code: storage.code
						});
				  }
				} else {
          uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				    url: '../error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				return;
			})
    } else {
      let isid = _this.data.data.sHairUserStylist != undefined  ? _this.data.data.sHairUserStylist.user.userId : _this.data.user.userId;
      wx.showModal({
        title: '提示',
        content: '确定不再关注此人？',
        confirmText: '确定',
        success(res1) {
          console.log(res1);
          if (res1.confirm) {
						let para={
							userId:user_id,
							version:version,
							stylistId:isid,
						}
						post(`${deleteFollow}`,para).then(res=>{
							let _data = _this.data.info;
							let data = res.info;
							if (res.code == 0) {
							  _this.setData({
							    zg_type: !_this.data.zg_type
							  })
							} else {
                uploadErrorInfoFn(`${deleteFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
							  let title = "系统通知";
							  let notice = '出错啦';
							  wx.navigateTo({
							    url: '../error/error?title=' + title + "&notice=" + notice,
							  })
							}
						}).catch(error=>{
              uploadErrorInfoFn(`${deleteFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
							let title = "系统通知";
							let notice = "出错啦";
							wx.navigateTo({
							  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
							})
							return;
						})
          }
        }
      });    
    }
  },
  chooseType: function(e) {
    this.setData({
      choose_type: !this.data.choose_type
    });
  },
  callTo: function() {
    this.setData({
      teltype: true
    })
  },
  closeTel: function() {
    this.setData({
      teltype: false
    })
  },
  callTel: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  onShow(){
    if (wx.getStorageSync('we_points')) {
      console.log(!wx.getStorageSync('wx_giftlayer'));
      if (!wx.getStorageSync('wx_giftlayer')) {
        this.points(wx.getStorageSync('we_points'));
      }
      wx.removeStorageSync('we_points');
    }
    if (wx.getStorageSync('wx_giftlayer')) {
      this.giftlayer(wx.getStorageSync('wx_giftlayer'));
      wx.removeStorageSync('wx_giftlayer');
    };
    if (wx.getStorageSync('wx_noticelayer')) {
      this.noticelayer(wx.getStorageSync('wx_noticelayer'));
      wx.removeStorageSync('wx_noticelayer');
    };
    if (wx.getStorageSync('wx_activelayer')) {
      this.activelayer(wx.getStorageSync('wx_activelayer'));
      wx.removeStorageSync('wx_activelayer');
    };
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
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
    return {
      title: shareTitle[x],
      path: `/others_pages/heart_center/heart_center?shareUserId=${user_id}&isStylist=${this.data.isStylist}&id=${this.data.id}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success(res){
      }
    }
  }
})