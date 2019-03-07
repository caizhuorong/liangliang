const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
import {
  version,
  nonspecificSharePage,
  selectFansList,
  selectFansListTitle,
  addFollow,
  addFollowTitle,
  deleteFollow,
  deleteFollowTitle
} from '../../config.js';
import {
  getUrl,
  delNull,
  baseShare,
  numto,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    list:[],
    isnolist:false,
    targetUserId:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  delFollow(e){
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '确定不再关注此人？',
      confirmText: '确定',
      success(res1) {
        console.log(res1);
        if (res1.confirm) {
					let para={
						userId: wx.getStorageSync('userInfo').userId,
						version: version,
						stylistId: e.currentTarget.dataset.id
					}
					util.post(`${deleteFollow}`,para).then(res=>{
						let data = res.info;
						if (res.code == 0) {
						  let _data = _this.data.list;
						  _data[e.currentTarget.dataset.ids].isFollowed = 0;
						  _this.setData({
						    list: _data
						  })
						} else {
              uploadErrorInfoFn(`${deleteFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
						  let title = "系统通知";
						  let notice = '出错啦';
						  wx.navigateTo({
						    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
						  })
						}
					}).catch(error=>{
            uploadErrorInfoFn(`${deleteFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
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

   

  },
  goToHairMan(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../../others_pages/heart_center/heart_center?id=${data.id}&isStylist=${data.isstylist}`,
    })
  },
  changeFollow(e) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const _this = this;
		let para={
			userId: wx.getStorageSync('userInfo').userId,
			version: version,
			stylistId: e.currentTarget.dataset.id
		}
		util.post(`${addFollow}`,para).then(res=>{
      if( res.code == 0 ){
        let _data = _this.data.list;
        _data[e.currentTarget.dataset.ids].isFollowed = 1;
        _this.setData({
          list: _data
        })
        if (res.info.points.points != undefined) {
          if (delNull(res.info.points.points.background) == '') {
            return false;
          }
          let banner_url = res.info.points.points.background;
          let _show;
          if (wx.getStorageSync('signLayer') == 1) {
            _show = false;
          } else {
            _show = true;
          }
          this.setData({
            shareLayer: _show,
            layerBanner: `${banner_url}`,
            layerLabel: res.info.points.points.prompt,
            layerTips: res.info.points.points.points,
            code: res.info.points.points.code
          });
        }
      }else{
        uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  btn() {
    wx.navigateTo({
      url: '../release/release',
    })
  },
  onLoad(e){
    this.setData({
      targetUserId:e.userId
    },()=>{
      this.getAjax();
    })
  },
  getAjax(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const _this= this;
		let para={
			targetUserId: _this.data.targetUserId,
			userId:wx.getStorageSync('userInfo').userId,
			version: version
		}
		util.get(`${selectFansList}`,para).then(res=>{
		  if( res.code == 0) {
			  _this.setData({
			    list: res.info.list,
			  });
			} else if (res.code == 2002) {
			  _this.setData({
			    list: [],
			    isnolist:true
			  })
			} else{
        uploadErrorInfoFn(`${selectFansListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			};
			wx.stopPullDownRefresh();
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${selectFansListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			let title = "系统通知";
			let notice = '出错啦';
			 wx.stopPullDownRefresh();
			wx.hideLoading();
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
		})
  },
  onPullDownRefresh: function () {
    this.getAjax();
  },
  onReachBottom: function () {

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
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  }
})