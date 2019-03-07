const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
let util = require('../../utils/util.js');
import {
  uploadErrorInfoFn,
  getUrl,
  baseShare,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  nonspecificSharePage,
  updateHairStylistInfo,
  updateHairStylistInfoTitle,
} from '../../config.js';
Page({
  data: {
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    label_list:[
      {
        label:'周一',
        id:0,
        staut:false
      },
      {
        label: '周二',
        id: 1,
        staut: false
      },
      {
        label: '周三',
        id: 2,
        staut: false
      },
      {
        label: '周四',
        id: 3,
        staut: false
      },
      {
        label: '周五',
        id: 4,
        staut: false
      },
      {
        label: '周六',
        id: 5,
        staut: false
      },
      {
        label: '周日',
        id: 6,
        staut: false
      },
      {
        label: '我是工作狂，全年无休',
        id: 7,
        staut: false
      },
    ]
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    let data = this.data.label_list;
    if (options.data == '' ){
      this.data.label_list[7].staut = true;
    }else{
      if (options.data != null && options.data != undefined) {
        let optionsdata = options.data.split("、");
        optionsdata.forEach(function (x, y) {
          data.forEach(function (xs, ys) {
            if (x == xs.label) {
              xs.staut = true;
            }
          })
        });

      }
    }

    this.setData({
      label_list: data
    })
  },
  changeChose(e){
    let _data = this.data.label_list;
    if (e.currentTarget.dataset.id == 7 ){
      _data.forEach(function(x,y){
        if( x.id < 7 ){
          x.staut = false;
        }else{
          x.staut = true;
        }
      })
    }else{
      _data[e.currentTarget.dataset.id].staut = !_data[e.currentTarget.dataset.id].staut;
      _data[7].staut =false;
    };
   
    this.setData({
      label_list: _data
    })
  },
  btn() {
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
    const _this = this;
    let datas = '';
    _this.data.label_list.forEach(function (x, y) {
      if (x.staut) {
        if (datas == '') {
          datas = '0';
        } else {
          datas = datas + ',0';
        }
      }else{
        if (datas == '') {
          datas = '1';
        } else {
          datas = datas + ',1';
        }
      };
      if( y == 7 && x.staut ){
        datas = "1,1,1,1,1,1,1";
      }
    })
    let para = {
      userId: user_id,
      version: version,
      workDate: datas
    }
    util.post(`${updateHairStylistInfo}`,para).then(res=>{
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      var title = "系统通知";
      var notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
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
      path: `/pages/index/index?shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  },
})