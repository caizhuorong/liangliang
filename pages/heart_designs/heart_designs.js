const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
let img_load = 0;
const util = require('../../utils/util.js');
import { 
  version,
  getHairStylist,
  getHairStylistTitle,
  getHairTypeTabs,
  getHairTemplateTagList,
  getHairTemplateTagListTitle,
  getHairTypeTabsTitle,
  getHairTemplateList,
  getHairTemplateListTitle,
  getHairColorList,
  getHairColorListTitle,
  dyeHair,
  dyeHairTitle,
  faceSwap,
  faceSwapTitle,
  addHairStyleFavorite,
  addHairStyleFavoriteTitle,
  delHairStyleFavorite,
  delHairStyleFavoriteTitle,
  countFaceSwap,
  countFaceSwapTitle,
  getQRCode,
  getQRCodeTitle,
  getNewlyUsedPic,
  getNewlyUsedPicTitle,
  changeHairSharePage,
  getCountInfo,
  getCountInfoTitle,
  useNewlyPicFaceSwap,
  useNewlyPicFaceSwapTitle,
  setCustomerRelation,
  setCustomerRelationTitle,
  faceDetectCounts
}  from '../../config.js';
import {
  baseShare,
  delNull,
  getUrl,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
let height=0;
let sex='';
let fiveNum = 0;
let unRecommend = false;
let faceNum = 1;
Page({
  data: {
    follow_type: false,
    heat_info: {},
    man_list: [],
    list: [],
    isShare: false,
    head_img: [],
    bottom_scroll: false,
    pagesize: 30,
    pagenum: 1,
    label_list:[],
    heart_template: [],
    curr: 1,
    onReachBottom: true,
    photohistory: [],
    last_color_id: 0,
    last_heart_id: 0,
    favoriteNo: 0,
    cantype: true,
    bigimg: '',
    bigimg1: '',
    ewm: '',
    showDialog: false,
    showDialogs: false,
    img_load: false,
    caning: false,
    nophone: true,
    interval: "",
    changeHeight: 0,
    isFromDetail:false,
    active_color:false,
    imgheight: 0,
    ass: 0,
    gif_type: false,
    detailgettemplateNo:'',
    screenHeight:0,
    screenWidth:0,
    shareshow:false,
    me_loading_type:0,
    meloadingvalue: '加载中...',
    animationData:{},
    resultFileUrls:"",
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    giftShow: false,
    giftLayerBanner: [],
    icon_left_switch:false,//左边列表开关
    icon_right_switch: false,//右边列表开关
    hair_color_list:[],//左边发型列表
    scene:'',
    param:'',
    shareLayer: false,
    layerBanner: '',
    layerLabel: '',
    layerTips: '',
    code:'',
    activeShow: false,
    activeInfo:{},
    tramsHidden: true,
    sex:0,
    fiveType:false,
    custmoerType:true,
    choose_type:false,
    label_click:'',
    shareType:true,
  },
  chooseType: function (e) {
    const _this = this;
    _this.setData({
      choose_type: !_this.data.choose_type
    })
  },
  chooseTypeLeft(e) {
    const _this = this;
    if (e.detail.y < 70 ) {
      _this.setData({
        choose_type: !_this.data.choose_type
      })
    }
  },
  layer_qd() {
    const _this = this;
    let _data = _this.data.label_list;
    let data = '';
    _data.forEach(function (x, y) {
      x.children.forEach(function (xs, ys) {
        if (xs.staut) {
          if (data == '') {
            data = data + xs.id
          } else {
            data = data + ',' + xs.id
          }
        }
      });
    });
    _this.setData({
      label_click: data,
      page_num: 1,
      choose_type: false,
      loading_text: '加载中...',
      onReachBottom: false,
      heart_template:[]
    },()=>{
      _this.getHairTemplateList(110);
    });
  },
  layer_cancel: function () {
    let _data = this.data.label_list;
    _data.forEach(function (x, y) {
      x.children.forEach(function (xs, ys) {
        if (x.id == 1 && xs.id == 'TT1|TL1E' && wx.getStorageSync('userInfo').sex == '0') {
          xs.staut = true;
        } else if (x.id == 1 && xs.id == 'TT1|TL2E' && wx.getStorageSync('userInfo').sex == '1') {
          xs.staut = true;
        } else {
          xs.staut = false;
        }
      })
    });
    this.setData({
      label_list: _data,
    })
  },
  changeChose: function (e) {
    let _data = this.data.label_list;
    let data = e.currentTarget.dataset;
    _data[data.ids].children[data.id].staut = !_data[data.ids].children[data.id].staut;
    this.setData({
      label_list: _data
    })
  },
	getUserInfoFaceNum(){
		let facePopNum = wx.getStorageSync('userInfo');
		if( facePopNum.paymentInfo.isPopup == 0 && facePopNum.paymentInfo.isPaymentUser == 1 ){
      if (facePopNum.paymentInfo.detectCounts >= faceDetectCounts ){
				this.setData({
          custmoerType:false
				})
        this.kf();
			}
		}
	},
  goToLook(e) {
    const _this = this;
    _this.showLoading('正在设计');
    let option_data = {
      userId: user_id,
      version: version,
      faceId: e.currentTarget.dataset.faceid,
      filePath: e.currentTarget.dataset.filepath,
    }
    if (_this.data.heat_info.templateNo != '' && _this.data.heat_info.templateNo != undefined && _this.data.heat_info.templateNo != 'undefined') {
      option_data['templateNo'] = _this.data.heat_info.templateNo;
    };
    util.get(`${getCountInfo}`, option_data).then(res => {
      if (res.code == 0) {
        if (res.info.remainedCount <= 0 && !res.info.isUsed) {
					_this.setData({
						shareType: false
					})
        } else if (res.info.usedCount == 0) {
          _this.setData({
            nophone: false,
          })
          _this.hidenLoading();
        } else {
          util.post(`${useNewlyPicFaceSwap}`, option_data).then(res1 => {
            let datas = res1;
            if (datas.code == 0) {
              wx.setStorageSync('faceinfo', datas.info);
              _this.maskTop();
              img_load = 0;
              _this.setData({
                last_heart_id: _this.data.heat_info.templateNo,
                img_load: false,
                caning: false,
                heat_info: datas.info,
                photohistory:[],
              }, () => {
                _this.data.photohistory.push({
                  id: res1.info.templateNo,
                  url: res1.info.resultFileUrl,
                  path: res1.info.resultFilePath,
                  children: [
                    {
                      id: -1,
                      url:res1.info.resultFileUrl,
                      path:res1.info.resultHairFilePath,
                    }
                  ]
                });
                _this.setData({
                  photohistory: _this.data.photohistory,
                  img_load: false,
                })
              })
              wx.hideLoading();
							let stroageFace = wx.getStorageSync('userInfo');
							if( stroageFace.paymentInfo.isPopup == 0 && stroageFace.paymentInfo.isPaymentUser == 1 ){
								stroageFace.paymentInfo.detectCounts = stroageFace.paymentInfo.detectCounts  +1;
							}
							wx.setStorageSync('userInfo',stroageFace);
							_this.getUserInfoFaceNum();
              _this.hidenLoadings();
              _this.hidenLoading();
            } else {
              _this.hidenLoading();
              _this.hidenLoadings();
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
            _this.hidenLoading();
            _this.hidenLoadings()
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
    }).catch(e => {
      uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      _this.hidenLoading()
      return;
    })
  },
  getNewlyUsedPic() {
    const _this = this;
    let para={
      userId: wx.getStorageSync('userInfo').userId,
      version: version
    };
    util.get(`${getNewlyUsedPic}`,para).then(res => {
      if( res.code == 0 ){
        _this.setData({
          last_img: res.info.usedPicList,
        })
      }else{
        uploadErrorInfoFn(`${getNewlyUsedPicTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    }).catch(e => {
      uploadErrorInfoFn(`${getNewlyUsedPicTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
    })
  },
  icon_left_switch(e){
    const _this = this;
    img_load = 0;
    _this.dyeHair(e.currentTarget.dataset.id);
    _this.data.hair_color_list.forEach(function (x, y) {
       x.active = false;
    })
    _this.setData({
      hair_color_list: _this.data.hair_color_list,
      last_color_id: e.currentTarget.dataset.id,
      img_load: false,
      caning: false,
      icon_left_switch: !_this.data.icon_left_switch
    })
  },
  goSquare(){
    wx.reLaunch({
      url: '../../pages/square/square',
    })
  },
  activelayer(e) {
    this.setData({
      activeShow: true,
      activeInfo: e
    })
  },
  icon_right_switch(e) {
    const _this = this;
    _this.setData({
      icon_right_switch: !_this.data.icon_right_switch
    })
  },
  showLoading(value) {
    if (value!= undefined ){
      this.setData({
        me_loading_type: 1,
        meloadingvalue: value
      })
    }else{
      this.setData({
        me_loading_type: 1,
      })
    }
  },
  showLoadings() {
    this.setData({
      tramsHidden:false,
    })
  },
  giftlayer(e) {
    this.setData({
      giftShow: true,
      giftLayerBanner: e.detail
    })
  },
  hidenLoading() {
    this.setData({
      me_loading_type: 0,
      meloadingvalue: '加载中...'
    })
  },
  hidenLoadings() {
    this.setData({
      tramsHidden:true
    })
  },
  imgLoad(e) {
    const _this = this;
    img_load = img_load + 1;
    if (img_load == 1) {
      let img_height = e.detail.height;
      this.setData({
        resultFileUrls:_this.data.heat_info.resultFileUrl,
        imgheight: img_height,
      })
      img_load = 0;
      if (wx.getStorageSync('detailtodesign') != null && wx.getStorageSync('detailtodesign') != '' && wx.getStorageSync('detailtodesign') != undefined) {
        if (_this.data.heat_info.templateNo == wx.getStorageSync('detailtodesign') ){
          setTimeout(function(){
            _this.hidenLoadings();
            if (!_this.data.active_color ){
              _this.data.heart_template.forEach(function (x, y) {
                if (x.templateNo == _this.data.heat_info.templateNo) {
                  x.active = true;
                } else {
                  x.active = false;
                }
              })
              _this.setData({
                heart_template: _this.data.heart_template
              })
            }
            wx.removeStorageSync('active_tab');
          },500)
        }
      } else {
        setTimeout(function () {
          _this.hidenLoadings();
          if (!_this.data.active_color) {
            _this.data.heart_template.forEach(function (x, y) {
              if (x.templateNo == _this.data.heat_info.templateNo) {
                x.active = true;
              } else {
                x.active = false;
              }
            })
            _this.setData({
              heart_template: _this.data.heart_template
            })
          }
          wx.removeStorageSync('active_tab');
        }, 500)
      };
    
    }
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
  onMyEvent() {
    user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    _this.getajax();
    _this.getQRCode();
  },
  pic_url() {
    let sys_data = wx.getSystemInfoSync();
    let d_rex = sys_data.windowHeight / sys_data.windowWidth;
    let heights = 0;
    console.log(d_rex);
    if (d_rex > 1.73) {
      console.log(123);
      heights =550;
    } else {
      heights = 350;
    }
    this.setData({
      changeHeight: heights,
      icon_right_switch:false
    })
  },
  close() {
    this.setData({
      cantype: true
    })
  },
  btn() {
    this.bindToCanvas();
  },
  bindToCanvas: function () {
    var $this = this;
    $this.showLoading('正在生成海报，请稍候');
    if ($this.data.caning) {
      $this.hidenLoading();
      return false;
    }
    const ctx = wx.createCanvasContext('friend');
    let img1 = $this.data.heat_info.resultFileUrl;
    let img2 = $this.data.ewm;
    var w1 = '';
    var h1 = '';
    let w2 = '';
    let h2 = '';
    let w3 = '', h3 = '';
    let deisx = 750 / wx.getSystemInfoSync().screenWidth;
    wx.getImageInfo({
      src: img1,
      success: function (res2) {
        img1 = res2.path;
        w2 = res2.width;
        h2 = res2.height;
        ctx.setFillStyle('#ffffff');
        ctx.fillRect(0, 0, 550 / deisx, 714 / deisx);
        ctx.setFillStyle('#3f3f3f');
        ctx.setTextAlign('left');
        ctx.setFontSize(25 / deisx);
        let storageShareInfo = wx.getStorageSync('shareInfo');
        let text = '';
        let shareTitle = storageShareInfo.designTitle.split('|');
        let x = Math.round(Math.random() * (shareTitle.length - 1));
        text = shareTitle[x];//这是要绘制的文本
        if (delNull($this.data.heat_info.shareTitle) != '') {
          text = $this.data.heat_info.shareTitle;
        }
        if ( text != undefined && text != '' ){
          var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
          var temp = "";
          var row = [];
          for (var a = 0; a < chr.length; a++) {
            if (ctx.measureText(temp).width < 365 / deisx) {
              temp += chr[a];
            } else {
              a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
              row.push(temp);
              temp = "";
            }
          }
          row.push(temp);
          if (row.length > 2) {
            var rowCut = row.slice(0, 2);
            var rowPart = rowCut[1];
            var test = "";
            var empty = [];
            for (var a = 0; a < rowPart.length; a++) {
              if (ctx.measureText(test).width < 365 / deisx) {
                test += rowPart[a];
              }else {
                break;
              }
            }
            empty.push(test);
            var group = empty[0] + "..."//这里只显示两行，超出的用...表示
            rowCut.splice(1, 1, group);
            row = rowCut;
          }
          for (var b = 0; b < row.length; b++) {
            ctx.fillText(row[b], 30 / deisx, 600 / deisx + b * 25,365/deisx);
          }
        }
        ctx.drawImage(img1, 0, 0, w2, w2, 0, 0, 550 / deisx, 549 / deisx);
        wx.getImageInfo({
          src: img2,
          success: function (res4) {
            img2 = res4.path;
            ctx.drawImage(img2, 404 / deisx, 561 / deisx, 116 / deisx, 116 / deisx, );
            ctx.setFillStyle('#3f3f3f');
            ctx.setTextAlign('left');
            ctx.setFontSize(23 / deisx);
            ctx.draw(true, () => setTimeout(()=>{
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: 550 / deisx,
                height: 714 / deisx,
                destWidth: 550 * 2,
                destHeight: 714 * 2,
                canvasId: 'friend',
                quality: 1,
                success: function (res) {
                  $this.setData({
                    bigimg: res.tempFilePath,
                    caning: false,
                  }, () => {
                    $this.save_img();
                  });
                  $this.hidenLoading();
                },
                fail(error) {
                }
              })
            },200));
          },
          fail(error) {
            console.log(error)
          }
        });
      },
      fail(error) {
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    })
  },
  save_img() {
    const _this = this;
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.bigimg,
      success: function (res) {
        wx.showModal({
          title: '海报已保存至系统相册',
          content: '快分享给好友,让小伙伴们一起来体验!',
          'showCancel': false,
          'confirmText': '我知道了',
          success() {
           
          },
        })
      },
      fail(error) {
        wx.showModal({
          "title": "提示",
          'content': '您还没有授权相册，请点击‘设置’，去授权',
          'showCancel': true,
          'cancelText': '取消',
          'confirmText': '设置',
          success(ressss) {
            if (ressss.confirm) {
              wx.openSetting({
                success(resss) {
                  if (resss.authSetting["scope.writePhotosAlbum"]) {
                  } else {
                  }
                },
                fail(errors) {
                }
              })
            }
          },
          fail(errorss) {
          }
        });
      }
    })
  },
  changewidth() {
    let sys_data = wx.getSystemInfoSync();
    let d_rex = sys_data.windowWidth / 750;
    let sya_heighe = sys_data.windowHeight - sys_data.windowWidth;
    this.setData({
      changeHeight: (sys_data.windowHeight - 640 * d_rex) / d_rex,
    })
    height = (sys_data.windowHeight - 640 * d_rex) / d_rex;
  },
  works(e) {
    const _this = this;
    img_load = 0;
    _this.dyeHair(e.currentTarget.dataset.id)
    _this.setData({
      last_color_id: e.currentTarget.dataset.id,
      img_load: false,
      caning: false,
    })
    _this.data.hair_color_list.forEach(function (x, y) {
      if (x.templateNo == e.currentTarget.dataset.id) {
        x.active = true;
      } else {
        x.active = false;
      }
    })
    _this.setData({
      hair_color_list: _this.data.hair_color_list,
    })
  },
  fiveHide(){
    const _this = this;
    setTimeout(()=>{
      _this.setData({
        fiveType:false,
      })
    },5000)
  },
  custmoerCloser(){
    this.setData({
      custmoerType:true,
    })
  },
  ffjs(){
    wx.navigateTo({
      url: '../pay/pay',
    })
  },
  fxjs(){
    this.setData({
      shareType:true
    })
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
    let facePopNum = wx.getStorageSync('userInfo');
    facePopNum.paymentInfo.isPopup =1;
    wx.setStorageSync('userInfo', facePopNum)
  },
  work(e) {
    const _this = this;
    _this.data.hair_color_list.forEach(function (x, y) {
      x.active = false;
    })
    _this.setData({
      hair_color_list: _this.data.hair_color_list,
      icon_left_switch: false,
      icon_right_switch:false,
      last_color_id:-1,
    },()=>{
      if (e.currentTarget.dataset.id != -2) {
          if (e.currentTarget.dataset.id != _this.data.heat_info.templateNo) {
            let para={
              userId: user_id,
              version: version,
              templateNo: e.currentTarget.dataset.id
            }
            util.get(`${getCountInfo}`,para).then(res=>{
              if (res.code == 0) {
                if (res.info.remainedCount <= 0 && !res.info.isUsed) {
                  _this.setData({
                  		shareType: false
                  })
                } else {
                  img_load = 0;
                  unRecommend = true;
                  _this.faceSwap(e.currentTarget.dataset.id);
                  _this.setData({
                    last_heart_id: e.currentTarget.dataset.id,
                    img_load: false,
                    caning: false,
                  })
                }
              } else {
                uploadErrorInfoFn(`${getCountInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
                let title = "系统通知";
                let notice = "出错啦";
                wx.navigateTo({
                  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                })
              }
            }).catch(error=>{
              uploadErrorInfoFn(`${getCountInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
              let title = "系统通知";
              let notice = "出错啦";
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            })
          };
        _this.data.heart_template.forEach(function (x, y) {
          if (x.templateNo == e.currentTarget.dataset.id) {
            x.active = true;
          } else {
            x.active = false;
          }
        })
        _this.setData({
          heart_template: _this.data.heart_template,
        })
      } else {
        let data = {
          subtab: '0',
          condition: []
        };
        wx.setStorageSync('active_once', data)
        wx.reLaunch({
          url: '../square/square',
        })
      }
    })
  },
  forfav() {
    const _this = this;
    let _data = _this.data.heat_info;
    let _data_id = _data.templateNo;
    let _historydata = _this.data.photohistory;
    let _data_colorid = _data.colorId == undefined ? -1 : _data.colorId;
    _this.setData({
      follow_type: false,
      favoriteNo: 0,
    }, () => {
      _historydata.forEach(function (x, y) {
        if (x.id == _data_id) {
          x.children.forEach(function (xs, ys) {
            if (xs.id == _data_colorid) {
              if (xs.favt) {
                _this.setData({
                  follow_type: true,
                })
              }
              if (xs.favtid) {
                _this.setData({
                  favoriteNo: xs.favtid,
                })
              }
            }
          })
        }
      })
    });
   _this.hidenLoading();
    wx.hideLoading()
  },
  goToHeartMan() {
    wx.navigateTo({
      url: '../../others_pages/heart_man/heart_man',
    })
  },
  facerh(tempid, id) {
    const _this = this;
    let datass = {
      userId: user_id,
      version: version,
      faceId: wx.getStorageSync('faceinfo').faceId,
      templateNo: id,
    }
    _this.data.heart_template.forEach(function (x, y) {
      if (x.templateNo == id) {
        _this.data.heart_template[y].loading = true;
        _this.setData({
          heart_template: _this.data.heart_template
        })
      }
    });
    if( unRecommend ){
      _this.showLoading();
    }else{
      _this.showLoadings();
    }
    util.post(`${faceSwap}`,datass).then(res=>{
      let data = res.info;
      if (res.code == 0) {
				let stroageFace = wx.getStorageSync('userInfo');
				if( stroageFace.paymentInfo.isPopup == 0 && stroageFace.paymentInfo.isPaymentUser == 1 ){
					stroageFace.paymentInfo.detectCounts = stroageFace.paymentInfo.detectCounts  +1;
				}
				wx.setStorageSync('userInfo',stroageFace);
				_this.getUserInfoFaceNum();
        fiveNum++;
        faceNum = faceNum + 1;
        _this.setData({
          custmoerType: faceNum == 8 ? false:true
        })
        if (fiveNum == 6) {
          fiveNum = 1
        };
        if (fiveNum == 5) {
          _this.setData({
            fiveType: true,
          })
          _this.fiveHide();
        } else {
          if (_this.data.fiveType) {
            _this.setData({
              fiveType: false,
            })
          }
        }
        let heart_color = res.info.resultHairFileUrl;
        let heart_colors = res.info.resultHairFilePath;
        let heart_temp = res.info.resultFileUrl;
        let heart_temps = res.info.resultFilePath;
        let resultHairFileUrls = _this.data.heat_info;
        resultHairFileUrls.resultHairFilePath = heart_colors;
        resultHairFileUrls.resultFilePathColorPath = heart_colors;
        resultHairFileUrls.resultFileUrl = heart_temp;
        resultHairFileUrls.resultFilePath = heart_temps;
        resultHairFileUrls.templateNo = res.info.templateNo;
        resultHairFileUrls.productionNo = res.info.productionNo;
        resultHairFileUrls.shareTitle = res.info.shareTitle;
        resultHairFileUrls.colorId = -1;
        wx.setStorageSync('faceinfo', resultHairFileUrls)
        if (JSON.stringify(res.info.points) != "{}" && res.info.points != null) {
          let storage = res.info.points.points;
					let banner_url = storage.background;
					let _show;
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
        _this.setData({
          heat_info: resultHairFileUrls,
        }, () => {
          _this.data.photohistory.push({
            id: id,
            url: heart_temp,
            path: heart_temps,
            children: [
              {
                id: tempid == null ? -1 : tempid,
                url: heart_temp,
                path: heart_colors,
              }
            ]
          });
          _this.setData({
            photohistory: _this.data.photohistory,
            img_load: false,
          }, () => {
            _this.forfav();
            if (wx.getStorageSync('detailtodesign') != '') {
              let hairt_type = 0;
              _this.data.head_img.forEach(function (x, y) {
                if (wx.getStorageSync('active_tab')) {
                  if (y == wx.getStorageSync('active_tab').typeTab) {
                    x.selFlag = 1;
                  } else {
                    x.selFlag = 0;
                  };
                }
                if (x.selFlag == 1) {
                  hairt_type = x.hairType;
                };
              });
              _this.setData({
                onReachBottom: true,
                heart_template: [],
                pagenum: 1
              })
              _this.getHairTemplateList(hairt_type);
            };
            _this.data.heart_template.forEach(function (x, y) {
              if (x.templateNo == id) {
                _this.data.heart_template[y].isUsed = 1;
                _this.data.heart_template[y].loading = false;
                _this.setData({
                  heart_template: _this.data.heart_template
                })
              }
            });
            wx.removeStorageSync('detailtodesign');
          })
        });

      } else if (res.code == 5004) {
        wx.showToast({
          title: '你还没有拍照！',
          icon: 'none'
        })
        setTimeout(function () {
          if (delNull(_this.data.detailgettemplateNo) != '') {
            wx.navigateTo({
              url: '../../other_pages/takephoto/takephoto?first=true&show=false&templateNo=' + _this.data.heat_info.templateNo,
            })
          } else {
            wx.navigateTo({
              url: '../../other_pages/takephoto/takephoto?first=true',
            })
          }
        }, 1500);
      } else {
        uploadErrorInfoFn(`${faceSwapTitle}`, `event:按钮点击;requestParameters:${JSON.stringify(datass)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        _this.hidenLoadings();
        _this.hidenLoading();
        return;
      }
      _this.hidenLoadings();
      _this.hidenLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${faceSwapTitle}`, `event:按钮点击;requestParameters:${JSON.stringify(datass)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      _this.hidenLoadings();
      _this.hidenLoading();
      return;
    })
  },
  faceSwap(id) {
    const _this = this;
    let colorid = _this.data.last_color_id == 0 ? -1 : _this.data.last_color_id;
    let nummm = 0;
    _this.data.photohistory.forEach(function (x, y) {
      if (id == x.id) {
        _this.setData({
          heat_info: _this.data.heat_info
        });
        if (x.children.length != 0) {
          let fornum = 0;
          x.children.forEach(function (xs, ys) {
            if (xs.id == colorid) {
              _this.data.heat_info.resultHairFileUrl = xs.url;
              _this.data.heat_info.resultHairFilePath = xs.path;
              _this.data.heat_info.colorId = xs.id;
              _this.data.heat_info.resultFileUrl = x.url;
              _this.data.heat_info.resultFilePath = x.path;
              _this.data.heat_info.templateNo = x.id;
              _this.data.heat_info.productionNo = x.productionNo;
              _this.data.heat_info.shareTitle = x.shareTitle;
              _this.setData({
                heat_info: _this.data.heat_info,
                img_load: false
              }, () => {
                _this.forfav();
              })
            } else {
              fornum = fornum + 1;
              if (fornum == x.children.length) {
                _this.showLoading('正在设计');
                let para={
                  userId: user_id,
                  version: version,
                  faceId: wx.getStorageSync('faceinfo').faceId,
                  templateNo: id,
                  colorNo: colorid,
                  filePath: wx.getStorageSync('faceinfo').filePath,
                  resultFilePath: wx.getStorageSync('faceinfo').resultFilePath
                }
                util.post(`${dyeHair}`, para).then(res=>{
                  let data = res.info;
                  if (res.code == 0) {
                    let heart_color = res.info.resultFilePathColorUrl;
                    let heart_colors = res.info.resultFilePathColor;
                    let resultHairFileUrls = _this.data.heat_info;
                    resultHairFileUrls.resultFileUrl = heart_color;
                    resultHairFileUrls.productionNo = res.info.productionNo;
                    resultHairFileUrls.resultHairFilePath = heart_colors;
                    resultHairFileUrls.colorId = colorid;
                    resultHairFileUrls.templateNo = id;
                    resultHairFileUrls.shareTitle = res.info.shareTitle;
                    _this.data.heat_info.resultFileUrl = x.url;
                    _this.data.heat_info.resultFilePath = x.path;
                    _this.setData({
                      heat_info: resultHairFileUrls,
                    }, () => {
                      _this.data.photohistory[y].children.push({
                        id: colorid,
                        url: heart_color,
                        path: heart_colors
                      });
                      _this.setData({
                        photohistory: _this.data.photohistory
                      }, () => {
                        _this.forfav();
                        if (wx.getStorageSync('detailtodesign') != '') {
                          let hairt_type = 0;
                          _this.data.head_img.forEach(function (x, y) {
                            if (wx.getStorageSync('active_tab')) {
                              if (y == wx.getStorageSync('active_tab').typeTab) {
                                x.selFlag = 1;
                              } else {
                                x.selFlag = 0;
                              };
                            }
                            if (x.selFlag == 1) {
                              hairt_type = x.hairType;
                            };
                          });
                          _this.getHairTemplateList(hairt_type);
                        }
                      })
                    });
                  } else if (res.code == 5004) {
                    if (delNull(_this.data.detailgettemplateNo) != '') {
                      wx.navigateTo({
                        url: '../../other_pages/takephoto/takephoto?first=true&show=false&templateNo=' + _this.data.heat_info.templateNo,
                      })
                    } else {
                      wx.navigateTo({
                        url: '../../other_pages/takephoto/takephoto?first=true',
                      })
                    }
                  } else {
                    uploadErrorInfoFn(`${dyeHairTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
                    let title = "系统通知";
                    let notice = '出错啦';
                    wx.navigateTo({
                      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                    })
                  }
                  _this.hidenLoadings();
                  _this.hidenLoading();
                }).catch(error=>{
                  uploadErrorInfoFn(`${dyeHairTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
                  _this.hidenLoadings();
                  _this.hidenLoading();
                  let title = "系统通知";
                  let notice = "出错啦";
                  wx.navigateTo({
                    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                  })
                  return;
                })
              }
            }
          })
        }
      } else {
        nummm = nummm + 1;
        if (nummm == _this.data.photohistory.length) {
          _this.facerh(colorid, id, 0);
        }
      }
    });
  },
  dyeHair(id) {
    let heart_dd = wx.getStorageSync('faceinfo');
    const _this = this;
    let tempid = _this.data.last_heart_id == 0 ? wx.getStorageSync('faceinfo').templateNo : _this.data.last_heart_id;
    _this.data.photohistory.forEach(function (x, y) {
      if (tempid == x.id) {
        if (x.children.length != 0) {
          let fornum = 0;
          x.children.forEach(function (xs, ys) {
            if (xs.id == id) {
              _this.data.heat_info.resultFileUrl = xs.url;
              _this.data.heat_info.resultHairFilePath = xs.path;
              _this.data.heat_info.resultFilePath = xs.path;
              _this.data.heat_info.colorId = xs.id;
              _this.setData({
                heat_info: _this.data.heat_info,
              }, () => {
                _this.forfav();
              })
            } else {
              fornum = fornum + 1;
              if (fornum == x.children.length) {
              _this.showLoading('正在设计');
              let para={
                userId: user_id,
                version: version,
                faceId: wx.getStorageSync('faceinfo').faceId,
                templateNo: tempid,
                colorNo: id,
                filePath: wx.getStorageSync('faceinfo').filePath,
                resultFilePath: wx.getStorageSync('faceinfo').resultFilePath
              }
                util.post(`${dyeHair}`,para).then(res=>{
                  let data = res.info;
                  if (res.code == 0) {
                    let heart_color = res.info.resultFilePathColorUrl;
                    let heart_colors = res.info.resultFilePathColor;
                    let resultHairFileUrls = _this.data.heat_info;
                    resultHairFileUrls.resultFileUrl = heart_color;
                    resultHairFileUrls.resultFilePath = heart_colors;
                    resultHairFileUrls.colorId = id;
                    resultHairFileUrls.shareTitle = res.info.shareTitle;
                    _this.setData({
                      heat_info: resultHairFileUrls,
                    }, () => {
                      _this.data.photohistory[y].children.push({
                        id: id,
                        url: heart_color,
                        path: heart_colors
                      });
                      _this.setData({
                        photohistory: _this.data.photohistory
                      }, () => {
                        _this.forfav();
                      })
                    });
                    _this.hidenLoading();
                  } else {
                    uploadErrorInfoFn(`${dyeHairTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
                    let title = "系统通知";
                    let notice = '出错啦';
                    wx.navigateTo({
                      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                    })
                  }
                  _this.hidenLoadings();
                  _this.hidenLoading();
                }).catch(error=>{
                  uploadErrorInfoFn(`${dyeHairTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
                  _this.hidenLoadings();
                  _this.hidenLoading();
                  let title = "系统通知";
                  let notice = "出错啦";
                  wx.navigateTo({
                    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                  })
                  return;
                })
              }
            }
          })
        } else {
        _this.showLoadings();
        let param = {
          userId: user_id,
          version: version,
          faceId: wx.getStorageSync('faceinfo').faceId,
          templateNo: tempid,
          colorNo: id,
          filePath: wx.getStorageSync('faceinfo').filePath,
          resultFilePath: wx.getStorageSync('faceinfo').resultFilePath
        }
          util.post(`${dyeHair}`, param).then(res=>{
            let data = res.info;
            if (res.code == 0) {
              let heart_color = res.info.resultFilePathColorUrl;
              let heart_colors = res.info.resultFilePathColor;
              let resultHairFileUrls = _this.data.heat_info;
              resultHairFileUrls.resultFileUrl = heart_color;
              resultHairFileUrls.resultHairFilePath = heart_colors;
              resultHairFileUrls.colorId = id;
              resultHairFileUrls.shareTitle = res.info.shareTitle;
              _this.setData({
                heat_info: resultHairFileUrls,
              }, () => {
                _this.data.photohistory[y].children.push({
                  id: id,
                  url: heart_color,
                  path: heart_colors
                });
                _this.setData({
                  photohistory: _this.data.photohistory
                }, () => {
                  _this.forfav();
                })
              });

            } else {
              uploadErrorInfoFn(`${dyeHairTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            }
            _this.hidenLoadings();
          }).catch(error=>{
            uploadErrorInfoFn(`${dyeHairTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
            _this.hidenLoadings();
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

  },
  getHairColorList() {
    const _this = this;
    let para={
      userId: user_id,
      version: version,
    }
    util.get(`${getHairColorList}`,para).then(res=>{
      let _data = _this.data.info;
      let data = res.info;
      let datas = [];
      if (res.code == 0) {
        data.hairColorList.forEach(function (x, y) {
          datas.push({
            templateUrl: x.colorFileUrl,
            isUsed: 1,
            templateNo: x.colorNo,
            loading: false,
            type: true,
            active: false,
          });
        });
        datas.forEach(function (x, y) {
          if (x.templateNo == wx.getStorageSync('faceinfo').colorId) {
            x.active = true;
          } else {
            x.active = false;
          }
        })
        _this.setData({
          hair_color_list: datas,
        })
      } else {
        uploadErrorInfoFn(`${getHairColorListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    }).catch(error=>{
      uploadErrorInfoFn(`${getHairColorListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      return;
    })
  },
  followfn: function () {
    const _this = this;
    if (_this.data.follow_type) {
      let para={
        userId: user_id,
        version: version,
        favoriteNo: _this.data.favoriteNo
      }
      util.post(`${delHairStyleFavorite}`,para).then(res=>{
        if (res.code == 0) {
          let _y = 0, _ys = 0;
          _this.data.photohistory.forEach(function (x, y) {
            _y = y;
            x.children.forEach(function (xs, ys) {
              if (xs.favoriteNo != undefined && xs.favoriteNo == _this.data.favoriteNo) {
                _ys = ys;
              }
            })
          });
          delete _this.data.photohistory[_y].children[_ys].favtid;
          delete _this.data.photohistory[_y].children[_ys].favt;
          _this.setData({
            follow_type: !_this.data.follow_type,
            photohistory: _this.data.photohistory
          })
        } else {
          uploadErrorInfoFn(`${delHairStyleFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = '出错啦';
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        }
      }).catch(error=>{
        uploadErrorInfoFn(`${delHairStyleFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        return;
      })

    } else {
      let fav_data = {
        userId: user_id,
        version: version,
        faceId: _this.data.heat_info.faceId,
        templateNo: _this.data.heat_info.templateNo,
        filePath: _this.data.heat_info.filePath,
        resultFilePath: _this.data.heat_info.resultFilePath,
        // resultHairFilePath: _this.data.heat_info.resultHairFilePath,
      }
      if (_this.data.favoriteNo != 0) {
        fav_data["favoriteNo"] = _this.data.favoriteNo;
      };
      if (_this.data.heat_info.colorId != undefined) {
        fav_data["colorNo"] = _this.data.heat_info.colorId;
      };
      util.post(`${addHairStyleFavorite}`, fav_data).then(res=>{
        let _data = _this.data.info;
        let data = res.info;
        let datas = _this.data.heart_template;
        if (res.code == 0) {
          if (_this.data.heat_info.colorId == undefined) {
            _this.data.photohistory.forEach(function (x, y) {
              if (x.id == _this.data.heat_info.templateNo) {
                let ssd = _this.data.photohistory;
                ssd[y].children[0].favt = true;
                ssd[y].children[0].favtid = res.info.favoriteNo;
                _this.setData({
                  photohistory: ssd,
                })
              }
            })
          } else {
            _this.data.photohistory.forEach(function (x, y) {
              if (x.id == _this.data.heat_info.templateNo) {
                _this.data.photohistory[y].children.forEach(function (xs, ys) {
                  if (xs.id == _this.data.heat_info.colorId) {
                    let ssd = _this.data.photohistory;
                    ssd[y].children[ys].favt = true;
                    ssd[y].children[ys].favtid = res.info.favoriteNo;
                    _this.setData({
                      photohistory: ssd
                    })
                  }
                })
              }
            })
          }
          let dds = _this.data.photohistory
          _this.setData({
            favoriteNo: res.info.favoriteNo,
            follow_type: !_this.data.follow_type,
            gif_type: true,
            ass: Math.random() / 9999
          })
          setTimeout(function () {
            _this.setData({
              gif_type: false
            })
          }, 1500)
        } else {
          uploadErrorInfoFn(`${addHairStyleFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(fav_data)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = '出错啦';
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        }
      }).catch(error=>{
        uploadErrorInfoFn(`${addHairStyleFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(fav_data)};errorinfo:${JSON.stringify(error)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        return;
      })
    }
  },
  workss(e){
  },
  getHairTemplateList(heart_type) {
    const _this = this;
    let para = {
      userId: user_id,
      version: version,
      hairType: heart_type,
      pageNum: _this.data.pagenum,
      pageSize: _this.data.pagesize,
    };
    _this.data.head_img.forEach(function (x, y) {
      if (x.selFlag == 1) {
        if (x.hairType == 110) {
      
          para.hairType = _this.data.label_click;
        } else if (x.hairType == 120) {
          para.hairType = heart_type;
        }
      }
    })
    _this.data.head_img.forEach(function(x,y){
      if (x.hairType == heart_type){
        para['disportFlag'] = x.disportFlag
      }
    })
    if( wx.getStorageSync('active_tab') ){
      para['sex'] = wx.getStorageSync('active_tab').sex;
    }else{
      para['sex'] = wx.getStorageSync('faceinfo').sex;
    }
    if (wx.getStorageSync('detailtodesign') != '' ){
      para['templateNo'] = wx.getStorageSync('faceinfo').templateNo ? wx.getStorageSync('faceinfo').templateNo : wx.getStorageSync('detailtodesign') ;
    };
    if (_this.data.detailgettemplateNo != ''  ){
      para['templateNo'] = _this.data.detailgettemplateNo;
    }
    util.get(`${getHairTemplateList}`,para).then(res=>{
      let _data = _this.data.info;
      let data = res.info;
      let datas = _this.data.heart_template;
      if (res.code == 0) {
        let xs = {};
        if (data.resultList != null ){
          data.resultList.forEach(function (x, y) {
            datas.push({
              ...x,
              loading: false,
              active: false,
            })
            xs = x;
          })
          let loading_type = true;
          if (data.resultList.length < 20 && heart_type != 100) {
            datas.push({
              isUsed: 1,
              templateNo: -2,
              templateUrl: 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/icon/template_more.png',
              loading: false,
              active: false,
              isNew: 0
            })
            loading_type = false;
          } else {
            loading_type = true;
          };
          _this.setData({
            heart_template: datas,
            onReachBottom: loading_type
          })
        }
      } else {
        uploadErrorInfoFn(`${getHairTemplateListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      if (wx.getStorageSync('detailtodesign') != null && wx.getStorageSync('detailtodesign') != '' && wx.getStorageSync('detailtodesign') != undefined) {

      } else {
        _this.hidenLoadings();
      }
      _this.hidenLoadings();
      _this.hidenLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${getHairTemplateListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      _this.hidenLoadings();
      _this.hidenLoading();
      return;
    })
  },
  getHairTypeTabs() {
    const _this = this;
    let typeTab = {
      userId: user_id,
      version: version,
    }
    if (wx.getStorageSync('active_tab') ){
      typeTab.sex = wx.getStorageSync('active_tab').sex;
    }else{
      if (wx.getStorageSync('faceinfo').sex != undefined ){
        typeTab.sex = wx.getStorageSync('faceinfo').sex;
      }else{
        if (sex != '' ){
          typeTab.sex = sex;
        }else{
          typeTab.sex = wx.getStorageSync('userInfo').sex;
        }
      }
    };
    util.get(`${getHairTypeTabs}`, typeTab).then(res=>{
      let _data = _this.data.info;
      let data = res.info;
      if (res.code == 0) {
        let datas = [];
        let heart_type = 0;
        data.tabList.forEach(function (x, y) {
          if (wx.getStorageSync('active_tab')) {
            if (y == wx.getStorageSync('active_tab').typeTab) {
              x.selFlag = 1;
            } else {
              x.selFlag = 0;
            };
          }
          datas.push(x);
          if (x.selFlag == 1) {
            heart_type = x.hairType;
          };
        });
        _this.setData({
          head_img: datas,
          heads_img: res.info.tabChildList
        }, () => {
          _this.getHairTemplateList(heart_type);
        })
      } else {
        uploadErrorInfoFn(`${getHairTypeTabsTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(typeTab)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      if (wx.getStorageSync('detailtodesign') != null && wx.getStorageSync('detailtodesign') != '' && wx.getStorageSync('detailtodesign') != undefined) {

      } else {
      }
    }).catch(error=>{
      uploadErrorInfoFn(`${getHairTypeTabsTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(typeTab)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      return;
    })
  },
  onUnload(){
    wx.removeStorageSync('active_tab');
    wx.setStorageSync('aifn', true)
  },
  onHide(){
    wx.removeStorageSync('active_tab');
  },
  labelChanges(e) {
    const _this = this;
    let _data = _this.data.heads_img;
    _data.forEach(function (x, y) {
      x.selFlag = 0
    });
    _data[e.currentTarget.dataset.index].selFlag = 1;
    _this.setData({
      heads_img: _data,
      onReachBottom: true,
      heart_template: [],
      pagenum: 1
    }, () => {
      if (_data[e.currentTarget.dataset.index].hairType != 0) {
        _this.getHairTemplateList(_data[e.currentTarget.dataset.index].hairType);
        _this.setData({
          active_color: false,
          curr: 0
        })
      } else {
        _this.setData({
          active_color: true,
          curr: 1
        })
        _this.getHairColorList();
      }
    });
  },
  labelChange(e) {
    const _this = this;
    let _data = _this.data.head_img;
    _data.forEach(function (x, y) {
      x.selFlag = 0
    });
    _data[e.currentTarget.dataset.index].selFlag = 1;
    _this.setData({
      head_img: _data,
      onReachBottom: true,
      heart_template: [],
      pagenum: 1
    }, () => {
      if (_data[e.currentTarget.dataset.index].hairType != 0) {
        let hairt_type = '';
        if (_data[e.currentTarget.dataset.index].hairType == 120 ){
          hairt_type = _data[e.currentTarget.dataset.index].hairType;
          _this.data.heads_img.forEach(function (x, y) {
            if (x.selFlag == 1) {
              hairt_type = x.hairType;
            };
          });
        }
        _this.getHairTemplateList(hairt_type);
        _this.setData({
          active_color: false,
          curr: 0
        })
      } else {
        _this.setData({
          active_color: true,
          curr: 1
        })
        _this.getHairColorList();
      }
    });
  },
  getQRCode() {
    const _this = this;
    let para={
      scene: user_id,
      version: version,
      smallProgramNo: smallProgramNo,
			userId:user_id
    }
    util.post(`${getQRCode}`,para).then(res=>{
      if (res.code == 0) {
        _this.setData({
          ewm: res.info.qrcode
        })
      } else {
        uploadErrorInfoFn(`${getQRCodeTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      if (_this.data.img_load) {
        wx.hideLoading();
      }
    }).catch(error=>{
      uploadErrorInfoFn(`${getQRCodeTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      var title = "系统通知";
      var notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  maskTop() {
    let systemInfo = wx.getSystemInfoSync();
    let pixe = systemInfo.windowWidth / 750;
    let maskTop = (systemInfo.windowHeight / pixe - 750) / 2;
    this.setData({
      maskTop: maskTop
    })
  },
  onLoad: function (options) {
    const _this = this;
    user_id = wx.getStorageSync('userInfo').userId;
    _this.maskTop();
   if( options.sex != undefined ){
     sex = options.sex;
     if (wx.getStorageSync('active_tab') ){
       let s = {
         sex:options.sex,
         typeTab: wx.getStorageSync('active_tab').typeTab
       };
       _this.setData({
       })
       wx.setStorageSync('active_tab', s);
     }
   }
    if (wx.getStorageSync('userInfo') == '') {
      _this.setData({
        showDialog: true,
        showDialogs: true,
      });
    } else {
      let sdata = {
        userId: user_id,
        version: version
      };
      if (wx.getStorageSync('detailtodesign') != '' ) {
        sdata['templateNo'] = wx.getStorageSync('detailtodesign');
      }
      if (delNull(options.templateNo) != '' ) {
        sdata['templateNo'] = options.templateNo;
        wx.setStorageSync('detailtodesign', options.templateNo);
        let _data = {
          sex: options.sex != undefined ? options.sex :1,
        }
        wx.setStorageSync('faceinfo',_data )
      }
      _this.getajax();
      _this.getQRCode();
      _this.getNewlyUsedPic();
    }
    _this.getUserInfoFaceNum();
    _this.changewidth();
  },
  phone_content_btn() {
    wx.setStorageSync('noPhoneToTakePhonr', true)
    wx.navigateTo({
      url: '../../other_pages/takephoto/takephoto?first=true&templateNo=' + this.data.templateNo,
    })
  },
  getajax() {
    this.getHairColorList();
    const _this = this;
    user_id = wx.getStorageSync('userInfo').userId;
    _this.setData({
      heart_template: [],
    }, () => {
      _this.getHairTypeTabs();
      let _data = wx.getStorageSync('faceinfo');
      if (_data.templateNo == '' || _data.templateNo == null) {
       _this.showLoadings();
        let option_data = {
          userId: user_id,
          version: version,
        }
        if (wx.getStorageSync('detailtodesign') != '' && wx.getStorageSync('detailtodesign') != undefined && wx.getStorageSync('detailtodesign') != 'undefined' ) {
          option_data['templateNo'] = wx.getStorageSync('detailtodesign');
          _this.setData({
            detailgettemplateNo: wx.getStorageSync('detailtodesign')
          })
        }else{
          _this.setData({
            detailgettemplateNo:''
          })
        }
        wx.removeStorageSync('detailtodesign');
        util.get(`${countFaceSwap}`, option_data).then(res=>{
          let _data = _this.data.info;
          let data = res.info;
          if (res.code == 0) {
            if (res.info.faceSwapCount == 0 && wx.getStorageSync('detailtodesigntype') != true) {
              _this.setData({
                nophone: false,
              })
              _this.hidenLoadings();
            } else {
              util.post(`${faceSwap}`, option_data).then(res1=>{
                let datas = res1.info;
                wx.setStorageSync('faceinfo', datas);
                _this.setData({
                  heat_info: datas
                }, () => {
                  if (res1.code == 0) {
                    fiveNum++;
										let stroageFace = wx.getStorageSync('userInfo');
										if( stroageFace.paymentInfo.isPopup == 0 && stroageFace.paymentInfo.isPaymentUser == 1 ){
											stroageFace.paymentInfo.detectCounts = stroageFace.paymentInfo.detectCounts  +1;
										}
										wx.setStorageSync('userInfo',stroageFace);
										_this.getUserInfoFaceNum();
                    if (fiveNum == 6) {
                      fiveNum = 1
                    };
                    if (fiveNum == 5) {
                      _this.setData({
                        fiveType: true,
                      })
                      _this.fiveHide();
                    } else {
                      if (_this.data.fiveType) {
                        _this.setData({
                          fiveType: false,
                        })
                      }
                    }
                    let heart_color = datas.resultHairFileUrl;
                    let heart_colors = datas.resultHairFilePath;
                    let heart_temp = datas.resultFileUrl;
                    let heart_temps = datas.resultFilePath;
                    let resultHairFileUrls = _this.data.heat_info;
                    resultHairFileUrls.resultHairFilePath = heart_colors;
                    resultHairFileUrls.resultFilePathColorPath = heart_colors;
                    resultHairFileUrls.resultFileUrl = heart_temp;
                    resultHairFileUrls.resultFilePath = heart_temps;
                    resultHairFileUrls.templateNo = datas.templateNo;
                    resultHairFileUrls.shareTitle = res.info.shareTitle;
                    if (JSON.stringify(res1.info.points) != "{}" && res1.info.points != null) {
                      let storage = res1.info.points.points;
                      let banner_url = storage.background;
                      let _show;
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
                    if (wx.getStorageSync('active_tab')) {
                      datas.sex = wx.getStorageSync('active_tab').sex;
                    }
                    _this.setData({
                      heat_info: resultHairFileUrls,
                      img_load: false,
                    }, () => {
                      let photohistory = [];
                      photohistory.push({
                        id: datas.templateNo,
                        url: datas.resultFileUrl,
                        children: [
                          {
                            id: -1,
                            url: datas.resultFileUrl,
                            path: datas.resultFilePath
                          }
                        ],
                      })
                      _this.setData({
                        photohistory: photohistory,
                      });
                    });
                  } else if (res1.code == 5004) {
                    if (delNull(_this.data.detailgettemplateNo) != '') {
                      wx.navigateTo({
                        url: '../../other_pages/takephoto/takephoto?first=true&show=false&templateNo=' + _this.data.heat_info.templateNo,
                      })
                    } else {
                      wx.navigateTo({
                        url: '../../other_pages/takephoto/takephoto?first=true',
                      })
                    }
                  } else {
                    wx.navigateTo({
                      url: '../../other_pages/takephoto/takephoto?first=true',
                    })
                  }
                })
              }).catch(error=>{
                uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(error)}`);
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
            uploadErrorInfoFn(`${countFaceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(res)}`);
            let title = "系统通知";
            let notice = '出错啦';
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
          }
        }).catch(error=>{
          uploadErrorInfoFn(`${countFaceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(error)}`);
          let title = "系统通知";
          let notice = "出错啦";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          _this.hidenLoadings();
          return;
        })

      } else {
        if (wx.getStorageSync('active_tab')) {
          _data.sex = wx.getStorageSync('active_tab').sex;
        }
        _this.setData({
          heat_info: _data,
        });
        let photohistory = [];
        photohistory.push({
          id: _data.templateNo,
          url: _data.resultFileUrl,
          path: _data.resultFilePath,
          children: [
            {
              id: -1,
              url: _data.resultFileUrl,
              path: _data.resultFilePath
            }
          ],
        })
        _this.setData({
          photohistory: photohistory,
          img_load:false,
          last_heart_id: wx.getStorageSync('detailtodesign')
        })
        // _this.getHairTypeTabs();
        if (wx.getStorageSync('detailtodesign') != '') {
          _this.faceSwap(wx.getStorageSync('detailtodesign'));
          _this.setData({
            last_heart_id: wx.getStorageSync('detailtodesign')
          })
        }
      }
    });
  },
  varilgun(e) {
    if (e.detail.scrollTop > 4) {
      this.setData({
        bottom_scroll: true,
      })
    } else {
      this.setData({
        bottom_scroll: false,
      })
    }
  },
  lower(e) {
    const _this = this;
    if (_this.data.onReachBottom) {
      let heart_template = _this.data.heart_template;
      let heart_tab = _this.data.head_img;
      heart_tab.forEach(function (x, y) {
        if (x.selFlag == 1) {
          if (x.hairType == 1) {
          } else {
            _this.setData({
              pagenum: _this.data.pagenum + 1
            }, () => {
              _this.getHairTemplateList(x.hairType);
            })
          }
        }
      })
    }
  },
  gototake() {
    wx.removeStorageSync('back');
    if (this.data.heat_info.templateNo != '' ){
      wx.navigateTo({
        url: '../../other_pages/takephoto/takephoto?ai=false&show=false&templateNo=' + this.data.heat_info.templateNo,
      })
      wx.setStorageSync('chooseHeart', 1);
    }else{
      wx.navigateTo({
        url: '../../other_pages/takephoto/takephoto?ai=false&show=false',
      })
    }
  },
  bindClose: function () {
    this.setData({
      isShare: false
    });
  },
  onShow() {
    if( wx.getStorageSync('faceinfo') != '' ){
      if (wx.getStorageSync('faceinfo').templateNo != undefined && this.data.heat_info.templateNo != undefined && this.data.heat_info.templateNo != null) {
        if (wx.getStorageSync('faceinfo').templateNo != this.data.heat_info.templateNo) {
          this.setData({
            heat_info: wx.getStorageSync('faceinfo'),
            photohistory: []
          })
        };
        if (!wx.getStorageSync('noPhoneToTakePhone')) {
          this.setData({
            nophone: true
          })
        }
      }
		
    };
    var _this = this;
    _this.pic_url();
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
    if (wx.getStorageSync('faceLayer') != '') {
      let storage = wx.getStorageSync('faceLayer');
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
			wx.removeStorageSync('faceLayer');
    }
    let para = {
      userId: user_id,
      version: version,
      pageId: 'H0003'
    };
    util.get(`${getHairTemplateTagList}`, para).then(res => {
      let data = res.info.templateTagList;
      let _data = [];
      if (res.code == 0) {
        data.forEach(function (x, y) {
            _data.push({
              title: x.tagTypeLabel,
              id: x.tagType,
              children: []
            })
        });
        var arr = _data,
          i,
          j,
          len = arr.length;
        for (i = 0; i < len; i++) {
          for (j = i + 1; j < len; j++) {
            if (arr[i].id == arr[j].id) {
              arr.splice(j, 1);
              len--;
              j--;
            }
          }
        }
        data.forEach(function (x, y) {
          arr.forEach(function (xs, ys) {
            if (x.tagType == xs.id) {
              arr[ys].children.push({
                label: x.tagLabel,
                id: x.tag,
                staut: false,
              })
            }
          })
        });
        arr.forEach(function(x,y){
          x.children.forEach(function(xs,ys){
            if (wx.getStorageSync('faceinfo').sex == 0 && xs.id == 'TT1|TL1E') {
              xs.staut = true;
            }
            if (wx.getStorageSync('faceinfo').sex == 1 && xs.id == 'TT1|TL2E') {
              xs.staut = true;
            }
          })
        })
        let tab = '', subtab = '';
        if (wx.getStorageSync('active_once') != '') {
          first = false;
          wx.setStorageSync('selectRequiredDiscoveryList', arr);
          let storage_data = wx.getStorageSync('active_once');
          if (storage_data.condition != undefined) {
            if (storage_data.condition.length != 0) {
              storage_data.condition.forEach(function (x, y) {
                _data.forEach(function (xs, ys) {
                  if (ys != 0) {
                    xs.children.forEach(function (xss, yss) {
                      if (xss.id == x) {
                        xss.staut = true
                      } else {
                        xss.staut = false
                      }
                    })
                  }
                });
              });
            } else {
              _data.forEach(function (xs, ys) {
                if (ys != 0) {
                  xs.children.forEach(function (xss, yss) {
                    xss.staut = false
                  })
                }
              });
            };
          } else {
            _data.forEach(function (xs, ys) {
              if (ys != 0) {
                xs.children.forEach(function (xss, yss) {
                  xss.staut = false
                })
              }
            });
          }
          tab = storage_data.tab;
          subtab = storage_data.subtab;
          wx.setStorageSync('selectRequiredHairTemplateList', _data);
          wx.setStorageSync('selectRequiredDiscoveryList', _data);
          if (subtab == '2') {
            _this.setData({
              sex: 1,
            })
            sex = 1;
          } else if (subtab == '3') {
            _this.setData({
              sex: 0,
            })
            sex = 0;
          }
          _this.setData({
            label_list: _data,
          })
          wx.removeStorage({
            key: 'active_once',
            success: function (res) { },
          })
        } else {
          wx.setStorageSync('selectRequiredHairTemplateList', arr);
          wx.setStorageSync('selectRequiredDiscoveryList', arr);
          if (wx.getStorageSync('userInfo').sex == 1) {
            tab = 1;
            sex = 1;
          } else {
            tab = 2;
            sex = 0;
          }
          _this.setData({
            label_list: arr,
          })
        }
        _this.setData({
          loading_text: '加载中...',
          onReachBottom: true,
          page_num: 1,
          choose_type: false,
          displaytype: false,
          curr: tab == '' ? 1 : tab,
        }, () => {
          if (_this.data.curr == 2) {
            _this.setData({
              label_list: wx.getStorageSync('selectRequiredDiscoveryList')
            })
          } else if (_this.data.curr == 1) {
            _this.setData({
              label_list: wx.getStorageSync('selectRequiredHairTemplateList')
            });
          }
          _this.setData({
            tips_show: false
          })
          if (_this.data.curr == 0) {
            _this.getFollowList(1, true);
          }
        })
        wx.hideLoading();
      } else if (res.code == 2002) {
        _this.setData({
          note: [],
        })
      } else {
        uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error => {
      uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  onShareAppMessage: function (res) {
    const _this = this;
    if (res.from === 'button') {
      _this.setData({
        cantype: true
      })
    }
    wx.showShareMenu({
      withShareTicket: false
    })
    baseShare(_this);
    let storageShareInfo = wx.getStorageSync('shareInfo');
    let shareTitle = storageShareInfo.designTitle.split('|');
    let x = mathRandom(shareTitle);
    let shareImageUrl = '';
    let shareTitles = shareTitle[x];
    if (storageShareInfo.designFlag == '1') {
      shareImageUrl = storageShareInfo.designFlag.split('|');
    } else {
      shareImageUrl = _this.data.heat_info.resultFileUrl;
    }
    if (delNull(_this.data.heat_info.shareTitle) != '' ){
      shareTitles = _this.data.heat_info.shareTitle;
    }
    let ns = _this.data.heat_info.templateNo != undefined ? _this.data.heat_info.templateNo : wx.getStorageSync('faceinfo').templateNo;
    return {
      title: shareTitles,
      path: `/pages/heart_designs_share/heart_designs_share?shareUserId=${user_id}&isTemplate=1&templateNo=${ns}&scene=${getUrl()}&shareImgUrl=${wx.getStorageSync('faceinfo').resultFileUrl}`,
      imageUrl: shareImageUrl,
      success(res) {
      }
    }
  },
})