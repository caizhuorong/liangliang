const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
import {
  getUrl,
  baseShare,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  insertRoast,
  insertRoastTitle,
  nonspecificSharePage
} from '../../config.js';
Page({
  data: {
    num:0,
    value:'',
    tel_value:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  change(e){
    this.setData({
      num: e.detail.value.length,
      value:e.detail.value
    })
  },
  changes(e){
    this.setData({
      tel_value:e.detail.value
    })
  },
  btn(){
    const _this = this;
    let _data = _this.data.tel_value;
    var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;	//电话	
    var phone = _data;
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '请输入有效的手机号码',
        icon: 'none'
      })
      return false;
    } else if( _this.data.value == '' ) {
      wx.showToast({
        title: '请输入意见和反馈',
        icon:'none',
      })
    }else{
			wx.showLoading({
				title:'加载中...',
				mask:true
			})
			let para={
				userId: user_id,
				version: version,
				content:_this.data.value,
				organizationNo:organizationNo,
				smallprogramNo: smallProgramNo,
				mobile: _this.data.tel_value
			}
			util.post(`${insertRoast}`,para).then(res=>{
				if (res.code == 0) {
				  wx.showToast({
				    title: '已收到您的反馈，谢谢~',
				    icon:'success',
				    success(){
				      setTimeout(function(){
				        wx.switchTab({
				          url: `../../pages/user/user`
				        })
				      },1500)
				    }
				  })
				} else {
          uploadErrorInfoFn(`${insertRoastTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice ='出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
				wx.hideLoading();
			}).catch(error=>{
        uploadErrorInfoFn(`${insertRoastTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    }
  },
  makephone(e){
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.num
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