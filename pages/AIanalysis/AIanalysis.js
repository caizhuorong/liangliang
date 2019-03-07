const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
import {
  AiSharePage,
  login,
  loginTitle,
  faceSwap,
  faceSwapTitle,
  getQRCode,
  getQRCodeTitle,
  version
} from '../../config.js';
import {
  getUrl,
  baseShare,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    show: false,
    imgurl: '',
    info: {
      fiveSenseMemo:'',
      faceShapeMemo:'',
    },
    ewm: '',
    showDialog: false,
    showDialogs: false,
    isme: true,
    isnotmeid: '',
    ai:false,
    from:'',
    shareshow:false,
    faceSwapLoading:false,
    templateNo:'',
    me_loading_type:0,
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
	  activeInfo: {},
  },
  noticelayer(e) {
    this.setData({
      noticeShow: true,
      noticeLayerBanner: e.detail
    })
  },
  activelayer(e) {
    console.log(1);
    this.setData({
      activeShow: true,
	  activeInfo:e
    })
  },
  showLoading(value) {
    this.setData({
      me_loading_type: 1,
      meloadingvalue: value
    })
  },
  giftlayer(e) {
    this.setData({
      giftShow: true,
      giftLayerBanner: e.detail
    })
  },
  onShow(){
    const _this = this;
    if (wx.getStorageSync('we_points')) {
      if (!wx.getStorageSync('wx_giftlayer')) {
        _this.points(wx.getStorageSync('we_points'));
      }
      wx.removeStorageSync('we_points');
    }
    if (wx.getStorageSync('wx_giftlayer')) {
      _this.giftlayer(wx.getStorageSync('wx_giftlayer'));
      wx.removeStorageSync('wx_giftlayer');
    };
    if (wx.getStorageSync('wx_noticelayer')) {
      _this.noticelayer(wx.getStorageSync('wx_noticelayer'));
      wx.removeStorageSync('wx_noticelayer');
    };
    if (wx.getStorageSync('wx_activelayer')) {
      _this.activelayer(wx.getStorageSync('wx_activelayer'));
      wx.removeStorageSync('wx_activelayer');
    };
    _this.setData({
      info: wx.getStorageSync('lookphoneToAi').info
    },()=>{
      _this.can();
    })
  },
  hidenLoading() {
    this.setData({
      me_loading_type: 0,
      meloadingvalue: '加载中...'
    })
  },
  can() {
    var $this = this;
    const ctx = wx.createCanvasContext('friend');
    // const ctxs = wx.createCanvasContext('friends');
    let img1 = $this.data.ewm;
    let img2 = $this.data.info.starInfoList[0].filePath;
    let img3 = $this.data.info.starInfoList[1].filePath;
    let w2 = '';
    let h2 = '';
    let w3 = '';
    let h3 = '';
    let deisx = 750 / wx.getSystemInfoSync().screenWidth;
    ctx.setFillStyle('#D75294')
    wx.getImageInfo({
      src: img2,
      success: function(res2) {
        img2 = res2.path;
        w2 = res2.width;
        h2 = res2.height;
        wx.getImageInfo({
          src: img3,
          success: function(res3) {
            img3 = res3.path;
            w3 = res3.width;
            h3 = res3.height;
            ctx.save();
            $this.roundRect(ctx, 92 / deisx, 46 / deisx, 148 / deisx, 196 / deisx, 3, '#ffffff', '#ffffff');
            ctx.drawImage(img2, 0, 0, w2, w2/.75, 93 / deisx, 47 / deisx,   146 / deisx, 194 / deisx);
            ctx.restore();
            ctx.save();
            $this.roundRect(ctx, 304 / deisx, 46 / deisx, 148 / deisx, 196 / deisx, 3, '#ffffff', '#ffffff');
            ctx.drawImage(img3, 0, 0, w3, w3/.75, 305 / deisx, 47 / deisx, 146 / deisx, 194 / deisx)
            ctx.restore();
            ctx.setFillStyle('#ffffff')
            ctx.setTextAlign('center');
            ctx.setFontSize(10);
            ctx.fillText($this.data.info.starInfoList[0].starName, 92 / deisx + 148 / deisx / 2, 280 / deisx, 148 / deisx);
            ctx.fillText($this.data.info.starInfoList[1].starName, 303 / deisx + 148 / deisx / 2, 280 / deisx, 148 / deisx);
            ctx.setFontSize(12);
            ctx.fillText($this.data.info.matchStarMemo, 550 / deisx / 2, 320 / deisx, 510 / deisx);
            $this.roundRect(ctxs, 279 / deisx, 55 / deisx, 148 / deisx, 196 / deisx, 3, '#ffffff', '#ffffff');
            ctx.setFillStyle('#05C4F0')
            ctx.fillRect(29 / deisx, 385 / deisx, 4 / deisx, 16 / deisx);
            ctx.setFillStyle('#292929')
            ctx.setTextAlign('left');
            ctx.setFontSize(23 / deisx);
            ctx.fillText('分析结果', 38 / deisx, 402 / deisx, );
            ctx.setFontSize(20 / deisx);
            ctx.fillText(`发际线：${$this.data.info.hairLine}`, 64 / deisx, 445 / deisx, );
            ctx.fillText(`五官风格：${$this.data.info.fiveSense}`, 64 / deisx, 485 / deisx, );
            ctx.fillText(`脸型：${$this.data.info.faceShape}`, 64 / deisx, 525 / deisx, );
            
            var text = `${$this.data.info.hairLineMemo}`;
            var chr = text.split("");
            var temp = "";
            var row = [];
            for (var a = 0; a < chr.length; a++) {
              if (ctx.measureText(temp).width < 429 / deisx) {
                temp += chr[a];
              } else {
                a--;
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
                if (ctx.measureText(test).width < 429 / deisx) {
                  test += rowPart[a];
                } else {
                  break;
                }
              }
              empty.push(test);
              var group = empty[0] + "..." 
              rowCut.splice(1, 1, group);
              row = rowCut;
            }
            for (var b = 0; b < row.length; b++) {
              ctx.fillText(row[b], 64 / deisx, 569 / deisx + b * 18);
            }
            var text = `${$this.data.info.fiveSenseMemo}`; 
            var chr = text.split(""); 
            var temp = "";
            var row = [];
            for (var a = 0; a < chr.length; a++) {
              if (ctx.measureText(temp).width < 429 / deisx) {
                temp += chr[a];
              } else {
                a--;
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
                if (ctx.measureText(test).width < 429 / deisx) {
                  test += rowPart[a];
                } else {
                  break;
                }
              }
              empty.push(test);
              var group = empty[0] + "..." 
              rowCut.splice(1, 1, group);
              row = rowCut;
            }
            for (var b = 0; b < row.length; b++) {
              ctx.fillText(row[b], 64 / deisx, 640 / deisx + b * 18);
            }
            var text = `${$this.data.info.faceShapeMemo}`; 
            var chr = text.split(""); 
            var temp = "";
            var row = [];
            for (var a = 0; a < chr.length; a++) {
              if (ctx.measureText(temp).width < 429 / deisx) {
                temp += chr[a];
              } else {
                a--;
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
                if (ctx.measureText(test).width < 429 / deisx) {
                  test += rowPart[a];
                } else {
                  break;
                }
              }
              empty.push(test);
              var group = empty[0] + "..." 
              rowCut.splice(1, 1, group);
              row = rowCut;
            }
            for (var b = 0; b < row.length; b++) {
              ctx.fillText(row[b], 64 / deisx, 711 / deisx + b * 18);
            }
            wx.getImageInfo({
              src: img1,
              success: function(res4) {
                img1 = res4.path;
                ctx.drawImage(img1, 74 / deisx, 815 / deisx, 106 / deisx, 106 / deisx, );
                ctx.setFillStyle('#fff')
                ctx.setFontSize(23 / deisx);
                ctx.fillText(`发型纪`, 270 / deisx, 850 / deisx);
                ctx.fillText(`——你专属的形象顾问`, 280 / deisx, 890 / deisx);
                ctx.draw(true, setTimeout(function() {
                  wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 550 / deisx,
                    height: 940 / deisx,
                    destWidth: 550 * 2,
                    destHeight: 940 * 2,
                    canvasId: 'friend',
                    quality: 1,
                    success: function(res) {
                      $this.setData({
                        bigimg: res.tempFilePath
                      })
                    },
                    fail(error) {

                    },
                  })
                }, 1000));
              }
            });
          },
          fail(error) {

          },
        });
      },
      fail(error) {

      },
    });
  },
  roundRect(ctx, x, y, w, h, r, fillColor, strokeColor) {
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    ctx.lineTo(x + w, y + h - r)
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    ctx.lineTo(x + r, y + h)
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    ctx.lineTo(x, y + r)
    if (fillColor) {
      ctx.setFillStyle(fillColor)
      ctx.fill()
    }
    if (strokeColor) {
      ctx.setStrokeStyle(strokeColor)
      ctx.stroke()
    }
    ctx.clip();
    ctx.restore();
  },
  look() {
    const _this = this;
    wx.setStorageSync('detailtodesigntype', true);
    wx.setStorageSync('take_type', 1);
    let _data = wx.getStorageSync('faceinfo');
    let option_data = {
      userId: user_id,
      version: version,
    }
    if (!_this.data.isme ){
      wx.navigateTo({
        url: '../../other_pages/takephoto/takephoto?from=index',
      })
    }else{
      if (!_this.data.faceSwapLoading) {
        _this.setData({
          faceSwapLoading: true,
        })
        if (wx.getStorageSync('detailtodesign') != '' || _this.data.templateNo != '' && _this.data.templateNo != undefined  && _this.data.templateNo != 'undefined'){
          option_data['templateNo'] = _this.data.templateNo;
        };
        _this.showLoading('正在设计发型，请稍候');
				util.post(`${faceSwap}`,option_data).then(res1=>{
					 _this.hidenLoading();
					let datas = res1.info;
					if (res1.code == 0) {
					  wx.setStorageSync('faceinfo', datas);
					  if (JSON.stringify(res1.info.points) != "{}" && res1.info.points!= null ){
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
					} else if (res1.data.code == 5004) {
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
            uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(res1)}`);
						let title = "系统通知";
						let notice = "出错啦";
						wx.navigateTo({
							url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
						})
						_this.hidenLoading();
						return;
					}
					_this.setData({
					  faceSwapLoading: false
					})
				}).catch(error=>{
          uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(error)}`);
					let title = "系统通知";
					let notice = "出错啦";
					wx.navigateTo({
					  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
					})
					_this.hidenLoading();
					return;
				})
      } else {
        _this.hidenLoading();
      }
    };
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
  onMyEvent(e) {
    user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    _this.setData({
      show: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    user_id = wx.getStorageSync('userInfo').userId;
    let _this = this;
 
    if( options.from != undefined ){
      this.setData({
        from: options.from,
        templateNo: options.templateNo == undefined || options.templateNo == '' ? '' : options.templateNo
      });
    }
    if (options.imgurl != undefined) {
      _this.setData({
        imgurl: options.imgurl,
      })
    }
    if (wx.getStorageSync('userInfo') == '') {
      _this.setData({
        showDialog: true,
        showDialogs: true,
      });
      if (options.shareUserId != undefined) {
        _this.setData({
          isme: false,
          show: false,
          isnotmeid: options.shareUserId,
          shareshow:false
        })
      }
    } else {
      if (options.from == 'user') {
        if (options.share == 'true') {
          _this.setData({
            isme: false,
            shareshow:false,
            isnotmeid: options.shareUserId
          })
        }
        _this.setData({
          info: wx.getStorageSync('lookphoneToAi').info,
        }, () => {
          _this.can();;
        })
      } else {
        _this.setData({
          info: wx.getStorageSync("lookphoneToAi").info,
        }, () => {
          _this.can();
        })
      }
    }
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
    let shareTitle = storageShareInfo.aiTitle.split('|');
    let x = mathRandom(shareTitle);
    let shareImageUrl = '';
    if (storageShareInfo.otherFlag == '1') {
      shareImageUrl = storageShareInfo.aiPicture;
    } else {
      shareImageUrl = '';
    }
    return {
      title: shareTitle[x],
      path: `/pages/AIanalysis/AIanalysis?shareUserId=${user_id}&share=true&from=user&scene=${getUrl()}`,
      // imageUrl: _this.data.bigimg1,
      imageUrl:shareImageUrl,
      success: (res) => {
      }
    }
  }
})