const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
import {
  nonspecificSharePage,
  selectUserStylistList,
  version
} from '../../config.js';
import {
  baseShare,
  getUrl,
  get,
  post,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    choose_type: false,
    label_title: '按人气-从高到低',
    label_index: 1,
    isTemplate: 0,
    man_list: [],
    loading_text: '加载中...',
    displaytype: false,
    onReachBottom: true,
    num: 1,
    no: 0,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function(options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    _this.setData({
      isTemplate: options.isTemplate,
      no: options.no
    }, () => {
      _this.getManList(1, _this.data.num,true);
    });
  },
  getManList(type, num,clearn_type) {
    const _this = this;
    let datas = {};
    if (_this.data.onReachBottom) {
      wx.showLoading({
				title:'加载中...',
				mask:true
			});
      if (_this.data.isTemplate == 1) {
        datas = {
          userId: user_id,
          version: version,
          latitude: wx.getStorageSync('user_location').latitude,
          longitude: wx.getStorageSync('user_location').longitude,
          templateNo: _this.data.no,
          orderFlag: type,
          pageNum: num
        }
      } else {
        datas = {
          userId: user_id,
          version: version,
          latitude: wx.getStorageSync('user_location').latitude,
          longitude: wx.getStorageSync('user_location').longitude,
          productionNo: _this.data.no,
          orderFlag: type,
          pageNum: num
        }
      };
			wx.showLoading({
				title:'加载中...',
				mask:true
			})
			let para=datas;
			get(`${selectUserStylistList}`,para).then(res=>{
				wx.stopPullDownRefresh();
				let data = res.info.sHairUserStylistResps;
				let _data = _this.data.man_list;
				if (res.code == 0) {
				  let loading_text = '加载中...';
				  let loading_type = true;
				  if (data.length < 20) {
				    loading_text = '已经拉到底啦';
				    loading_type = false;
				  } else {
				    loading_text = '上拉加载更多';
				    loading_type = true;
				  };
				  if (clearn_type ){
				    _data = [];
				  }
				  data.forEach(function(x, y) {
				    _data.push(x);
				  });
				  _this.setData({
				    man_list: _data,
				    loading_text: loading_text,
				    onReachBottom: loading_type
				  })
				} else {
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../error/error?title=' + title + "&notice=" + notice,
				  })
				}
				wx.hideLoading();
			}).catch(error=>{
				wx.stopPullDownRefresh();
				let title = "系统通知";
				let notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    }
  },
  chooseType: function(e) {
    this.setData({
      choose_type: !this.data.choose_type
    });
  },
  chooseLabels() {
    this.setData({
      choose_type: false
    })
  },
  chooseLabel(e) {
    const _this = this;
    this.setData({
      choose_type: false,
      label_title: e.currentTarget.dataset.title,
      label_index: e.currentTarget.dataset.index,
      man_list: [],
      num: 1,
      onReachBottom: true,
      loading_text: '加载中...',
    }, () => {
      _this.getManList(_this.data.label_index, _this.data.num,true)
    })
  },
  onPullDownRefresh: function() {
    const _this = this;
    _this.setData({
      choose_type: false,
      num: 1,
      loading_text: '加载中...',
      onReachBottom: true
    }, () => {
      _this.getManList(_this.data.label_index, _this.data.num,true)
    })
  },
  onReachBottom: function() {
    const _this = this;
    _this.setData({
      displaytype: true
    });
    if (_this.data.onReachBottom) {
      _this.setData({
        choose_type: false,
        num: _this.data.num + 1,
        loading_text: '加载中...',
      }, () => {
        _this.getManList(_this.data.label_index, _this.data.num,false)
      })
    }
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