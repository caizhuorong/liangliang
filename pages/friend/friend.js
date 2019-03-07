const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
import { 
  friendSharePageImg, 
  friendSharePage, 
  selectInvitationUserContents, 
  selectInvitationUserContentsTitle,
  version,
  getQRCode,
  getQRCodeTitle,
} from '../../config.js';
import {
  getUrl,
  uploadErrorInfoFn,
  baseShare,
  numto,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    friend_info:{
      totalCount:0,
      usedCount:0
    },
    ewm:'',
    shareImgUrl: "",
    bigimg:'',
    invitedUserCount:0,
    remainedCount:0,
    rewardTemplateCount:0,
    totalCount:0,
    usedCount:0,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
		wx.showLoading({
			title:'加载中...',
			mask:true
		})
		let para={
			userId: user_id,
			version: version
		};
		util.get(`${selectInvitationUserContents}`,para).then(res=>{
			if( res.code == 0 ){
			  let invitedUserCount = res.info.invitedUserCount != null ? numto(res.info.invitedUserCount) : 0;
			  let remainedCount = res.info.remainedCount != null ? numto(res.info.remainedCount) : 0;
			  let rewardTemplateCount = res.info.rewardTemplateCount != null ? numto(res.info.rewardTemplateCount) :0;
			  let totalCount = res.info.totalCount != null ? numto(res.info.totalCount) :0;
			  let usedCount = res.info.usedCount != null ? numto(res.info.usedCount) :0;
			  if (res.info.invitationListNewest != null && res.info.invitationListNewest != '' && res.info.invitationListNewest != undefined ){
			    res.info.invitationListNewest.forEach(function(x,y){
			      if (x.userNick != null ){
			        if (x.userNick.length > 2 ) {
			          let x_one_length = x.userNick.length;
			          let _x_one_text = x.userNick.substring(0, 2);
			          let xing = '';
			          xing = xing + '*';
			          x.userNick = _x_one_text + xing;
			        };
			      }
			      if (x.invitationUserNick != null ){
			        if (x.invitationUserNick.length > 2) {
			          let x_one_length = x.invitationUserNick.length;
			          let _x_one_text = x.invitationUserNick.substring(0, 2);
			          let xing = '';
			          xing = xing + '*';
			          x.invitationUserNick = _x_one_text + xing;
			        }
			      };
			    })
			  };
			  _this.setData({
			    friend_info:res.info,
			    invitedUserCount: invitedUserCount,
			    remainedCount: remainedCount,
			    rewardTemplateCount: rewardTemplateCount,
			    totalCount: totalCount,
			    usedCount: usedCount,
			  })
			}else{
        uploadErrorInfoFn(`${selectInvitationUserContentsTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${selectInvitationUserContentsTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
		let param={
			scene: user_id,
			version: version,
			smallProgramNo: smallProgramNo,
			userId:user_id
		}
		util.post(`${getQRCode}`,param).then(res=>{
			if (res.code == 0) {
			  _this.setData({
			    ewm: res.info.qrcode
			  },()=>{
			    wx.hideLoading();
			  })
			} else {
        uploadErrorInfoFn(`${getQRCodeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
			  var title = "系统通知";
			  var notice = "出错啦";
			  wx.navigateTo({
			 	  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${getQRCodeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  gotolist(){
    wx.navigateTo({
      url: '../../others_pages/friend_list/friend_list',
    })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
    }
		wx.showShareMenu({
      withShareTicket: false
    })
    const _this = this;
    baseShare(_this);
    let storageShareInfo = wx.getStorageSync('shareInfo');
    let shareTitle = storageShareInfo.pointTitle.split('|');
   let x = mathRandom(shareTitle);
    let shareImageUrl = '';
    if (storageShareInfo.pointFlag == '1') {
      shareImageUrl = storageShareInfo.pointPicture.split('|');
    } else {
      shareImageUrl = '';
    }
    return {
      title: shareTitle[x],
      path: `/pages/index/index?shareUserId=${user_id}&scene=${getUrl()}`,
      imageUrl: shareImageUrl[x],
      success:(res) => {
      }
    }
  }
})