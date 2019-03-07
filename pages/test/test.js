const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
import { getUrl, baseShare, numto, delNull, uploadErrorInfoFn,mathRandom} from '../../utils/util.js';
import { 
  version,
  getAnalyzeResult,
  getAnalyzeResultTitle,
  faceSwap,
  faceSwapTitle,
  login,
  loginTitle,
  AiSharePage,
 } from '../../config.js';

let froms = '';
let headTopX = 0;
let deisx = 750 / wx.getSystemInfoSync().screenWidth;
let time=5000, lineTime, setIntervals, lineSetIntervals;
let intJson=[];
let intTime=1000;
let intLineTime = 5000;
let intX = 0,intY = 0;
const ctx = wx.createCanvasContext('can');
let clieTop=0,clieLeft=0,clieRight=0,clieBottom=0;
let graduallyTime = 3000, graduallySettime = 0, graduallysetInterval,opcatiy=0; // 发际线显示需要时间 2000S
let graduallyTimes = 1000, graduallySettimes = 0, graduallysetIntervals, opcatiys = 0; // 发际线显示需要时间 2000S
let horizontalLineTimeAll = 1000, horizontalLineTime = 0, horizontalLineInterval, horizontalAngle;//划横线参数
let graduallyTimeMove = 1500, graduallySettimeMove = 0, graduallysetIntervalMove; // 五官移动 1500S
let verticalLineTimeAll = 1000, verticalLineTime = 0, verticalLineInterval, verticalAngle;//画竖线参数
let opcatiy_show = 1;
let dataType=0; //循环数据状态
let startX,startY,endX,endY;
Page({
  data: {
    json:{},
    jsonss:[],
    horizontal: [],
    vertical:[],
    d_rpx:0,
    tab1: true,
    tab2:true,
    list_jt1:false,
    list_jt2:false,
    top1:false,
    top2:false,
    top3:false,
    top4: false,
    line_x:true,
    canvasHeight:0,
    activeIng1:false, // tab执行中样式
    activeIng2:false,
    activeIng3:false,
    list_btn_active1: false,//tab 执行完样式
    list_btn_active2: false,
    list_btn_active3: false,
    d_rpxs:0,
    randoms:[],


    show: false,
    cantype: true,
    imgurl: '',
    info: {
      fiveSenseMemo: '',
      faceShapeMemo: '',
    },
    // bigimg1: '',
    showDialog: false,
    showDialogs: false,
    isme: true,
    isnotmeid: '',
    ai: false,
    from: '',
    shareshow: false,
    faceSwapLoading: false,
    templateNo: '',
    me_loading_type: 0,
    meloadingvalue: '加载中...',
    shareLayer: false,
    layerBanner: '',
    layerLabel: '',
    layerTips: '',
    giftShow: false,
    activeShow: false,
    giftLayerBanner: [],
    noticeShow: false,
    noticeLayerBanner: [],
    activeInfo: {},
    marginTop:0,
    me_loading_type: 0,
    tramsHidden: true,
    sex:0,
    bottomBtnType:true,
  },
  noticelayer(e) {
    this.setData({
      noticeShow: true,
      noticeLayerBanner: e.detail
    })
  },

  activelayer(e) {
    this.setData({
      activeShow: true,
      activeInfo: e
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
  onUnload(){
    clearInterval(graduallysetInterval);
    clearInterval(graduallysetInterval);
    clearInterval(graduallysetIntervalMove);
    clearInterval(graduallysetIntervals);
    clearInterval(setIntervals);
    clearInterval(lineSetIntervals);
    clearInterval(lineSetIntervals);
    clearInterval(horizontalLineInterval);
    clearInterval(verticalLineInterval);
    wx.setStorageSync('back', true)
  },
  onShow() {
    const _this = this;
    if (wx.getStorageSync('lookphoneToAi') != '' ){
      _this.setData({
        sex: wx.getStorageSync('lookphoneToAi').info.sex
      });
    }
 
    lineTime = 0;
    intJson = [];
    intX = 0, intY = 0;
    const ctx = wx.createCanvasContext('can');
    clieTop = 0, clieLeft = 0, clieRight = 0, clieBottom = 0;
    graduallySettime = 0, opcatiy = 0; // 发际线显示需要时间 2000S
    graduallySettimes = 0,  opcatiys = 0; // 发际线显示需要时间 2000S
    horizontalLineTime = 0, horizontalAngle = 0;//划横线参数
    graduallySettimeMove = 0; // 五官移动 1500S
    verticalLineTime = 0,  verticalAngle = 0;//画竖线参数
    opcatiy_show = 1;
    dataType = 0; //循环数据状态
    startX, startY, endX, endY;
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
    if (wx.getStorageSync('lookphoneToAi') == '' ){
      return false;
    }
    let headTopPointX = wx.getStorageSync('lookphoneToAi').info.headTopPoint.y;
    if (parseFloat(headTopPointX) > 50) {
      headTopX = parseFloat(headTopPointX) - 80;
    }
    if( wx.getStorageSync('aifn') && _this.data.from != 'user' ){ 
      return false;
    }
    wx.getStorageSync("lookphoneToAi").info.threeCourtsInfo.fiveSensePoints.forEach(function (x, y) {
      var num = Math.floor(Math.random() * 10 + 1);
      let nums = 0;
      if (num % 2) {
        nums = Math.floor(Math.random() * 10 + 10);
      } else {
        nums = Math.floor(Math.random() * 10 - 30);
      }
      _this.data.randoms.push({
        x: x.x + nums,
        y: x.y + nums
      })
    });
    _this.setData({
      randoms: _this.data.randoms,
      json: wx.getStorageSync("lookphoneToAi"),
    }, () => {
      wx.getImageInfo({
        src: _this.data.json.info.faceSmallUrl,
        success: function (res) {
          if (wx.getStorageSync('aifn') && _this.data.from == 'user' ){
            _this.d_rpxFns(res.width, res.height);
          }else{
            _this.d_rpxFn(res.width, res.height);
          }
        },
        fail(error) {
          wx.showToast({
            title: '图片加载失败,查看点渲染不出来是否因为图片加载失败',
          })
          _this.onShow();
        },
      })
    })
  },
  hidenLoading() {
    this.setData({
      me_loading_type: 0,
      meloadingvalue: '加载中...'
    })
  },
  canGraduallySet(){
    const _this = this;
    let dataJson;
    _this.setData({
      line_x:false,
    })
    if( dataType == 0 ){
      dataJson = _this.data.json.info.hairLinePoints;
      let second = graduallyTime / dataJson.length / 5;
      graduallysetInterval = setInterval(function (imgW, imgH) {
        if (graduallySettime >= graduallyTime) {
          _this.lineSetInt(dataJson);
          clearInterval(graduallysetInterval);
        } else {
          _this.canGradually(second, dataJson);
        }
      }, second);
    }else if( dataType == 1 ){
      graduallySettime = 0;
      graduallySettimes= 0;
      dataJson = _this.data.json.info.faceShapePoints;
      let second = graduallyTime / dataJson.length / 5;
      graduallysetInterval = setInterval(function (imgW, imgH) {
        if (graduallySettime >= graduallyTime) {
          _this.lineSetInt(dataJson);
          clearInterval(graduallysetInterval);
        } else {
          _this.canGradually(second, dataJson);
        }
      }, second);
    } else if (dataType == 3  ){
      graduallySettimeMove = 0;
      graduallySettimes = 0;
      graduallySettime =0;
      dataJson = _this.data.json.info.threeCourtsInfo.fiveSensePoints;
      let second = graduallyTimeMove / 30;
      let moveJson = [];
      _this.data.randoms.forEach(function (x, y) {
        moveJson.push({
          x: (x.x - dataJson[y].x) / 30,
          y: (x.y - dataJson[y].y) / 30
        })
      });
        graduallysetIntervalMove = setInterval(function (imgW, imgH) {
          if (graduallySettimeMove >= graduallyTimeMove) {
            _this.lineSetInt(_this.data.json.info.threeCourtsInfo.fiveSenseLines);
            clearInterval(graduallysetIntervalMove);
          } else {
            _this.canGraduallyMove(second, dataJson, moveJson);
          }
        }, second);
     }else if( dataType == 2 ){
      _this.horizontalSet();
     };
  },
  canGraduallyMove(second, data, moveJson) {
    graduallySettimeMove += second;
    const _this = this;
    _this.data.randoms.forEach(function(x,y){
      x.x = x.x - moveJson[y].x;
      x.y = x.y - moveJson[y].y;
      _this.circle(x.x / _this.data.d_rpx / deisx - 1, x.y / _this.data.d_rpx / deisx - 1, 2);
    })
    ctx.draw();
  },
  //点开始
  canGraduallySetShow(dataJson) {
    const _this = this;
    let seconds = graduallyTimes/ 5;
    graduallysetIntervals = setInterval(function () {
      if (graduallySettimes == graduallyTimes) {
        clearInterval(graduallysetIntervals);
        dataType ++;
        _this.setData({
          line_x:true,
        },()=>{
          setTimeout(function(){
            _this.canGraduallySet();
          },1000)
        })
      } else {
        _this.canGraduallyShow(seconds, dataJson);
      }
    }, seconds);
  },
  canGraduallyShow(seconds, dataJson){
    graduallySettimes += seconds;
    opcatiy_show -= .2;
    this.canShowFnShow(opcatiy_show, seconds, dataJson);
  },
  canShowFnShow(opcatiy, seconds, dataJson) {
    const _this = this;
    let showTime = parseInt(graduallySettimes / seconds);
    for (let i = 0; i < showTime / 5; i++) {
      _this.circless(dataJson[i].x / _this.data.d_rpx / deisx - 1, dataJson[i].y / _this.data.d_rpx / deisx - 1, 2, opcatiy);
      ctx.save();
    }
    ctx.draw();
  },
  circless(x, y, radius, opcatiy) {
    console.log(x,y);
    ctx.beginPath();
    let grd = ctx.createCircularGradient(x + radius / 2 - 1, y + radius / 2 - 1, radius * 2);
    ctx.restore();
    ctx.setFillStyle(`rgba(255,255,255,${opcatiy})`);
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.setStrokeStyle('rgba(0,0,0,0)')
    ctx.stroke();
    ctx.fill();
  },
  //渐现
  canGradually(second,data){
    graduallySettime += second;
    opcatiy += 1;
    if(opcatiy ==6 ){
      opcatiy = 0;
    }
    this.canShowFn(opcatiy, second,data);
  },
  //随机移动

  canShowFn(opcatiy, second,data){
    const _this = this;
    let showTime = parseInt(graduallySettime / second);
    for( let i = 0 ; i < showTime/5; i++ ){
      if( i == showTime/5 -1 ){
        _this.circles(data[i].x / _this.data.d_rpx / deisx - 1, data[i].y / _this.data.d_rpx / deisx - 1, 2);
        ctx.save();
      }else{
        _this.circle(data[i].x / _this.data.d_rpx / deisx - 1, data[i].y / _this.data.d_rpx / deisx - 1, 2);
      }
    }
    ctx.draw();
  },
  camFadeFn(opcatiy){
  },
  /*
   * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    const _this = this;
    //旧页面复制
    user_id = wx.getStorageSync('userInfo').userId;

    if (options.from != undefined) {
      froms = options.from;
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
          shareshow: false
        })
      }
    } else {
      if (options.from == 'user') {
        froms = options.from;
        if (options.share == 'true') {
          _this.setData({
            isme: false,
            shareshow: false,
            isnotmeid: options.shareUserId
          })
        }
        let para = {
          userId: options.share ? options.shareUserId : user_id,
          version: version
        }
        util.get(`${getAnalyzeResult}`, para).then(res => {
          var data = res;
          var code = data.code;
          if (code == 0) {
            wx.setStorageSync('lookphoneToAi', data)
            _this.setData({
              // info: data.info,
            },()=>{
              let headTopPointX = wx.getStorageSync('lookphoneToAi').info.headTopPoint.y;
              if (parseFloat(headTopPointX) > 50) {
                headTopX = parseFloat(headTopPointX) - 80;
              }
              if (wx.getStorageSync('aifn') && froms != 'user') {
                return false;
              }
              wx.getStorageSync("lookphoneToAi").info.threeCourtsInfo.fiveSensePoints.forEach(function (x, y) {
                var num = Math.floor(Math.random() * 10 + 1);
                let nums = 0;
                if (num % 2) {
                  nums = Math.floor(Math.random() * 10 + 10);
                } else {
                  nums = Math.floor(Math.random() * 10 - 30);
                }
                _this.data.randoms.push({
                  x: x.x + nums,
                  y: x.y + nums
                })
              });
              _this.setData({
                randoms: _this.data.randoms,
                json: wx.getStorageSync("lookphoneToAi"),
              }, () => {
                wx.getImageInfo({
                  src: _this.data.json.info.faceSmallUrl,
                  success: function (res) {
                    if (wx.getStorageSync('aifn') && froms == 'user') {
                      _this.d_rpxFns(res.width, res.height);
                    } else {
                      _this.d_rpxFn(res.width, res.height);
                    }
                  },
                  fail(error) {
                    
                    wx.showToast({
                      title: '图片加载失败,查看点渲染不出来是否因为图片加载失败',
                    })
                  },
                })
              })
            })
          } else if (code == 5002) {
            wx.hideLoading();
            wx.showToast({
              title: '咦？人呢？重新上传一张你的盛世美颜吧',
              icon: 'none'
            })
          } else if (code == 50021) {
            wx.hideLoading();
            wx.showToast({
              title: '哎呀有好多人啊~大乐都不知道先给谁设计好了',
              icon: 'none'
            })
          } else if (code == 5003) {
            var errorInfo = data.info.errorInfo;
            var errorConetent = [];
            for (var i = 0; i < errorInfo.length; i++) {
              errorConetent.push(errorToast[errorInfo[i]]);
            }
            wx.hideLoading();
            let title = "系统通知";
            let notice = '出错啦';
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
          } else {
            uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
            let title = "系统通知";
            let notice = '出错啦';
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
            wx.hideLoading();
          }
        }).catch(error => {
          uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
          wx.hideLoading();
          wx.navigateTo({
            url: '../../other_pages/error/error',
          })
        })
      } else {
        //判断头像是否距离上边过长，如果过长将上移，任何点也跟着上移
        // let headTopPointX = wx.getStorageSync('lookphoneToAi').info.headTopPoint.x;
        // if ( headTopPointX >50 ){
        //   headTopX = headTopPointX - 80;
        // }
        // wx.getStorageSync("lookphoneToAi").info.threeCourtsInfo.fiveSensePoints.forEach(function (x, y) {
        //   var num = Math.floor(Math.random() * 10 + 1);
        //   let nums = 0;
        //   if (num % 2) {
        //     nums = Math.floor(Math.random() * 10 + 10);
        //   } else {
        //     nums = Math.floor(Math.random() * 10 - 30);
        //   }
        //   _this.data.randoms.push({
        //     x: x.x + nums,
        //     y: x.y + nums
        //   })
        // });
        // // console.log(headTopX);
        // // let _storeage = wx.getStorageSync('lookphoneToAi');
        // // let faceShapePoints = [];
        // // wx.getStorageSync('lookphoneToAi').info.faceShapePoints.forEach(function(x,y){
        // //   if( x!=null ){
        // //     faceShapePoints.push({
        // //       x: x.x,
        // //       y: x.y - headTopX
        // //     })
        // //   }
        // // });
        // // let hairLinePoints = [];
        // // wx.getStorageSync('lookphoneToAi').info.hairLinePoints.forEach(function (x, y) {
        // //   if( x!= null ){
        // //     hairLinePoints.push({
        // //       x: x.x,
        // //       y: x.y - headTopX
        // //     })
        // //   }
        // // });
        // // let fiveSensePoints = [];
        // // _storeage.info.threeCourtsInfo.fiveSensePoints.forEach(function(x,y){
        // //   if( x != null ){
        // //     fiveSensePoints.push({
        // //       x: x.x,
        // //       y: x.y - headTopX
        // //     })
        // //   }
        // // })
        // // let fiveSenseLines = [];
        // // let fiveSenseLiness = [];
        // // _storeage.info.threeCourtsInfo.fiveSenseLines.forEach(function(x,y){
        // //   x.forEach(function (xs, ys) {
        // //     if (xs != null) {
        // //       fiveSenseLiness.push({
        // //         x: xs.x,
        // //         y: ys.y - headTopX
        // //       })
        // //     }
        // //   })
        // //   fiveSenseLines.push(fiveSenseLiness);
        // // });
        // // let colLine = [];
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.colLine.forEach(function(x,y){
        // //   if( x!= null ){
        // //     colLine.push({
        // //       x: x.x,
        // //       y: x.y - headTopX
        // //     })
        // //   }
        // // });
        // // let colPoints = [];
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.colPoints.forEach(function (x, y) {
        // //   if( x != null ){
        // //     colPoints.push({
        // //       x: x.x,
        // //       y: x.y - headTopX
        // //     })
        // //   }
        // // });
        // // let rowLine = [];
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.rowLine.forEach(function (x, y) {
        // //   if( x != null ){
        // //     rowLine.push({
        // //       x: x.x,
        // //       y: x.y - headTopX
        // //     })
        // //   }
        // // });
        // // let rowPoints = [];
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.rowPoints.forEach(function (x, y) {
        // //   if( x != null ){
        // //     rowPoints.push({
        // //       x: x.x,
        // //       y: x.y - headTopX
        // //     })
        // //   };
        // // });
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.rowPoints = rowPoints;
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.rowLine = rowLine;
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.colPoints = colPoints;
        // // _storeage.info.threeCourtsInfo.threeCourtsLineInfo.colLine = colLine;
        // // _storeage.info.threeCourtsInfo.fiveSenseLines = fiveSenseLines;
        // // _storeage.info.threeCourtsInfo.fiveSensePoints = fiveSensePoints;
        // // _storeage.info.faceShapePoints = faceShapePoints;
        // // _storeage.info.hairLinePoints = hairLinePoints;
        // // wx.setStorageSync('lookphoneToAi', _storeage);
        // _this.setData({
        //   randoms: _this.data.randoms,
        //   json: wx.getStorageSync("lookphoneToAi"),
        // }, () => {
        //   wx.getImageInfo({
        //     src: _this.data.json.info.faceSmallUrl,
        //     success: function (res) {
        //       _this.d_rpxFn(res.width, res.height);
        //     },
        //     fail(error) {
        //       wx.showToast({
        //         title: '图片加载失败,查看点渲染不出来是否因为图片加载失败',
        //       })
        //       _this.onLoad();
        //     },
        //   })
        // })
      }
    }
  },
  //取得图片宽高，计算比例
  d_rpxFn(imgW,imgH){
    const _this = this;
    _this.data.d_rpx = imgW/374;
    _this.setData({
      d_rpx: _this.data.d_rpx,
      d_rpxs:imgW/220,
      activeIng1:true,
      line_x:false,
      marginTop: (headTopX -20) / deisx /_this.data.d_rpx,
      canvasHeight: imgH / _this.data.d_rpx
    },()=>{
      _this.canGraduallySet();
    })
    setTimeout(function () {
      _this.setData({
        activeIng1:false,
        list_btn_active1:true,
        activeIng2:true,
        list_jt1: true,
      })
    }, 5000);
    setTimeout(function () {
      _this.setData({
        activeIng2:false,
        list_btn_active2:true,
        activeIng3:true,
        list_jt2:true,
      })
    }, 10000);
    setTimeout(function () {
      _this.setData({
        activeIng3: false,
        list_btn_active3: true,
        line_x:false,
      })
      // _this.can();
    }, 15000);
    setTimeout(function(){
      _this.setData({
        tab2:false,
      })
    },16500);
    setTimeout(function () {
      _this.setData({
        top1:true
      })
    }, 5000)
    setTimeout(function () {
      _this.setData({
        list_jt2: true,
        top2: true
      })
    }, 10000)
    setTimeout(function () {
      _this.setData({
        top3: true
      })
    }, 15000);
    setTimeout(function () {
      _this.setData({
        top4: true,
        bottomBtnType:false,
      })
    }, 16000);
  },
  d_rpxFns(imgW, imgH){
    const _this = this;
    // _this.can();
    _this.data.d_rpx = imgW / 374;
    _this.setData({
      d_rpx: _this.data.d_rpx,
      d_rpxs: imgW / 220,
      activeIng1: false,
      list_btn_active1: true,
      activeIng2: false,
      list_btn_active2: true,
      activeIng3: false,
      list_btn_active3: true,
      top1: true,
      top2: true,
      top3: true,
      top4: true,
      bottomBtnType:false,
      list_jt_2:false,
      list_jt_1:false,
      line_x: false,
      marginTop: (headTopX - 20) / deisx / _this.data.d_rpx,
      canvasHeight: imgH / _this.data.d_rpx
    })
  },
  canSetint(imgW,imgH){
    const _this = this;
    time = 0;
    setIntervals = setInterval(function(imgW,imgH){
      if (time == intTime  ){
        clearInterval(setIntervals);
        _this.lineSetInt();
      }else{
        _this.can(imgW, imgH);
      }
    },50);
  },
  lineSetInt(dataJson){
    const _this = this;
    lineTime = 0;
    lineSetIntervals = setInterval(function(){
      if (lineTime >=intTime ){
        clearInterval(lineSetIntervals);
        setTimeout(function(){
          _this.canGraduallySetShow(dataJson );
        },1000);
      }else{
        _this.can_line(dataJson );
      }
    },50)
  },
  //canvas 画圆
  can(imgW,imgH){
    time += 50;
    const _this = this;
    if( _this.data.jsons.length <= 0 ){
      clearInterval(lineSetIntervals);
      return false
    }
    _this.data.jsons.forEach(function (x, y) {
      let xs = (x.x / _this.data.d_rpx / deisx - 1 - intX) / (intTime /time );
      let ys = (x.y / _this.data.d_rpx / deisx - 1 - intY) / (intTime / time);
      _this.circle(xs,ys,2,ctx);
    });
    ctx.draw();
  },
  //画圆function
  circle(x, y, radius) {
    ctx.beginPath();
    let grd = ctx.createCircularGradient(x + radius / 2-1, y + radius/ 2-1, radius*2);
    grd.addColorStop(0, 'rgba(255,255,255,1)')
    grd.addColorStop(1, 'rgba(242,242,242,1)')
    ctx.setFillStyle(grd);
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.setStrokeStyle('rgba(0,0,0,0)')
    ctx.stroke();
    ctx.fill();
  },
  //画横线循环
  horizontalSet(){
    const _this = this;
    horizontalLineTime = 0;
    let rowLine = _this.data.json.info.threeCourtsInfo.threeCourtsLineInfo;
    if (rowLine.rowLine.length <= 0) {
      return false;
    }
    horizontalAngle = (rowLine.rowLine[1].y - rowLine.rowLine[0].y) / (rowLine.rowLine[1].x - rowLine.rowLine[0].x);
    let left_x = 30;
    let right_x = 400;
    let left_y = 0;
    let right_y = 0;
    rowLine.rowPoints.forEach(function(x,y){
      if( x != null ){
        if (rowLine.rowLine[1].y > rowLine.rowLine[0].y) {
          left_y = x.y - (x.x - left_x) * horizontalAngle;
        } else {
          left_y = x.y + (x.x - left_x) * horizontalAngle;
        }
        if (rowLine.rowLine[1].y > rowLine.rowLine[0].y) {
          right_y = x.y + (right_x - x.x) * horizontalAngle;
        } else {
          right_y = x.y - (right_x - x.x) * horizontalAngle;
        }
        _this.data.horizontal.push({
          lineStart: [left_x, left_y],
          lineEnd: [right_x, right_y]
        })
      }
   
    })
    if (rowLine.rowLine[1].y > rowLine.rowLine[0].y) {
      left_y = rowLine.rowLine[0].y - (rowLine.rowLine[0].x - left_x) * horizontalAngle;
    } else {
      left_y = rowLine.rowLine[0].y + (rowLine.rowLine[0].x - left_x) * horizontalAngle;
    }
    if (rowLine.rowLine[1].y > rowLine.rowLine[0].y) {
      right_y = rowLine.rowLine[1].y + (right_x - rowLine.rowLine[1].x) * horizontalAngle;
    } else {
      right_y = rowLine.rowLine[1].y - (right_x - rowLine.rowLine[1].x) * horizontalAngle;
    }
    _this.data.horizontal.push({
      lineStart: [left_x, left_y],
      lineEnd: [right_x, right_y]
    })
    _this.setData({
      horizontal: _this.data.horizontal
    },()=>{
      horizontalLineInterval = setInterval(function(){
        if (horizontalLineTimeAll == horizontalLineTime) {
          clearInterval(horizontalLineInterval);
          _this.verticalSet();
        }else{
          _this.horizontalFn();
        }
      }, 50)
    })

  },
  //划横线方法
  horizontalFn(){
    horizontalLineTime += 50;
    const _this = this;
    _this.data.horizontal.forEach(function (x, y) {
      if( x == null ){

      }else{
        startX = x.lineStart[0] / _this.data.d_rpx;
        startY = x.lineStart[1] / _this.data.d_rpx / deisx;
        endX = x.lineEnd[0] / _this.data.d_rpx;
        endY = x.lineEnd[1] / _this.data.d_rpx / deisx;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo((endX - startX) / (horizontalLineTimeAll / horizontalLineTime) + startX, startY + (endY - startY) / (horizontalLineTimeAll / horizontalLineTime));
        ctx.setStrokeStyle('#ffffff');
        ctx.stroke()
      }
    })
    ctx.restore();
    ctx.draw();
  },
  //画横线循环
  verticalSet() {
    const _this = this;
    verticalLineTime = 0;
    let colLine = _this.data.json.info.threeCourtsInfo.threeCourtsLineInfo;
    if (colLine.colLine.length <= 0) {
      return false;
    }
    verticalAngle = (colLine.colLine[1].x- colLine.colLine[0].x) / (colLine.colLine[1].y - colLine.colLine[0].y);
    let left_x = 0;
    let right_x = 0;
    let left_y = 30 + headTopX/deisx/_this.data.d_rpx;
    let right_y = 380 + headTopX / deisx / _this.data.d_rpx;
    colLine.colPoints.forEach(function (x, y) {
      if (x != null) {
        if (colLine.colLine[1].y > colLine.colLine[0].y) {
          left_x = x.x - (x.y - left_y) * verticalAngle;
        } else {
          left_x = x.x + (x.y - left_y) * verticalAngle;
        }
        if (colLine.colLine[1].y > colLine.colLine[0].y) {
          right_x = x.x + (right_y - x.y) * verticalAngle;
        } else {
          right_x = x.x - (right_y - x.y) * verticalAngle;
        }
        _this.data.vertical.push({
          lineStart: [left_x, left_y],
          lineEnd: [right_x, right_y]
        })
      }
    })
    _this.setData({
      vertical: _this.data.vertical
    },()=>{
      verticalLineInterval = setInterval(function () {
        if (verticalLineTimeAll == verticalLineTime) {
          clearInterval(verticalLineInterval);
          dataType++;
          _this.setData({
            line_x: true,
          }, () => {
            setTimeout(function () {
              _this.canGraduallySet();
            }, 1000)
          })
        } else {
          _this.verticalFn();
        }
      }, 50)
    })
  },
  //划横线方法
  verticalFn() {
    verticalLineTime += 50;
    const _this = this;
    if (_this.data.vertical.length <= 0) {
      return false;
    }
    _this.data.vertical.forEach(function (x, y) {
      startX = x.lineStart[0] / _this.data.d_rpx / deisx;
      startY = x.lineStart[1] / _this.data.d_rpx ;
      endX = x.lineEnd[0] / _this.data.d_rpx / deisx;
      endY = x.lineEnd[1] / _this.data.d_rpx ;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo((endX - startX) / (verticalLineTimeAll / verticalLineTime) + startX, startY + (endY - startY) / (verticalLineTimeAll / verticalLineTime));
      ctx.setStrokeStyle('#ffffff');
      ctx.stroke()
    })
    ctx.restore();
    ctx.draw();
  },

  circles(x, y, radius) {
    ctx.beginPath();
    let grd = ctx.createCircularGradient(x + radius / 2 - 1, y + radius / 2 - 1, radius * 2);
    if( opcatiy == 0 ){
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(1, 'rgba(242,242,242,1)')
    }else if( opcatiy == 1 ){
      grd.addColorStop(0, 'rgba(255,255,255,.2)')
      grd.addColorStop(1, 'rgba(242,242,242,.2)')
    }else if ( opcatiy == 2 ){
      grd.addColorStop(0, 'rgba(255,255,255,.4)')
      grd.addColorStop(1, 'rgba(242,242,242,.4)')
    }else if( opcatiy == 3 ){
      grd.addColorStop(0, 'rgba(255,255,255,.6)')
      grd.addColorStop(1, 'rgba(242,242,242,.6)')
    }else if(opcatiy == 4){
      grd.addColorStop(0, 'rgba(255,255,255,.8)')
      grd.addColorStop(1, 'rgba(242,242,242,.8)')
    }else{
      grd.addColorStop(0, 'rgba(255,255,255,1)')
      grd.addColorStop(1, 'rgba(242,242,242,1)')
    }
    ctx.restore();
    ctx.setFillStyle(grd);
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.setStrokeStyle('rgba(0,0,0,0)')
    ctx.stroke();
    ctx.fill();
  },
  //canvas 划线
  can_line(dataJson){
    lineTime += 50;
    const _this = this;
    if (dataJson.length <= 0 ){
      return false;
    }
    let startX,startY,endX,endY;
    if( dataType == 3 ){
      dataJson.forEach(function (x, y) {
        x.forEach(function(xs,ys){
          if (ys >= x.length - 1) {

          } else {
            startX = x[ys].x / _this.data.d_rpx / deisx;
            startY = x[ys].y / _this.data.d_rpx / deisx;
            endX = x[ys + 1].x / _this.data.d_rpx / deisx;
            endY = x[ys + 1].y / _this.data.d_rpx / deisx;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo((endX - startX) / (intTime / lineTime) + startX, (endY - startY) / (intTime / lineTime) + startY);
            ctx.setStrokeStyle('#ffffff');
            ctx.stroke()
          }
        })
      })
      dataJson.forEach(function (x, y) {
        x.forEach(function(xs,ys){
          let xss = (xs.x / _this.data.d_rpx / deisx - 1 - intX);
          let yss = (xs.y / _this.data.d_rpx / deisx - 1 - intY);
          _this.circle(xss, yss, 2, ctx);
        });
      
      });
    }else{
      dataJson.forEach(function (x, y) {
        if (y >= dataJson.length - 1) {

        } else {
          startX = dataJson[y].x / _this.data.d_rpx / deisx;
          startY = dataJson[y].y / _this.data.d_rpx / deisx;
          endX = dataJson[y + 1].x / _this.data.d_rpx / deisx;
          endY = dataJson[y + 1].y / _this.data.d_rpx / deisx;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo((endX - startX) / (intTime / lineTime) + startX, (endY - startY) / (intTime / lineTime) + startY);
          ctx.setStrokeStyle('#ffffff');
          ctx.stroke()
        }
      })
      dataJson.forEach(function (x, y) {
        let xs = (x.x / _this.data.d_rpx / deisx - 1 - intX);
        let ys = (x.y / _this.data.d_rpx / deisx - 1 - intY);
        _this.circle(xs, ys, 2, ctx);
      });
    }
    ctx.restore();
    ctx.draw();
  },
  // can() {
  //   var $this = this;
  //   // const ctx = wx.createCanvasContext('friend');
  //   const ctxs = wx.createCanvasContext('friends');
  //   let img2 = $this.data.json.info.starInfoList[0].filePath;
  //   let img3 = $this.data.json.info.starInfoList[1].filePath;
  //   // let img4 = 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/ground1_new.png';
  //   // let img5 = 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/ground2.png';
  //   var w1 = '';
  //   var h1 = '';
  //   let w2 = '';
  //   let h2 = '';
  //   let w3 = '';
  //   let h3 = '';
  //   let deisx = 750 / wx.getSystemInfoSync().screenWidth;
  //   wx.getImageInfo({
  //     src: img2,
  //     success: function (res2) {
  //       img2 = res2.path;
  //       w2 = res2.width;
  //       h2 = res2.height;
  //       wx.getImageInfo({
  //         src: img3,
  //         success: function (res3) {
  //           img3 = res3.path;
  //           w3 = res3.width;
  //           h3 = res3.height;
  //           ctxs.setFillStyle('#D75294');
  //           ctxs.fillRect(0, 0, 750 / deisx, 480/deisx);
  //           // ctxs.drawImage(img5, 0, 0, w1 / deisx, h1 / deisx, 0, 0, 500 / deisx, 400 / deisx);
  //           ctxs.save()
  //           $this.roundRect(ctxs, 67 / deisx, 55 / deisx, 148 / deisx, 196 / deisx, 3, '#ffffff', '#ffffff');
  //           ctxs.drawImage(img2, 0, 0, w2, w2 / .75, 68 / deisx, 56 / deisx, 146 / deisx, 194 / deisx);
  //           ctxs.restore();
  //           ctxs.save();
  //           $this.roundRect(ctxs, 279 / deisx, 55 / deisx, 148 / deisx, 196 / deisx, 3, '#ffffff', '#ffffff');
  //           ctxs.drawImage(img3, 0, 0, w3, w3 / .75, 280 / deisx, 56 / deisx, 146 / deisx, 194 / deisx);
  //           ctxs.restore();
  //           ctxs.setFillStyle('#ffffff')
  //           ctxs.setTextAlign('center');
  //           ctxs.setFontSize(12);
  //           ctxs.fillText($this.data.json.info.starInfoList[0].starName, 67 / deisx + 148 / deisx / 2, 290 / deisx, 148 / deisx);
  //           ctxs.fillText($this.data.json.info.starInfoList[1].starName, 280 / deisx + 148 / deisx / 2, 290 / deisx, 148 / deisx);
  //           ctxs.setFontSize(13);
  //           ctxs.fillText($this.data.json.info.matchStarMemo, 500 / deisx / 2, 340 / deisx, 460 / deisx);
  //           ctxs.draw(true, setTimeout(function () {
  //             wx.canvasToTempFilePath({
  //               x: 0,
  //               y: 0,
  //               width: 500,
  //               height: 400,
  //               destWidth: 1000,
  //               destHeight: 800,
  //               canvasId: 'friends',
  //               quality: 1,
  //               success: function (res) {
  //                 $this.setData({
  //                   bigimg1: res.tempFilePath
  //                 })
  //               },
  //               fail(error) {

  //               },
  //             })
  //           }, 1000));
  //         },
  //         fail(error) {

  //         },
  //       });
  //     },
  //     fail(error) {

  //     },
  //   });
  // },
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
    if (!_this.data.isme) {

      wx.navigateTo({
        url: '../../other_pages/takephoto/takephoto?from=index',
      })
    } else {
      if (!_this.data.faceSwapLoading) {
        _this.setData({
          faceSwapLoading: true,
        })
        if (wx.getStorageSync('detailtodesign') != '' || _this.data.templateNo != '' && _this.data.templateNo != undefined && _this.data.templateNo != 'undefined') {
          option_data['templateNo'] = _this.data.templateNo;
        };
        _this.setData({
          tramsHidden:false,
        })
        util.post(`${faceSwap}`, option_data).then(res1 => {
          let datas = res1.info;
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
          } else if (res1.data.code == 5004) {
            wx.showToast({
              title: '你还没有拍照！',
              icon: 'none'
            })
            setTimeout(function () {
              wx.navigateTo({
                url: '../../other_pages/takephoto/takephoto?first=true',
              })
            }, 1500);
          } else {
            uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(res1)}`);
            let title = "系统通知";
            let notice = "出错啦";
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
            return;
          }
          _this.setData({
            faceSwapLoading: false,
            tramsHidden: true,
          })
        }).catch(error => {
          uploadErrorInfoFn(`${faceSwapTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(option_data)};errorinfo:${JSON.stringify(error)}`);
          let title = "系统通知";
          let notice = "出错啦";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          _this.setData({
            tramsHidden: true,
          })
          return;
        })
      } else {
        _this.setData({
          tramsHidden: true,
        })
      }
    };
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
  onMyEvent(e) {
    user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    _this.setData({
      show: true
    })
    let para = {
      userId: _this.data.isnotmeid == '' ? user_id : _this.data.isnotmeid,
      version: version
    };
    util.get(`${getAnalyzeResult}`,para).then(res => {
      var data = res;
      var code = data.code;
      if (code == 0) {
        _this.setData({
          info: data.info
        })
      } else if (code == 5002) {
        wx.showToast({
          title: '咦？人呢？重新上传一张你的盛世美颜吧',
          icon: 'none'
        })
      } else if (code == 50021) {
        wx.showToast({
          title: '哎呀有好多人啊~大乐都不知道先给谁设计好了',
          icon: 'none'
        })
      } else if (code == 5003) {
        var errorInfo = data.info.errorInfo;
        var errorConetent = [];
        for (var i = 0; i < errorInfo.length; i++) {
          errorConetent.push(errorToast[errorInfo[i]]);
        }
        wx.showToast({
          title: errorConetent,
          icon: 'none'
        })
      } else {
        uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error => {
      uploadErrorInfoFn(`${getAnalyzeResultTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      wx.hideLoading();
      let title = "系统通知";
      let notice = '出错啦';
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
    })
  },
  



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: false
    });
    wx.setStorageSync('aifn', true)
    const _this = this;
    baseShare(_this);
    let x = Math.round(Math.random() * 1);
    return {
      title: AiSharePage[x],
      path: `/pages/test/test?shareUserId=${user_id}&share=true&from=user&scene=${getUrl()}`,
      // imageUrl: this.data.bigimg1,
      imageUrl:'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/ai_share_new.png',
      success: (res) => {
      }
    }
  },
})