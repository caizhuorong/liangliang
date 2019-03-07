const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  uploadErrorInfoFn,
  getUrl,
  baseShare,
  get,
  post,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  nonspecificSharePage,
  selectHairTagByTagType,
  selectHairTagByTagTypeTitle,
  updateHairStylistInfo,
  updateHairStylistInfoTitle,
} from '../../config.js';
Page({
  data: {
    label_list:[],
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    let para ={
      userId: user_id,
      version: version,
      tagType: 13
    }
    get(`${selectHairTagByTagType}`,para).then(res=>{
      if (res.code == 0) {
        let data = [];
        res.info.sHairTags.forEach(function (x, y) {
          data.push({
            label: x.tagLabel,
            id: x.tag,
            staut: false,
          })
        });
        if (options.data != null && options.data != undefined) {
          let optionsdata = options.data.split("、");
          optionsdata.forEach(function (x, y) {
            data.forEach(function (xs, ys) {
              if (x == xs.label) {
                xs.staut = true;
              }
            })
          })
        }
        _this.setData({
          label_list: data
        })
      } else {
        uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      var title = "系统通知";
      var notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  changeChose(e){
    let _data = this.data.label_list;
    let num = 0;
    if (!_data[e.currentTarget.dataset.id].staut) {
      _data.forEach(function (x, y) {
        if (x.staut) {
          num = num + 1;
        }
      });
    };
 
    if (num  >= 3  ){
      wx.showToast({
        title:'特长最多只能选择3项',
        icon:"none"
      })
    }else{
      _data[e.currentTarget.dataset.id].staut = !_data[e.currentTarget.dataset.id].staut;
      this.setData({
        label_list: _data
      })
    }
  },
  btn(){
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
    const _this = this;
    let datas = '';
    _this.data.label_list.forEach(function (x, y) {
      if (x.staut) {
        if (datas == '') {
          datas = x.id;
        } else {
          datas = datas + ',' + x.id;
        }
      }
    })
    let para = {
      userId: user_id,
      version: version,
      goodAt: datas
    };
    post(`${updateHairStylistInfo}`,para).then(res=>{
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