const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import {
  getUrl,
  delNull,
  baseShare,
  numto,
  uploadErrorInfoFn,
	mathRandom,
} from '../../utils/util.js';
import {
  version,
  nonspecificSharePage,
  getAllHairCouponList,
  getAllHairCouponListTitle,
  readCoupon,
  readCouponTitle,
} from '../../config.js';
Page({
  data: {
    left: true,
    note: [],
    allData:{},
    curr: 0,
    lstUnusedNum:0,
    lstOverdueNum:0,
    lstUsedNum:0,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  goToPay(){
    wx.navigateTo({
      url: '../../pages/pay/pay',
    })
  },
  change(e) {
    const _this = this;
    if (e.currentTarget.dataset.id != _this.data.curr) {
     
      _this.setData({
        note: [],
        curr: e.currentTarget.dataset.id
      },()=>{
        let data = _this.data.allData;
        let _data = [];
        if (_this.data.curr == 0) {
          data.lstUnused.forEach(function (x, y) {
            _data.push({
              no: x.no,
              startTime: _this.subTime(x.startTime),
              endTime: _this.subTime(x.endTime),
              subtraction: delNull(x.subtraction),
              couponType: delNull(x.couponType),
              discount: delNull(x.discount),
              couponName: delNull(x.couponName),
              amountOfMoney: x.amountOfMoney,
              readFlag: x.readFlag
            })
          });
        } else if (_this.data.curr == 1) {
          data.lstUsed.forEach(function (x, y) {
            _data.push({
              no: x.no,
              startTime: _this.subTime(x.startTime),
              endTime: _this.subTime(x.endTime),
              subtraction: delNull(x.subtraction),
              couponType: delNull(x.couponType),
              discount: delNull(x.discount),
              couponName: delNull(x.couponName),
              amountOfMoney: x.amountOfMoney,
              readFlag: x.readFlag
            })
          });
        } else {
          data.lstOverdue.forEach(function (x, y) {
            _data.push({
              no: x.no,
              startTime: _this.subTime(x.startTime),
              endTime: _this.subTime(x.endTime),
              subtraction: delNull(x.subtraction),
              couponType: delNull(x.couponType),
              discount: delNull(x.discount),
              couponName: delNull(x.couponName),
              amountOfMoney: x.amountOfMoney,
              readFlag: x.readFlag
            })
          });
        }
        _this.setData({
          note:_data
        })
      });
    };
  },
  readCoupon(){
    const _this = this;
    let couponNo=[];
    _this.data.note.forEach(function(x,y){
      if (x.readFlag != 1 ){
        couponNo.push(x.no);
      }
    });
    let para={
      couponNo: couponNo,
      userId:user_id,
      version: version
    };
    if (couponNo.length != 0 ){
      util.post(`${readCoupon}`, para).then(res => {
        if (res.code == 0) {
        } else {
          uploadErrorInfoFn(`${readCouponTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = '出错啦';
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        }
      }).catch(e => {
        uploadErrorInfoFn(`${readCouponTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      })
    }
  },
  getAllHairCouponList() {
    const _this = this;
    let para ={
      userId: user_id,
      version: version,
    }
    util.get(`${getAllHairCouponList}`,para).then(res => {
      console.log(res);
      let data = res.info;
      let _data = _this.data.note;
      if (res.code == 0) {
        let loading_type = true;
        if (data.length == 0) {
          
        } else {
          if( _this.data.curr == 0 ){
            data.lstUnused.forEach(function (x, y) {
              _data.push({
                no: x.no,
                startTime: _this.subTime(x.startTime),
                endTime: _this.subTime(x.endTime),
                subtraction: delNull(x.subtraction),
                couponType: delNull(x.couponType),
                discount: delNull(x.discount),
                couponName: delNull(x.couponName),
                amountOfMoney: x.amountOfMoney,
                readFlag: x.readFlag
              })
            });
          }else if( _this.data.curr == 1 ){
            data.lstUsed.forEach(function (x, y) {
              _data.push({
                no: x.no,
                startTime: _this.subTime(x.startTime),
                endTime: _this.subTime(x.endTime),
                subtraction: delNull(x.subtraction),
                couponType: delNull(x.couponType),
                discount: delNull(x.discount),
                couponName: delNull(x.couponName),
                amountOfMoney: x.amountOfMoney,
                readFlag: x.readFlag
              })
            });
          }else{
            data.lstOverdue.forEach(function (x, y) {
              _data.push({
                no: x.no,
                startTime: _this.subTime(x.startTime),
                endTime: _this.subTime(x.endTime),
                subtraction: delNull(x.subtraction),
                couponType: delNull(x.couponType),
                discount: delNull(x.discount),
                couponName: delNull(x.couponName),
                amountOfMoney: x.amountOfMoney,
                readFlag: x.readFlag
              })
            });
          }
        }
        _this.setData({
          note: _data,
          lstUnusedNum: data.lstUnused.length,
          lstOverdueNum: data.lstOverdue.length,
          lstUsedNum: data.lstUsed.length,
          allData:data
        },()=>{
          if( _this.data.curr == 0 ){
            _this.readCoupon(); 
          }
        });
      } else if (res.data.code == 2003) {

      } else {
        uploadErrorInfoFn(`${getAllHairCouponListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }).catch(e => {
      uploadErrorInfoFn(`${getAllHairCouponListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  subTime(e){
    let data = e.substr(0,10);
    return data;
  },
  onLoad() {
    user_id = wx.getStorageSync('userInfo').userId;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.getAllHairCouponList();
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
        _this.getAllHairCouponList();
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
