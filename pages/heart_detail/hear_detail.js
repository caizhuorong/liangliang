const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const util = require('../../utils/util.js');
import { 
  saveFormId,
  saveFormIdTitle,
  deleteProductionToTemplate,
  deleteProductionToTemplateTitle,
  faceSwap,
  faceSwapTitle,
  getCountInfo,
  getCountInfoTitle,
  addProductionToTemplate,
  addProductionToTemplateTitle,
  refuseHair,
  refuseHairTitle,
  claimHair,
  claimHairTitle,
  deletePraise,
  deletePraiseTitle,
  addPraise,
  addPraiseTitle,
  deleteFavorite,
  deleteFavoriteTitle,
  addFavorite,
  addFavoriteTitle,
  deleteFollow,
  deleteFollowTitle,
  addFollow,
  addFollowTitle,
  selectHairStyleInfo,
  selectHairStyleInfoTitle,
  version
 } from '../../config.js';
import {
  numto,
  uploadErrorInfoFn,
  baseShare,
  delNull,
  getUrl,
  formIdPost,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    imgUrls: [],
    ass:0,
    asss:0,
    sex:0,
    zg_type: true,
    curret: 0,
    follow_type: true,
    zan_type: true,
    info: {},
    content_imgs: [],
    labels: [],
    totalTryHairCount:0,
    isStylist: 1,
    note: [],
    no: 0,
    isTemplate: 0, //1,发型 0，作品
    uploadtime: 0,
    content: '',
    favoriteId: 0,
    praiseId: 0,
    userIds: 0,
    imgheights: [],
    current:0,
    showDialog: false,
    showDialogs: false,
    isme:true,
    shareUserId:0,
    isCanClicked:0,
    claimNo:0,
    shareshow:false,
    gif_type:true,
    gif_curr:0,
    isClick:0,
    labelss:[],
    me_loading_type: 0,
    meloadingvalue: '加载中...',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    giftShow: false,
    activeShow: false,
    giftLayerBanner: [],
    noticeShow: false,
    noticeLayerBanner: [],
    templateNo:'',
    sHairTag:'',
	  activeInfo: {},
    tramsHidden: true,
		shareType:true,
  },
  templateClick(e) {
    formIdPost(saveFormId, e.detail.formId, user_id, version, smallProgramNo);
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
  noticelayer(e) {
    this.setData({
      noticeShow: true,
      noticeLayerBanner: e.detail
    })
  },
  showLoading(value) {
    this.setData({
      me_loading_type: 1,
      meloadingvalue: value
    })
  },
  showLoadings() {
    this.setData({
      tramsHidden:false
    })
  },
  activelayer(e) {
    console.log(1);
    this.setData({
      activeShow: true,
	    activeInfo:e
    })
  },
  giftlayer(e) {
    console.log(e);
    this.setData({
      giftShow: true,
      giftLayerBanner: e.detail
    })
  },
  hidenLoadings() {
    const _this = this;
    setTimeout(function () {
      _this.setData({
        tramsHidden:true
      })
    }, 1000)
  }, 
  hidenLoading() {
    const _this = this;
    setTimeout(function(){
      _this.setData({
        me_loading_type: 0,
        meloadingvalue: '加载中...'
      }) 
    },1000)
  },  
  imageLoad: function (e) {
    //获取图片真实宽度
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      ratio = imgwidth / imgheight;
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    imgheights.push(imgheight)
    this.setData({
      imgheights: imgheights,
    })
  },
  bindchange: function (e) {
    console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },
  goheartCenter() {
    if (this.data.shareUserId == 0 ){
      wx.navigateTo({
        url: '../../others_pages/heart_center/heart_center?id=' + this.data.userIds + '&isStylist=' + this.data.isStylist ,
      })
    }else{
      wx.navigateTo({
        url: '../../others_pages/heart_center/heart_center?id=' + this.data.userIds + '&isStylist=' + this.data.isStylist + '&shareUserId=' + this.data.shareUserId,
      })
    }
   
  },
  time(data) {
    var date = data;
    var year = date.substring(0, 4);
    var month = date.substring(5, 7);
    var day = date.substring(8, 10);
    var hour = date.substring(11, 13);
    var minute = date.substring(14, 16);
    var scord = date.substring(17, 19);
    var createTime = data;
    var date3 = this.GetDateStr(-1);
    var str3 = date3.split("-");  
    str3[1] = str3[1].length == 1 ? '0' + str3[1] : str3[1];  
    str3[2] = str3[2].length == 1 ? '0' + str3[2] : str3[2];   
    var date0 = this.GetDateStr(0); 
    var str0 = date0.split("-");  
    str0[1] = str0[1].length == 1 ? '0' + str0[1] : str0[1];  
    str0[2] = str0[2].length == 1 ? '0' + str0[2] : str0[2];  
    if (year == str3[0] && month == str3[1] && day == str3[2]) {
      return "昨天" + " " + hour + ":" + minute  
    } else if (year == str0[0] && month == str0[1] && day == str0[2]) {
      return "今天" + " " + hour + ":" + minute  
    } else {
      return createTime;
    }
  },
  GetDateStr(AddDayCount) { 
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    var y = dd.getFullYear(); 
    var m = dd.getMonth() + 1;
    var d = dd.getDate();
    return y + "-" + m + "-" + d; 
  },
  onLoad: function(options) {
    const _this = this;
    if( options.shareUserId!= undefined ){
      _this.setData({
        shareUserId:options.shareUserId,
        shareshow: false,
      })
    }
    _this.setData({
      no: options.templateNo,
      isTemplate: options.isTemplate,
    },()=>{
      user_id = wx.getStorageSync('userInfo').userId;
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            _this.setData({
              showDialog: false,
              showDialogs: false,
            });
            wx.getUserInfo({
              success: function (res) {
                if( wx.getStorageSync('userInfo').userId != undefined ){
                  _this.getajax()
                }
                
              },
            })
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
    });
  },
  points(e){
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
  onMyEvent(){
    user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    _this.getajax();
  },
  getajax(){
    const _this = this;
    let para={
      userId: user_id,
      version: version,
      no: _this.data.no,
      isTemplate: _this.data.isTemplate,
    }
    util.get(`${selectHairStyleInfo}`,para).then(res=>{
      let _data = _this.data.info;
      let data = res.info;
      if (res.info.sHairInfo.delFlag != 0 ){
        setTimeout(function(){
          wx.showToast({
            title: '该发型已被发布者删除',
            icon: 'none',
            duration: 1500
          })
        },1000)
        setTimeout(function(){
          wx.switchTab({
            url: '../square/square',
          })
        },2500)
        return false;
      };
      if (res.code == 0) {
        let content_imgs = [];
        data.relatedUserStylistResps.forEach(function (x, y) {
          content_imgs.push(x.personIcon);
        })
        let dates = _this.time(data.sHairInfo.updateTime);
        let notes = [];
        if (data.relatedTemplates != null || data.relatedTemplates.length != 0) {
          data.relatedTemplates.forEach(function (x, y) {
            notes.push({
              name: x.showNick,
              heart_num: x.accessCount == null ? '0' : numto(x.accessCount),
              url: x.filePathSmall,
              avatar: x.personIcon,
              id: x.no,
              filePaths: x.filePaths.length,
              isTemplate: x.isTemplate == null ? 0 : x.isTemplate,
              new: delNull(x.newFlag) == 1 ? true : false
            })
          })
        };
        
        let sHairTags = [];
        let sHairTagss = [];
        let sHairTag = '';
        if (data.sHairTags != null) {
          data.sHairTags.forEach(function (x, y) {
            if (x.tagType == '4') {
              sHairTags.push(x.tagLabel);
            };
            if (x.tagType == '5' || x.tagType == '11' || x.tagType == '12') {
              sHairTagss.push(x.tagLabel);
            }
            if( sHairTag == '' ){
              sHairTag = x.tag;
            }else{
              sHairTag = sHairTag + ','+ x.tag
            }
          });
        };
        _this.setData({
          info: data.thisStylist == null ? '' : data.thisStylist.user == undefined ? data.thisStylist.stylist : data.thisStylist.user,
          totalTryHairCount: data.totalTryHairCount == null ? 0 : numto(data.totalTryHairCount),
          uploadtime: dates,
          content: data.sHairInfo.synopsis,
          content_imgs: content_imgs,
          favoriteId: data.favoriteNo,
          praiseId: data.praiseNo,
          zg_type: data.thisStylist == null ? false : data.thisStylist.isFollowed == 1 ? false : true,
          zan_type: data.praiseNo != null ? false : true,
          follow_type: data.favoriteNo != null ? false : true,
          labels: sHairTags,
          labelss: sHairTagss,
          sHairTag: sHairTag,
          imgUrls: data.sHairInfo.filePaths,
          userIds: data.thisStylist == null ? '' : data.thisStylist.user == undefined ? data.thisStylist.stylist.userId : data.thisStylist.user.userId,
          isStylist: data.thisStylist == null ? '' : data.thisStylist.isStylist,
          meIsStylist: data.isStylist == null ? 0 : data.isStylist,
          note: notes,
          templateNo: data.sHairInfo.templateNo,
          isCanClicked: data.isCanClicked == null ? 0 : data.isCanClicked,
          isClick: delNull(data.isClicked),
          claimNo: data.claimNo == null || data.claimNo == undefined ? 0 : data.claimNo,
          isTemplate: data.sHairInfo.isTemplate
        }, () => {
          if (_this.data.userIds == wx.getStorageSync('userInfo').userId) {
            _this.setData({
              isme: false
            })
          }
        })
      } else {
        uploadErrorInfoFn(`${selectHairStyleInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    }).catch(es=>{
      uploadErrorInfoFn(`${selectHairStyleInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(es)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      return;
    })
  },
  addProductionToTemplate(){
    const _this = this;
    if( _this.data.isClick == 1 ){
      let para={
        userId: user_id,
        version: version,
        productionNo: _this.data.no,
      };
      util.post(`${deleteProductionToTemplate}`,para).then(res=>{
        if( res.code == 0 ){
          _this.setData({
            totalTryHairCount: res.info.totalTryHairCount,
            isClick:0,
          })
        }else{
          uploadErrorInfoFn(`${deleteProductionToTemplateTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = "出错啦";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          return;
        }
      }).catch(e=>{
        uploadErrorInfoFn(`${deleteProductionToTemplateTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        return;
      })
    }else{
			let para={
				userId: user_id,
				version: version,
				productionNo: _this.data.no,
			}
			util.post(`${addProductionToTemplate}`,para).then(res=>{
				let _data = _this.data.totalTryHairCount;
				let data = res.info;
				if (res.code == 0) {
				  _data = data.totalTryHairCount == null ? 0 : numto(data.totalTryHairCount);
				  _this.setData({
				    totalTryHairCount: _data,
				    isClick: 1,
				  })
				} else {
          uploadErrorInfoFn(`${addProductionToTemplateTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = "出错啦";
				  wx.navigateTo({
				    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				  return;
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${addProductionToTemplateTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				 let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				return;
			})
    }
  },
  followfn: function() {
    const _this = this;
    if (_this.data.follow_type) {
			let para={
				userId:user_id,
				version:version,
				no:_this.data.no,
				isTemplate:_this.data.isTemplate
			}
			util.post(`${addFavorite}`,para).then(res=>{
			  let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  _this.setData({
				    follow_type: !_this.data.follow_type,
				    favoriteId: res.info.favoriteNo,
				    gif_type:false,
				    gif_curr:1,
				    ass:Math.random() / 9999
				  });
				  setTimeout(function(){
				    _this.setData({
				      gif_type:true
				    })
				  },1500)
				} else {
          uploadErrorInfoFn(`${addFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${addFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				 let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				return;
			})
    } else {
			let param={
				userId:user_id,
				version:version,
				favoriteNo:_this.data.favoriteId,
				isTemplate:_this.data.isTemplate,
			}
			util.post(`${deleteFavorite}`,param).then(res=>{
				let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  _this.setData({
				    follow_type: !_this.data.follow_type
				  })
				} else {
          uploadErrorInfoFn(`${deleteFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${deleteFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				return;
			})
    }
  },
  ican() {
    const _this = this;
    if (_this.data.isCanClicked == 0 ){
			let para={
				userId: user_id,
				version: version,
				no: _this.data.no,
				isTemplate: _this.data.isTemplate,
			}
			util.post(`${claimHair}`,para).then(res=>{
			  wx.hideLoading();
				let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  let _userinfo = wx.getStorageSync('userInfo').personIcon;
				  let ss = _this.data.content_imgs;
				  ss.push(_userinfo);
				  _this.setData({
				    content_imgs: ss,
				    claimNo: data.claimNo,
				    isCanClicked:1,
				  })
				} else {
          uploadErrorInfoFn(`${claimHairTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${claimHairTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    }else{
			let param = {
				userId: user_id,
				version: version,
				claimNo: _this.data.claimNo
			}
			util.post(`${refuseHair}`,param).then(res=>{
				wx.hideLoading();
				let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  let _userinfo = wx.getStorageSync('userInfo').personIcon;
				  let ss = _this.data.content_imgs;
				  let index='';
				  ss.forEach(function(x,y){
				    if( x == wx.getStorageSync('userInfo').personIcon ){
				      index = y;
				    }
				  });
				  ss.splice(index);
				  _this.setData({
				    content_imgs: ss,
				    isCanClicked:0,
				    claimNo:0,
				  })
				} else {
          uploadErrorInfoFn(`${refuseHairTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${refuseHairTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    }
  },
  zanfn: function() {
    const _this = this;
    if (_this.data.zan_type) {
			let para={
				userId:user_id,
				version:version,
				no:_this.data.no,
				isTemplate:_this.data.isTemplate,
			}
			util.post(`${addPraise}`,para).then(res=>{
				wx.hideLoading();
				let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  _this.setData({
				    zan_type: !_this.data.zan_type,
				    praiseId: res.info.praiseNo,
				    gif_type:false,
				    gif_curr:0,
				    asss: Math.random() / 9999
				  });
				  setTimeout(function(){
				    _this.setData({
				      gif_type: true,
				    })
				  },1500)
				} else {
          uploadErrorInfoFn(`${addPraiseTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${addPraiseTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    } else {
			let param = {
				userId:user_id,
				version:version,
				no:_this.data.no,
				isTemplate:_this.data.isTemplate,
			}
			util.post(`${deletePraise}`,param).then(res=>{
				wx.hideLoading();
				let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  _this.setData({
				    zan_type: !_this.data.zan_type
				  })
				} else {
          uploadErrorInfoFn(`${deletePraiseTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${deletePraiseTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    }
  },
  followType() {
    const _this = this;
    if (_this.data.zg_type) {
			let para={
				userId:user_id,
				version:version,
				stylistId: _this.data.info.userId
			}
			util.post(`${addFollow}`,para).then(res=>{
				wx.hideLoading();
				let _data = _this.data.info;
				let data = res.info;
				if (res.code == 0) {
				  _this.setData({
				    zg_type: !_this.data.zg_type
				  })
				  if (res.info.points.points != undefined ){
						let banner_url = res.info.points.points.background;
						let _show;
						if (wx.getStorageSync('signLayer') == 1) {
							_show = false;
						} else {
							_show = true;
						}
						this.setData({
							shareLayer: _show,
							layerBanner: `${banner_url}`,
							layerLabel: res.info.points.points.prompt,
							layerTips: res.info.points.points.points,
							code: res.info.points.points.code
						});
					}
				} else {
          uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
     
    } else {
      wx.showModal({
        title: '提示',
        content: '确定不再关注此人？',
        confirmText: '确定',
        success(res1) {
          console.log(res1);
          if (res1.confirm  ){
						let param={
							userId:user_id,
							version:version,
							stylistId:_this.data.info.userId
						}
            util.post(`${deleteFollow}`, param).then(res=>{
							wx.hideLoading();
							let _data = _this.data.info;
							let data = res.info;
							if (res.code == 0) {
							  _this.setData({
							    zg_type: !_this.data.zg_type
							  })
							} else {
                uploadErrorInfoFn(`${deleteFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
							  let title = "系统通知";
							  let notice = '出错啦';
							  wx.navigateTo({
							    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
							  })
							}
						}).catch(error=>{
              uploadErrorInfoFn(`${deleteFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
							 let title = "系统通知";
							let notice = "出错啦";
							wx.navigateTo({
							  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
							})
							wx.hideLoading();
							return;
						})
          }
        }
      });
    }
  },
  goTotakephoto() {
    const _this = this;
    _this.showLoadings();
		let para={
			userId: user_id,
			version: version,
			templateNo: _this.data.templateNo
		}
		util.get(`${getCountInfo}`,para).then(res=>{
			if (res.code == 0 ) {
			  if (res.info.remainedCount <= 0 && !res.info.isUsed ) {
			    _this.hidenLoadings();
			    _this.setData({
			    		shareType: false
			    })
			  } else if (res.info.usedCount == 0 ) {
			    wx.navigateTo({
			      url: '../../other_pages/takephoto/takephoto?first=true&show=false&templateNo=' + _this.data.templateNo,
			    })
			    _this.hidenLoadings();
			  }else {
			    wx.setStorageSync('detailtodesign', _this.data.templateNo);
					let param={
						userId:user_id,
						templateNo: _this.data.templateNo,
						version: version,
					}
					util.post(`${faceSwap}`,param).then(res1=>{
						_this.hidenLoadings();
						let datas = res1.info;
						_this.setData({
						  heat_info: datas
						}, () => {
						  if (res1.code == 0) {
						    wx.setStorageSync('faceinfo', datas);
								if (JSON.stringify(res1.info.points) != "{}"  && res1.info.points != null){
									wx.setStorageSync('faceLayer', res1.info.points.points );
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
						      url: '../heart_designs/heart_designs',
						    })
						  } else if (res1.code == 5004) {
						    wx.showToast({
						      title:'你还没有拍照！',
						      icon:'none'
						    })
						    setTimeout(function(){
						      wx.navigateTo({
						        url: '../../other_pages/takephoto/takephoto?first=true',
						      })
						    },1500);
						  } else {
                uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res1)}`);
						    let title = "系统通知";
						    let notice = "出错啦";
						    wx.navigateTo({
						      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
						    })
						    _this.hidenLoadings();
						    return;
						  }
						})
					}).catch(error=>{
            uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
						let title = "系统通知";
						let notice = "出错啦";
						wx.navigateTo({
						  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
						})
						_this.hidenLoadings();
						return;
					})
			  }
			} else {
        uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = "出错啦";
			  wx.navigateTo({
			    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			  _this.hidenLoadings();
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			_this.hidenLoadings();
		})
  },
  changeSwiper: function(e) {
    this.setData({
      curret: e.detail.current
    })
  },
  onShow(){
    if (wx.getStorageSync('userInfo') ){
      this.setData({
        sex: wx.getStorageSync('userInfo').sex
      })
    }
    if (wx.getStorageSync('we_points')) {
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
    }
		wx.showShareMenu({
      withShareTicket: false
    })
    const _this = this;
    baseShare(_this);
    return {
      title: '我剪这款发型你觉得咋样？',
      path: `/pages/heart_detail/hear_detail?templateNo=${this.data.no}&isTemplate=${this.data.isTemplate}&shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: this.data.imgUrls[this.data.current],
      success(res){
      }
    }
  },
})