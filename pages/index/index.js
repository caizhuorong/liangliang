const app = getApp();
const version = require('../../config.js').version;
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const insertScanHistory = require('../../config.js').insertScanHistory;
const getSystemNotice = require('../../config.js').getSystemNotice;
const selectHomepageContents = require('../../config.js').selectHomepageContents;
const nonspecificSharePage = require('../../config.js').nonspecificSharePage;
const faceSwap = require('../../config.js').faceSwap;
let setInter="";
const util = require('../../utils/util.js');
let template = require('../../component/template/template.js');
const saveFormId = require('../../config.js').saveFormId;
import { uploadErrorInfoFn, formIdPost, getUrl, queryString, delNull, baseShare, numto, mathRandom} from '../../utils/util.js';
import { getSystemNoticeTitle, selectHomepageContentsTitle } from '../../config.js';
let goOnload= false;
let gotoxcxs = true;
Page({
  data: {
    userInfo: {},
    showDialogs:false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUse: wx.canIUse('button.open-type.getPhoneNumber'),
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
    isAgree: true,
    diaglo:true,
    data: {},
    note: [0,0,0],
    first_img_show:false,
    encryptedData:'',
    iv:'',
    shareLayer:false,
    layerBanner:'',
    layerLabel:'',
    layerTips:'',
    code:'',
    me_loading_type:0,
    meloadingvalue:'加载中...',
    giftShow: false,
	  activeShow: false,
    giftLayerBanner: [],
    noticeShow: false,
    noticeLayerBanner: [],
    activeInfo:{},
    sex:1,
	  param:'',
    tabShowType:false,
    templateNotice:'0',
    now:0,
    newYearTag:[],
    templateNoticeTagsLabel:[],
  },
  templateClick(e){
    formIdPost(saveFormId,e.detail.formId, user_id, version, smallProgramNo);
  },
  templateNotice(e){
    this.setData({
      templateNotice:'1',
      now:e.detail.now,
      // now: 1549728000000,
      templateNoticeTagsLabel: e.detail.templateNoticeTagsLabel.split(','),
      newYearTag: e.detail.templateNoticeTags.split(',')
    })
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
	giftlayer(e){
		this.setData({
			giftShow:true,
      giftLayerBanner:e.detail
		})
	},
  noticelayer(e) {
    this.setData({
      noticeShow: true,
      noticeLayerBanner: e.detail
    })
  },
	activelayer(e){
		this.setData({
		  activeShow: true,
      activeInfo:e
		})
    },
  gotomore(e){
    const _this = this;
    const _e = e.currentTarget.dataset;
    let json = JSON.parse(_e.url);
    if (json.type == 1) {
      if (json.level == 1) {
        if (json.param != undefined) {
          wx.setStorageSync('active_once', json.param);
        }
        wx.switchTab({
          url: json.page,
        })
      } else {
        if (json.param != undefined) {
          wx.navigateTo({
            url: json.page + json.param,
          })
        } else {
          wx.navigateTo({
            url: json.page,
          })
        }
      }
    } else if (json.type == 2) {
      wx.setStorageSync('goToH5', json);
      wx.navigateTo({
        url: json.page,
      })
    }else if( json.type == 3 ){
      if (gotoxcxs) {
        gotoxcxs = false;
        wx.navigateToMiniProgram({
          appId: json.appid,
          extraData: json.param,
          success() {
            gotoxcxs = true;
            console.log('小程序跳转成功');
          },
          fail() {
            gotoxcxs = true;
          },
        })
      }
    }
  },
  active_goto(e){
    /*
      0.1活动链接式样书(根据此规则来判断)
      先判断 interface 是否为空，若不为空则需要先调用接口，接口类型由 requestType 提供，默认get请求
      先判断 type 若为1 则是跳转小程序页面 2为跳转webview 页面
      然后判断 level 是否为一级菜单，若等于1则为一级菜单，以外都是一级菜单以外
      最后根据以上判断来跳转链接和参数的存储
    */
    const _this = this;
    const _e = e.currentTarget.dataset;
    let json = JSON.parse(_e.url);

    if (json.type == 1) {
      if (json.level == 1) {
        if (json.param != undefined) {
          wx.setStorageSync('active_once', json.param);
        }
        wx.switchTab({
          url: json.page,
        })
      } else {
        if (json.param != undefined) {
          wx.navigateTo({
            url: json.page + json.param,
          })
        } else {
          wx.navigateTo({
            url: json.page,
          })
        }
      }
    } else if (json.type == 2) {
      wx.setStorageSync('goToH5', json);
      wx.navigateTo({
        url: json.page,
      })
    } else if (json.type == 3) {
      if (gotoxcxs) {
        gotoxcxs = false;
        wx.navigateToMiniProgram({
          appId: json.appid,
          extraData: json.param,
          success() {
            gotoxcxs = true;
            console.log('小程序跳转成功');
          },
          fail() {
            gotoxcxs = true;
          },
        })
      }
    }
  },
  colseFirstShow(){
    this.setData({
      first_img_show:false
    })
  },
  gotoAi(e){
    const that = this;
    wx.removeStorageSync('detailtodesign');
    wx.removeStorageSync('chooseHeart');
    wx.removeStorageSync('back');
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.camera']) {
          //用户已经授权过
          formIdPost(saveFormId, e.detail.formId, user_id, version, smallProgramNo);
          wx.navigateTo({
            url: '../../other_pages/takephoto/takephoto?ai=true&from=index',
          })
        } else {
          //用户没有授权过 
          wx.authorize({
            scope: 'scope.camera',
            success(res) {
              that.setData({
                showCameraDialog: false
              });
              formIdPost(saveFormId, e.detail.formId, user_id, version, smallProgramNo);
              wx.navigateTo({
                url: '../../other_pages/takephoto/takephoto?ai=true&from=index',
              })
            },
            fail() {
              that.setData({
                showCameraDialog: true
              });
            }
          })
        }
      }
    })
  },
  gotosj(e){
    formIdPost(saveFormId, e.detail.formId, user_id, version, smallProgramNo);
    wx.removeStorageSync('chooseHeart');
    if( wx.getStorageSync('userInfo').newFlag == 1 ){
      const that = this;
      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.camera']) {
            wx.navigateTo({
              url: '../../other_pages/takephoto/takephoto?ai=true&from=index',
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
                  url: '../../other_pages/takephoto/takephoto?ai=true&from=index',
                })
              },
              fail() {
                that.setData({
                  showCameraDialog: true
                });
              }
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../heart_designs/heart_designs',
      })
    }
   
  },
  goToabout(){
    wx.navigateTo({
      url: '../about/about',
    })
  },
  onLoad: function(options) {
    wx.hideTabBar();
    const that = this;
    user_id = wx.getStorageSync('userInfo').userId;
    if (user_id != undefined  ){
      that.setData({
        tabShowType:true,
      },()=>{
        template.tabbar("tabBar", 0, that)
      })
    }
   
    if ( options != undefined ){
      that.setData({
        param: JSON.stringify(options)
      })  
    }
 
    if (wx.getStorageSync('userInfo').userId != undefined ){
      user_id = wx.getStorageSync('userInfo').userId;
      that.requestSystemNotice();
    }else{
    
    }
    var scene = "";
    if (options && options.scene) {
      scene = decodeURIComponent(options.scene)
      app.globalData.scene = scene;
    }
    goOnload= true;
    that.setData({
      scene: scene,
      
    });
  },
  onShow(){
    // this.onLoad();
    if (!goOnload ){
      
      this.onLoad();
    }
 
    if (wx.getStorageSync('active_tab')){
      wx.removeStorageSync('active_tab');
    }
    if (wx.getStorageSync('we_points')) {
      if (!wx.getStorageSync('wx_giftlayer')) {
        this.points(wx.getStorageSync('we_points'));
      }
      wx.removeStorageSync('we_points');
    }
    if (wx.getStorageSync('wx_giftlayer') ){
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
    if (wx.getStorageSync('templateNotice') ){
      this.templateNotice(wx.getStorageSync('templateNotice'));
    }
    if (wx.getStorageSync('userInfo').sex != undefined){
      this.setData({
        sex: wx.getStorageSync('userInfo').sex
      })
    }
  },
  gotouser_center(){
    let data = this.data.userInfo.userId == undefined ? this.data.data.sHairUserStylist.userId : this.data.userInfo.userId;
    wx.navigateTo({
      url: `../../others_pages/heart_center/heart_center?id=${data}&isStylist=1`,
    })
  },
  showLoading(){
    _this.setData({
      me_loading_type: 1,
      meloadingvalue: '加载中...'
    }) 
  },
  hidenLoading(){
    _this.setData({
      me_loading_type: 0,
      meloadingvalue: '加载中...'
    }) 
  },
  bindAgreeChange(e){
    this.setData({
      isAgree: !!e.detail.value.length
    });
    if (e.detail.value[0] == 'agree' ){
      this.setData({
        diaglo:true
      })
    }else{
      this.setData({
        diaglo: false
      })
    }
  },
  gotorzheartman(){
    wx.navigateTo({
      url: `../user_center/user_center?data=2&type=1&from=index`,
    })
  },
  //请求requestSystemNotice
  requestSystemNotice: function() {
    var that = this;
    // wx.showLoading({
    //   title: '加载中',
		// 	mask:true
    // })
    wx.stopPullDownRefresh();
    let para = {
      userId: user_id,
      version: version,
      smallprogramNo: smallProgramNo
    };
    util.get(`${getSystemNotice}`, para).then(res=>{
			var code = res.code;
			if (code == 0) {
			  // wx.hideLoading();
			  that.loadNext();
			} else if (code == 1002) {
        uploadErrorInfoFn(`${getSystemNoticeTitle}`, `event:进入页面请求;requestParameters:userId:${user_id},version:${version},smallprogramNo:${smallProgramNo};errorinfo:${JSON.stringify(res)}`);
			  var title =  "系统维护中";
			  var notice = "亲！您是洗剪吹还是烫拉染啊？<BR>AI大乐正在设计新发型，请稍候再来~~";
			  var imgurl = 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/img32.png';
			  wx.navigateTo({
			    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice + "&btnshow=false&imgurl=" + imgurl,
			  })
			  return;
			} else {
        uploadErrorInfoFn(`${getSystemNoticeTitle}`, `event:进入页面请求;requestParameters:userId:${user_id},version:${version},smallprogramNo:${smallProgramNo};errorinfo:${JSON(res)}`);
			  var title = "系统维护中";
			  var notice = "亲！您是洗剪吹还是烫拉染啊？<BR>AI大乐正在设计新发型，请稍候再来~~";
			  var imgurl = 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/img32.png';
			  wx.navigateTo({
			    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice + "&btnshow=false&imgurl=" + imgurl,
			  })
			  return;
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${getSystemNoticeTitle}`, `event:进入页面请求;requestParameters:userId:${user_id},version:${version},smallprogramNo:${smallProgramNo};errorinfo:${JSON.stringify(error)}`);
			var title = "系统维护中";
			var notice = "亲！您是洗剪吹还是烫拉染啊？<BR>AI大乐正在设计新发型，请稍候再来~~";
			var imgurl = 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/img32.png';
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice + "&btnshow=false&imgurl=" + imgurl,
			})
			return;
		})
  },
  loadNext: function() {
    var that = this;
    that.selectHomepageContents();
  },
  onHide: function() {
    goOnload = false;
  },


  //轮播图点击事件
  bindLink: function(e) {
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
  selectHomepageContents(){
    const _this = this;
    setInter = setInterval(function () {
      if (wx.getStorageSync('userInfo') != '') {
        user_id = wx.getStorageSync('userInfo').userId;
        _this.selectHomepageContentss();
      }else{
      }
    }, 800);
  },
  selectHomepageContentss() {
    const _this = this;
    clearInterval(setInter);
		let para={
			userId: user_id,
			version: version,
			sex: wx.getStorageSync('userInfo').sex,
		}
		util.get(`${selectHomepageContents}`,para).then(res=>{
			let _data = _this.data.info;
			let data = res.info;
			if (res.code == 0) {
			  let list_data = [];
			  if (data.resultList != undefined){
			    data.resultList.forEach(function (x, y) {
			      if( y < 3 ){
			        list_data.push({
			          name: x.showNick,
			          heart_num: x.accessCount == null ? '0' : numto(x.accessCount),
			          title: '',
			          url: x.filePathSmall,
			          avatar: x.personIcon,
			          id: x.no,
			          filePaths: x.filePaths.length,
			          isTemplate: x.isTemplate == null ? 0 : x.isTemplate,
			          new: delNull(x.newFlag) == 1 ? true : false,
			          show:false
			        })
			      }
			    })
			  };
			  _this.setData({
			    data: data,
			    note: list_data
			  })
			} else {
        uploadErrorInfoFn(`${selectHomepageContentsTitle}`, `event:进入页面请求;requestParameters:userId:${user_id},version:${version},sex:${wx.getStorageSync('userInfo').sex};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${selectHomepageContentsTitle}`, `event:进入页面请求;requestParameters:userId:${user_id},version:${version},smallprogramNo:${smallProgramNo};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			return;
		})

  },
  //用户点击了“去设置”
  openSetting: function(e) {
    var that = this;

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
  onPullDownRefresh(){
    user_id = wx.getStorageSync('userInfo').userId;
    // this.requestSystemNotice();
  },

  onMyEvent () {
    const _this = this;
    user_id = wx.getStorageSync('userInfo').userId;
    _this.setData({
      sex:wx.getStorageSync('userInfo').sex
    });
    _this.setData({
        tabShowType: true,
      }, () => {
        template.tabbar("tabBar", 0, _this)
      })
    _this.requestSystemNotice();
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
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
    return {
      title: shareTitle[x],
      path: `/pages/index/index?shareUserId=${user_id}&share=true&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: (res) => {
      }
    }
  },
})