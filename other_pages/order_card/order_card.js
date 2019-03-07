const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import {
  getUrl,
  uploadErrorInfoFn,
  delNull,
  baseShare,
  numto,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  nonspecificSharePage,
  getHairCouponList,
  getHairCouponListTitle
} from '../../config.js';
Page({
  data: {
    note: [],
    totalprice:0,
    name:'',
    goodscode:'',
    nowprice:'',
    totalPrice:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  getHairCouponList() {
    const _this = this;
    let para={
      userId: user_id,
      version: version
    }
    util.get(`${getHairCouponList}`,para).then(res => {
      let data = res.info;
      let _data = _this.data.note;
      if (res.code == 0) {
        if (data.length == 0) {

        } else {
          data.resultList.forEach(function (x, y) {
            let _n = 0;
            if (x.amountOfMoney == null  ){
              if (x.subtraction != 0 && x.subtraction != null) {
                _n = _this.data.totalprice - x.subtraction;
                _data.push({
                  no: x.no,
                  startTime: _this.subTime(x.startTime),
                  endTime: _this.subTime(x.endTime),
                  subtraction: delNull(x.subtraction),
                  couponType: delNull(x.couponType),
                  discount: delNull(x.discount),
                  couponName: delNull(x.couponName),
                  couponLabel: delNull(x.couponLabel),
                  amountOfMoney: x.amountOfMoney,
                  couponId: x.couponId,
                  show: true,
                  nowPrice: _n.toFixed(2)
                })
              } else {
                _n = _this.data.totalprice - x.subtraction;
                _data.push({
                  no: x.no,
                  startTime: _this.subTime(x.startTime),
                  endTime: _this.subTime(x.endTime),
                  subtraction: delNull(x.subtraction),
                  couponType: delNull(x.couponType),
                  discount: delNull(x.discount),
                  couponName: delNull(x.couponName),
                  couponLabel: delNull(x.couponLabel),
                  amountOfMoney: x.amountOfMoney,
                  couponId: x.couponId,
                  show: true,
                  nowPrice: _n.toFixed(2)
                })
              }
            }else{
              if (x.amountOfMoney <= _this.data.totalprice ){
                if (x.subtraction != 0 && x.subtraction != null ){
                  _n = _this.data.totalprice - x.subtraction;
                  _data.push({
                    no: x.no,
                    startTime: _this.subTime(x.startTime),
                    endTime: _this.subTime(x.endTime),
                    subtraction: delNull(x.subtraction),
                    couponType: delNull(x.couponType),
                    discount: delNull(x.discount),
                    couponName: delNull(x.couponName),
                    couponLabel: delNull(x.couponLabel),
                    amountOfMoney: x.amountOfMoney,
                    couponId: x.couponId,
                    show: true,
                    nowPrice: _n.toFixed(2)
                  })
                }else{
                  _n = _this.data.totalprice - x.subtraction;
                  _data.push({
                    no: x.no,
                    startTime: _this.subTime(x.startTime),
                    endTime: _this.subTime(x.endTime),
                    subtraction: delNull(x.subtraction),
                    couponType: delNull(x.couponType),
                    discount: delNull(x.discount),
                    couponName: delNull(x.couponName),
                    couponLabel: delNull(x.couponLabel),
                    amountOfMoney: x.amountOfMoney,
                    couponId: x.couponId,
                    show: true,
                    nowPrice: _n.toFixed(2)
                  })
                }
     
              }else{
                _data.push({
                  no: x.no,
                  startTime: _this.subTime(x.startTime),
                  endTime: _this.subTime(x.endTime),
                  subtraction: delNull(x.subtraction),
                  couponType: delNull(x.couponType),
                  discount: delNull(x.discount),
                  couponName: delNull(x.couponName),
                  couponLabel: delNull(x.couponLabel),
                  amountOfMoney: x.amountOfMoney,
                  couponId: x.couponId,
                  show: false,
                  nowPrice:0,
                })
              }
            }
          });
        }
        let h =_data.sort(_this.compare("age"));
        
        console.log(h);
        _this.setData({
          note: h,
        });
      } else if (res.code == 2003) {

      } else {
        uploadErrorInfoFn(`${getHairCouponListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }).catch(e => {
      uploadErrorInfoFn(`${getHairCouponListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  goToOrder(e){
    const _this = this;
    this.data.note.forEach(function(x,y){
      if (x.no == e.currentTarget.dataset.no ){
        wx.setStorageSync('cardDetail', x);
        wx.navigateBack({
          delta:1
        })
      }
    });
  },
  onUnload(){
    console.log(getCurrentPages());
  },
  compare (prop) {
    return function (obj1, obj2) {
      var val1 = obj1[prop];
      var val2 = obj2[prop];
      if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
        val1 = Number(val1);
        val2 = Number(val2);
      }
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    }
  },
  subTime(e) {
    let data = e.substr(0, 10);
    return data;
  },
  onLoad(options) {
    this.setData({
      totalprice: options.totalprice,
    });
   
  },
  onShow(){
    user_id = wx.getStorageSync('userInfo').userId;
    this.getHairCouponList();
  },
  onPullDownRefresh: function () {
    const _this = this;
    const { curr } = _this.data;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    _this.setData({
      note: [],
    }, () => {
      _this.getHairCouponList();
    })
  },
  onShareAppMessage: function () {
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
    var shareObj = {
      title: shareTitle[x],
      desc: '拍照就能造型，为你量身打造适合你的发型',
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  },
})
