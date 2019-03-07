const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import { 
  getHairCouponList, 
  getHairCouponListTitle,
  getTemplateCountsGoods,
  getTemplateCountsGoodsTitle, 
  getWechatPrePayOrder,
  getWechatPrePayOrderTitle, 
  friendSharePage, 
  getPayOrderStatus,
  getPayOrderStatusTitle,
  version, 
  friendSharePageImg
} from '../../config.js';
import { 
  uploadErrorInfoFn, 
  getUrl,
  delNull,
  baseShare,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    pay_list:[],
    setInter:{},
    mask:false,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  looktip(){
    this.setData({
      mask:true
    })
  },
  closeMask(){
    this.setData({
      mask:false,
    })
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    let pageId = 'P00001'; 
		let para={
			pageId:'P00001',
			userId:user_id,
			version:version
		}
    util.get(`${getTemplateCountsGoods}`,para).then(res=>{
      if( res.code == 0 ){
        let data = [];
        res.info.goodsInfo.forEach(function(x,y){
          data.push({
            priceNow: delNull(x.priceNow),
            priceBefore: delNull(x.priceBefore),
            goodsCode: delNull(x.goodsCode),
            label: delNull(x.label),
            name: delNull(x.name),
            synopsis: delNull(x.synopsis)
          })
        });
        _this.setData({
          pay_list: data
        })
      }else{
        uploadErrorInfoFn(`${getTemplateCountsGoodsTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    }).catch(e=>{
      uploadErrorInfoFn(`${getTemplateCountsGoodsTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
    });
    _this.getHairCouponList();
  },
  getHairCouponList() {
    const _this = this;
    let para = {
      userId: user_id,
      version: version
    };
    util.get(`${getHairCouponList}`, para).then(res => {
      if (res.code == 0) {
        let canUse = 0;
        let startTime = 0;
        let endTime = 0;
        let nowTime = 0;
        res.info.resultList.forEach(function(x,y){
          if (delNull(x.couponEndTime) == ''  ){
            canUse ++;
          }else{
            startTime = Number(new Date(x.couponStartTime));
            endTime = Number(new Date(x.couponEndTime));
            nowTime = Number(new Date());
            var date = x.couponStartTime;
            date = date.substring(0, 19);
            date = date.replace(/-/g, '/');
            var timestamp = new Date(date).getTime();
            var dates = x.couponEndTime;
            dates = dates.substring(0, 19);
            dates = dates.replace(/-/g, '/');
            var timestamps = new Date(dates).getTime();
            if (delNull(x.couponStartTime) != '' && timestamp < nowTime && timestamps > nowTime ){
              canUse ++;
            }
          }
        })
        setTimeout(function(){
          if (canUse != 0) {
            wx.showToast({
              title: '有可用优惠券，记得使用哦',
              icon: 'none',
              mask: true
            })
          }
        },50)
   
      } else {
        uploadErrorInfoFn(`${getHairCouponListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    }).catch(e => {
      uploadErrorInfoFn(`${getHairCouponListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
    })
  },
  pay(e){
    wx.navigateTo({
      url: `../../other_pages/order/order?name=${e.currentTarget.dataset.name}&label=${e.currentTarget.dataset.label}&nowprice=${e.currentTarget.dataset.nowprice}&goodscode=${e.currentTarget.dataset.code}`,
    })
  },

  onShareAppMessage: function (res) {
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
      success: (res) => {
        console.log(res);
      }
    }
  }
})