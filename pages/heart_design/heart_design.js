const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const util = require('../../utils/util.js');
let template = require('../../component/template/template.js');
import {
  getUrl,
  delNull,
  baseShare,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  nonspecificSharePage,
  faceSwap,
  faceSwapTitle,
  getCountInfo,
  getCountInfoTitle,
  getNewlyUsedPic,
  getNewlyUsedPicTitle,
  useNewlyPicFaceSwap,
  useNewlyPicFaceSwapTitle,
  saveFormId,
  saveFormIdTitle,
} from '../../config.js';
Page({
  data: {
    last_img: [],
    showDialog:false,
    showDialogs:false,
    last_img_hiden: true,
    takePhotoImgUrl:'',
    takePhotoImgUrlOrig:'',
    me_loading_type:0,
    meloadingvalue: '加载中...',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    giftShow: false,
    giftLayerBanner: [],
    showCameraDialog:false,//判断是否授权拍照
    code: '',
    giftShow: false,
    activeShow: false,
    goOnload: false,
    activeInfo: {},
    tramsHidden:true,
		shareType:true,
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
	closeShare(){
    this.setData({
      shareType:true,
    })

  },
  showLoadings(value) {
    this.setData({
      tramsHidden: false,
      sex:wx.getStorageSync('userInfo').sex ? '0' : '1'
    })
  },
  hidenLoadings() {
    this.setData({
      tramsHidden: true
    })
  },
  templateClick(e) {
    let para = {
      userId: user_id,
      version: version,
      smallprogramNo: smallProgramNo,
      formId: e.detail.formId
    }
    util.post(`${saveFormId}`, para).then(res => {

    }).catch(error => {
      uploadErrorInfoFn(`${saveFormIdTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
    })
  },
  showLoading(value) {
    this.setData({
      me_loading_type: 1,
      meloadingvalue: value
    })
  },
  onTabItemTap(item) {
    if (delNull(wx.getStorageSync('userInfo').userId) == '' || delNull(wx.getStorageSync('userInfo').sex) == '' ){
      wx.reLaunch({
        url: '../../pages/welcome/welcome',
      })
    }
  },
  hidenLoading() {
    this.setData({
      me_loading_type: 0,
      meloadingvalue: '加载中...'
    })
  },

  takePhoto() {
    const _this = this;
    wx.removeStorageSync('detailtodesign');
    wx.removeStorageSync('back');
    wx.removeStorageSync('chooseHeart');
		let para={
			userId: user_id,
			version: version
		};
		util.get(`${getCountInfo}`,para).then(res=>{
			if (res.code == 0) {
			  if (res.info.remainedCount <= 0 && !res.info.isUsed) {
			   _this.setData({
					shareType: false
				})
			  } else {
			    // 查看是否授权
			    wx.getSetting({
			      success: function (res) {
			        if (res.authSetting['scope.camera']) {
			          //用户已经授权过
			          wx.navigateTo({
			            url: '../../other_pages/takephoto/takephoto?form=design',
			          })
			        } else {
			          //用户没有授权过 
			          wx.authorize({
			            scope: 'scope.camera',
			            success(res) {
			              _this.setData({
			                showCameraDialog: false
			              });
			              wx.navigateTo({
			                url: '../../other_pages/takephoto/takephoto?form=design',
			              })
			            },
			            fail() {
			              _this.setData({
			                showCameraDialog: true
			              });
			            }
			          })
			        }
			      }
			    })
			  }
			} else {
        uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = "出错啦";
			  wx.navigateTo({
			    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			  _this.setData({
			    me_loading_type: 0,
			  })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			 let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			_this.setData({
			  me_loading_type: 0,
			})
		})
  },
  openSetting: function (e) {
    var that = this;
    if (e.detail.authSetting['scope.camera']) {
      that.setData({
        showCameraDialog: false
      });
      wx.navigateTo({
        url: '../../other_pages/takephoto/takephoto?form=design',
      })
    } else {
      that.setData({
        showCameraDialog: true
      });
    }
  },
  goPhoto: function () {
    var _this = this;
    wx.removeStorageSync('detailtodesign');
    wx.removeStorageSync('chooseHeart');
    wx.removeStorageSync('back');
		let para={
			userId: user_id,
			version: version
		};
		util.get(`${getCountInfo}`,para).then(res=>{
			if (res.code == 0) {
			  if (res.info.remainedCount <= 0 && !res.info.isUsed) {
			    _this.setData({
			      me_loading_type: 0,
			    })
				  _this.setData({
						shareType: false
					})
			  }else {
			    wx.chooseImage({
			      count: 1,
			      sizeType: ['original', 'compressed'],
			      sourceType: ['album'],
			      success: function (res) {
			        var tempFilePaths = res.tempFilePaths;
			        _this.setData({
			          takePhotoImgUrl: tempFilePaths[0],
			          takePhotoImgUrlOrig: tempFilePaths[0],
			        });
			        wx.navigateTo({
			          url: '../../other_pages/lookPhoto/lookPhoto?imgUrl=' + tempFilePaths[0] + '&isTake=false&from=' + _this.data.from,
			        })
			      }
			    })
			  }
			} else {
        uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
					url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				_this.setData({
					me_loading_type: 0,
				})
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			_this.setData({
			  me_loading_type: 0,
			})
		})
  },
  onShow(){
    this.getNewlyUsedPic();

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
    if (wx.getStorageSync('wx_activelayer')) {
      this.activelayer(wx.getStorageSync('wx_activelayer'));
      wx.removeStorageSync('wx_activelayer');
    };
  },
  getNewlyUsedPic() {
    const _this = this;
    let para = {
      userId: wx.getStorageSync('userInfo').userId,
      version: version
    }
    util.get(`${getNewlyUsedPic}`,para).then(res => {
      if( res.code == 0 ){
        _this.setData({
          last_img: res.info.usedPicList,
        })
      }else{
        uploadErrorInfoFn(`${getNewlyUsedPicTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
      }
    }).catch(e => {
      uploadErrorInfoFn(`${getNewlyUsedPicTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
    })
  },
  onLoad(){
    wx.hideTabBar();
    user_id = wx.getStorageSync('userInfo').userId;
    template.tabbar("tabBar", 2, this)
  },
  goToLook(e) {
    const _this = this;
    _this.showLoadings('正在设计');
    let option_data = {
      userId: user_id,
      version: version,
      faceId: e.currentTarget.dataset.faceid,
      filePath: e.currentTarget.dataset.filepath,
    }
		let para={
			 userId:user_id,
			version: version
		}
		util.get(`${getCountInfo}`,para).then(res=>{
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
			    wx.setStorageSync('detailtodesign', _this.data.no);
				   util.post(`${useNewlyPicFaceSwap}`,option_data).then(res1=>{
						_this.hidenLoading();
						let datas = res1.info;
						_this.setData({
						   heat_info: datas
						 }, () => {
						   if (res1.code == 0) {
									wx.setStorageSync('faceinfo', datas);
									if (JSON.stringify(res1.info.points) != "{}" && res1.info.points != null ){
										wx.setStorageSync('faceLayer', res1.info.points.points );
										if( wx.getStorageSync('hairLayer') != 1 ){
											wx.setStorageSync('hairLayer',0);
										}
									};
                 _this.hidenLoadings();
								 let stroageFace = wx.getStorageSync('userInfo');
								 if( stroageFace.paymentInfo.isPopup == 0 && stroageFace.paymentInfo.isPaymentUser == 1 ){
								 	stroageFace.paymentInfo.detectCounts = stroageFace.paymentInfo.detectCounts  +1;
								 }
								 wx.setStorageSync('userInfo',stroageFace);
						     wx.navigateTo({
						       url: '../heart_designs/heart_designs',
						     })
						   } else if (res.code == 5004) {
						     wx.navigateTo({
						       url: '../../other_pages/takephoto/takephoto?first=true',
						     })
						   } else {
						     wx.navigateTo({
						       url: '../../other_pages/takephoto/takephoto?first=true',
						     })
						   }
						 })
					}).catch(error=>{
            uploadErrorInfoFn(`${useNewlyPicFaceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(error)}`);
						let title = "系统通知";
						let notice = "出错啦";
						wx.navigateTo({
						  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
						})
						_this.hidenLoading();
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
			  _this.hidenLoading();
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			_this.hidenLoading();
		})
  },
  onMyEvent() {
    user_id = wx.getStorageSync('userInfo').userId;
  },
  points(e) {
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
  giftlayer(e) {
    this.setData({
      giftShow: true,
      giftLayerBanner: e.detail
    })
  },
  activelayer(e) {
    this.setData({
      activeShow: true,
      activeInfo: e
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
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  }
})