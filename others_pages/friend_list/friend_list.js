const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import {
  getUrl,
  baseShare,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  version,
  deleteFollow,
  deleteFollowTitle,
  addFollow,
  addFollowTitle,
  selectInvitationUserList,
  selectInvitationUserListTitle,
} from '../../config.js';
Page({
  data: {
    info:[],
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  followType(e) {
    const _this = this;
    let data = _this.data.info;
    data.forEach(function (x, y) {
      if (x.user.userId == e.currentTarget.dataset.id) {
        if (data[y].isFollowed == 0 ){
					let para = {
						userId: user_id,
						version: version,
						stylistId: e.currentTarget.dataset.id
					};
					util.post(`${addFollow}`,para).then(res=>{
						if (res.code == 0) {
						  data[y].isFollowed = 1;
						  _this.setData({
						    info: data
						  });
							if (res.info.points.points != undefined ){
						    let storage = res.info.points.points;
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
							}
						} else {
              uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
						  let title = "系统通知";
						  let notice = '出错啦';
						  wx.navigateTo({
						  	url: '../error/error?title=' + title + "&notice=" + notice,
						  })
						}
					}).catch(error=>{
            uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
						let title = "系统通知";
						let notice = '出错啦';
						wx.navigateTo({
							url: '../error/error?title=' + title + "&notice=" + notice,
						})
					})
        }else{
          wx.showModal({
            title: '提示',
            content: '确定不再关注此人？',
            confirmText: '确定',
            success(res1) {
              console.log(res1);
              if (res1.confirm) {
								let para={
									userId: user_id,
									version: version,
									stylistId: e.currentTarget.dataset.id,
								};
								util.post(`${deleteFollow}`,para).then(res=>{
									if (res.code == 0) {
									  data[y].isFollowed = 0;
									  _this.setData({
									    info: data
									  })
									} else {
                    uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
									  let title = "系统通知";
									  let notice = '出错啦';
									  wx.navigateTo({
									    url: '../error/error?title=' + title + "&notice=" + notice,
									  })
									}
								}).catch(error=>{
                  uploadErrorInfoFn(`${addFollowTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
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
        }
      }
    })
  },
  gotocenter(e){
    console.log(e);
    let data = e.currentTarget.dataset;
    console.log(data.id)
    wx.navigateTo({
      url: `../../others_pages/heart_center/heart_center?id=${data.userid}&isStylist=${data.isstylist}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    wx.showLoading({
      title: '加载中...',
			mask:true
    })
		let para={
			userId: user_id,
			version: version
		};
		util.get(`${selectInvitationUserList}`,para).then(res=>{
			if (res.code == 0) {
        _this.setData({
          info: res.info == '' || res.info == null ? [] : res.info.invitationList
        })
			} else {
        uploadErrorInfoFn(`${selectInvitationUserListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			  	url: '../error/error?title=' + title + "&notice=" + notice,
			  })
			}
			wx.stopPullDownRefresh();
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${selectInvitationUserListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  onPullDownRefresh(){
    this.onLoad();
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