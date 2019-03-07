const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  getUrl,
  baseShare,
  uploadErrorInfoFn,
  get,
  post,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  selectHairTagByTagType,
  selectHairTagByTagTypeTitle,
  updateHairStylistInfo,
  updateHairStylistInfoTitle,
  updateUserInfo,
  updateUserInfoTitle,
  nonspecificSharePage,
} from '../../config.js';
Page({
  data: {
    label_list:[],
    isStylist: '',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    _this.setData({
      isStylist: options.isStylist
    })
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
    let para = {
      userId: user_id,
      version: version,
      tagType: 4
    }
    get(`${selectHairTagByTagType}`,para).then(res=>{
      if (res.code == 0) {
        let data = [];
        res.info.sHairTags.forEach(function (x, y) {
          data.push({
            label: x.tagLabel,
            id: x.tag,
            staut: 1,
          })
        });
        if (options.data != null && options.data != undefined) {
          let optionsdata = options.data.split("、");
          optionsdata.forEach(function (x, y) {
            data.forEach(function (xs, ys) {
              if (x == xs.label) {
                xs.staut = 0;
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
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
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
    if ( _data[e.currentTarget.dataset.id].staut != 0 ){
      _data.forEach(function (x, y) {
        if (x.staut == 0) {
          num = num + 1;
        }
      });
    };
    if (num >= 5) {
      wx.showToast({
        title: '喜好最多只能选择5项',
        icon: "none"
      })
    } else {
      _data[e.currentTarget.dataset.id].staut = !_data[e.currentTarget.dataset.id].staut;
      this.setData({
        label_list: _data
      })
    }
  },
  btn(){
    wx.showLoading({
      title: '加载中...',
			mask:true
    })
    const _this = this;
    let datas = '';
    _this.data.label_list.forEach(function(x,y){
      if (x.staut == 0 ){
        if( datas == '' ){
          datas = x.id;
        }else{
          datas = datas + ',' + x.id;
        }
      }
    })
    let url = '';
    let urlTitle = '';
    let _data = {
      userId: user_id,
      version: version,
      interest: datas,
    };
    if (_this.data.isStylist == 0) {
      url = updateUserInfo;
      urlTitle = updateUserInfoTitle;
      _data['personId'] = wx.getStorageSync('userInfo').personId
    } else {
      url = updateHairStylistInfo;
      urlTitle = updateHairStylistInfoTitle;
    };
    post(`${url}`, _data).then(res=>{
      if (res.code == 0) {
        wx.navigateBack({
          delta: 1
        })
      } else {
        uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(_data)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(_data)};errorinfo:${JSON.stringify(error)}`);
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
      path: `/pages/index/index?shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
        
      },
    }
    return shareObj;
  },
})