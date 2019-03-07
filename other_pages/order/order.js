const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import {
  uploadErrorInfoFn,
  getUrl,
  delNull,
  baseShare,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  nonspecificSharePage,
  getWechatPrePayOrder,
  getWechatPrePayOrderTitle,
  getPayOrderStatus,
  getPayOrderStatusTitle,
  getHairCouponList,
  getHairCouponListTitle,
} from '../../config.js';
let paying=true;
let first = true;
let cardInfo = {};
Page({
  data: {
    setInter: {},
    name:'',
    goodscode:'',
    nowprice:'',
    num: 1,
    minusStatus: 'disabled',
    totalPrice:0,
    cardNum:0,
    cardList:[],
    userNum:0,
    payable:0,
    type:false,
    label:'',
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  onUnload(){
    const _this = this;
    clearInterval(_this.data.setInter);
    _this.setData({
      setInter: ''
    });
    wx.removeStorageSync('cardDetail');
    paying = true;
  },
  bindPlus: function (e) {
    const _this = this;
    let _data = 0;
    let num = _this.data.num;
    var minusStatus = 'normal';
    if (e.currentTarget.dataset.type == 'reduce' ){
      if (num > 1) {
        num--;
      }
      minusStatus = num <= 1 ? 'disabled' : 'normal';
      _data = _this.data.nowprice * num;
    } else if (e.currentTarget.dataset.type == 'plus'  ){
      num++;
      _data = _this.data.nowprice * num;
      minusStatus = num < 1 ? 'disabled' : 'normal';
    }else{
      num = e.detail.value;
      _data = _this.data.nowprice * num;
    }
    console.log(_data);
    _this.setData({
      num: num,
      minusStatus: minusStatus,
      totalPrice: _data.toFixed(2),
    }, () => {
      _this.cardNumFn();
    });
  },
  goTocard(e){
    wx.navigateTo({
      url: `../order_card/order_card?totalprice=${e.currentTarget.dataset.totalprice}`,
    })
  },
  cardNumFns(){
    const _this = this;
    let _used = 0;
    let afterPrice = 0, cofimPrice = 0;
    cardInfo = {};
    _this.data.cardList.forEach(function (x, y) {
      if (x.amountOfMoney == null) {
        _used = _used + 1;
      } else {
        console.log(_this.data.totalPrice , x.amountOfMoney)
        if (_this.data.totalPrice >= x.amountOfMoney) {
          _used = _used + 1;
          if (x.couponType === '2') {
            afterPrice = parseFloat(_this.data.totalPrice) - parseFloat(x.subtraction);
          } else {
            afterPrice = parseFloat(_this.data.totalPrice) * parseFloat(x.discount);
          }
          if (cofimPrice === 0) {
            cofimPrice = afterPrice;
          }
          if (cofimPrice != 0 && afterPrice <= cofimPrice) {
            cofimPrice = afterPrice;
            cardInfo = x;
          }
        }
 
      }
    });
    if (_used == 0) {
      _this.setData({
        label: ''
      })
    };
    let payable = '';
    if (cofimPrice === 0) {
      payable = parseFloat(_this.data.totalPrice);
    } else {
      payable = cofimPrice;
    }
    _this.setData({
      userNum: _used,
      label: cardInfo.couponLabel != undefined ? cardInfo.couponLabel : '',
      payable: payable.toFixed(2),
    })
    first = false;
  },
  cardNumFn(){
    const _this = this;
    let _used = 0;
    
    if (_this.data.totalPrice >= cardInfo.amountOfMoney && wx.getStorageSync('cardDetail') ==''  ){
      if (cardInfo.subtraction != 0 && cardInfo.subtraction != null && cardInfo.subtraction != '') {
        payable = parseFloat(_this.data.totalPrice) - cardInfo.subtraction;
      } else {
        payable = parseFloat(_this.data.totalPrice) * cardInfo.discount;
      }
      _this.setData({
        payable: payable.toFixed(2),
      })
      return false;
    }
    _this.data.cardList.forEach(function(x,y){
      if (x.amountOfMoney == null  ){
        _used = _used+1;
      }else{
        if (_this.data.totalPrice >= x.amountOfMoney ) {
          _used = _used + 1;
        }
      }
    });
    if (_used == 0 ){
      _this.setData({
        label:''
      })
    };
    if (wx.getStorageSync('cardDetail') != '' ){
      if (parseFloat(_this.data.totalPrice) < wx.getStorageSync('cardDetail').amountOfMoney) {
        wx.removeStorageSync('cardDetail');
        _this.setData({
          label: ''
        })
      }
    }
    let payable = '';
    if ( wx.getStorageSync('cardDetail') != '' ){
      if (wx.getStorageSync('cardDetail').subtraction != 0 && wx.getStorageSync('cardDetail').subtraction != null && wx.getStorageSync('cardDetail').subtraction != '' ){
        payable = parseFloat(_this.data.totalPrice) - wx.getStorageSync('cardDetail').subtraction;
      }else{
        payable = parseFloat(_this.data.totalPrice) * wx.getStorageSync('cardDetail').discount;
      }
    }else{
        payable = parseFloat(_this.data.totalPrice);
    }
    if ( !first ){
      _this.setData({
        label:'',
      })
    }
    _this.setData({
      userNum: _used,
      payable: payable.toFixed(2),
    })
  },
  getHairCouponList(){
    const _this = this;
    let para={
      userId: user_id,
      version: version
    };
    util.get(`${getHairCouponList}`,para).then(res=>{
      if( res.code == 0 ){
        _this.setData({
          cardList:res.info.resultList
        },()=>{
          _this.cardNumFns();
        });
      }else{
        uploadErrorInfoFn(`${getHairCouponListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    }).catch(e=>{
      uploadErrorInfoFn(`${getHairCouponListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
    })
  },
  onShow(){
    const _this = this;
    first = true;
    if (wx.getStorageSync('cardDetail') != '') {
      let storage = wx.getStorageSync('cardDetail');
      let j = storage.subtraction == '' ? _this.data.totalPrice * storage.discount : _this.data.totalPrice - storage.subtraction;
      _this.setData({
        payable: j.toFixed(2),
        label: storage.couponLabel,            
      });
    }
  },
  onHide(){
    wx.removeStorageSync('cardDetail');
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    if (options.goodscode === "H0001|C0001" ){
      _this.setData({
        // label: options.label,
        num:5,
        name: options.name,
        name_label: options.label,
        goodscode: options.goodscode,
        nowprice: options.nowprice,
        totalPrice: options.nowprice * 5
      }, () => {
        _this.getHairCouponList();
      })
    }else{
      _this.setData({
        // label: options.label,
        name: options.name,
        name_label: options.label,
        goodscode: options.goodscode,
        nowprice: options.nowprice,
        totalPrice: options.nowprice * _this.data.num
      }, () => {
        _this.getHairCouponList();
      })
    }

  },
  paying(orderNo) {
    const _this = this;
    _this.data.setInter = setInterval(function () {
      _this.getPayOrderStatus(orderNo);
    }, 1000);
  },
  getPayOrderStatus(orderNo) {
    let getCurrentPagess = getCurrentPages();
    const _this = this;
    let para={
      orderNo: orderNo
    }
    util.get(`${getPayOrderStatus}`,para).then(res => {
      if( res.code == 0 ){
        if (res.info != null && res.info != '' && res.info != undefined  ){
          if( res.info.status == 3 ){
            wx.showToast({
              title: '购买成功',
              icon: 'none'
            })
            setTimeout(function () {
              if (getCurrentPagess[1].route == 'other_pages/card/card') {
                wx.switchTab({
                  url: '../../pages/user/user',
                })
              } else {
                wx.navigateBack({
                  delta: 2
                })
              }
            }, 1500);
            clearInterval(_this.data.setInter);
            _this.setData({
              setInter: ''
            });
          }
        }
      }else{
        uploadErrorInfoFn(`${getPayOrderStatusTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        wx.showToast({
          title: '交易失败',
          icon: 'none'
        })
        paying = true;
        clearInterval(_this.data.setInter);
        _this.setData({
          setInter: ''
        });
      }
    }).catch(e => {
      uploadErrorInfoFn(`${getPayOrderStatusTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      wx.showToast({
        title: '交易失败',
        icon: 'none'
      })
      paying = true;
      clearInterval(_this.data.setInter);
      _this.setData({
        setInter: ''
      });
    })
  },
  btn(e) {
    if( paying && this.data.num != 0 && this.data.num != '' ){
      let getCurrentPagess =getCurrentPages();
      paying = false;
      const { name, nowprice, code } = e.currentTarget.dataset;
      const _this = this;
      wx.login({
        success(res) {
          let para = {
            pageId: 'P00001',
            smallprogramNo: 3,
            organizationNo: 1,
            code: res.code,
            userId: wx.getStorageSync('userInfo').userId,
            goodsCode: _this.data.goodscode,
            name: _this.data.name,
            orderOrigin: 1,
            amount: _this.data.num,
            price: _this.data.nowprice,
            tradeType: 'JSAPI',
            amountOfMoney: _this.data.num * _this.data.nowprice
          }
          console.log(cardInfo)
          if( wx.getStorageSync('cardDetail') != '' ){
            let _getStorageSync = wx.getStorageSync('cardDetail')
            para['couponNo'] = _getStorageSync.no;
            para['couponId'] = _getStorageSync.couponId;
            para['type'] = _getStorageSync.subtraction == '' || _getStorageSync.subtraction == null ? '1':'2';
            if (_getStorageSync.subtraction == '' || _getStorageSync.subtraction == null ){
              para['discount'] = _getStorageSync.discount;
            }else{
              para['subtraction'] = _getStorageSync.subtraction;
            };
            para['amountOfMoneyForCoupon'] = _getStorageSync.amountOfMoney;
            para['amountOfMoneyReal'] = _this.data.payable;
          }else if( cardInfo != '' && wx.getStorageSync('cardDetail') == '' ){
            let jsonCardInfo =  Object.keys(cardInfo);
            if( jsonCardInfo.length  != 0 ){
              let _getStorageSync = cardInfo;
              para['couponNo'] = _getStorageSync.no;
              para['couponId'] = _getStorageSync.couponId;
              para['type'] = _getStorageSync.subtraction == '' || _getStorageSync.subtraction == null ? '1' : '2';
              if (_getStorageSync.subtraction == '' || _getStorageSync.subtraction == null) {
                para['discount'] = _getStorageSync.discount;
              } else {
                para['subtraction'] = _getStorageSync.subtraction;
              };
              para['amountOfMoneyForCoupon'] = _getStorageSync.amountOfMoney;
              para['amountOfMoneyReal'] = _this.data.payable;
            }
          }
          if (parseFloat(para.amountOfMoney) > 50000 || parseFloat(para.amountOfMoney) < 0 || para.amount.toString().indexOf('.')  != -1){
            paying = true;
            wx.showToast({
              title: '数量超出范围',
              icon:'none',
              mask:true
            })
            return false;
          }
          util.post(`${getWechatPrePayOrder}`, para).then(ress => {
            if( ress.code == 0 ){
              wx.removeStorageSync('cardDetail');
              if (ress.info == null ){
                wx.showToast({
                  title: '购买成功',
                  icon: 'none'
                })
                setTimeout(function () {
                 
                  if (getCurrentPagess[1].route == 'other_pages/card/card' ){
                    wx.switchTab({
                      url: '../../pages/user/user',
                    })
                  }else{
                    wx.navigateBack({
                      delta: 2
                    })
                  }
                }, 1500);
              }else{
                let pay_data = ress.info.prepayInfo;
                wx.requestPayment({
                  timeStamp: pay_data.timeStamp,
                  nonceStr: pay_data.nonceStr,
                  package: pay_data.package1,
                  signType: 'MD5',
                  paySign: pay_data.paySign,
                  success(payres) {
                    _this.paying(ress.info.prepayInfo.orderNo);
                  },
                  fail(se) {
                    paying = true;
                  }
                })
              }
            }else{
              paying = true;
              uploadErrorInfoFn(`${getWechatPrePayOrderTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(ress)}`);
							let title = "系统通知";
							let notice = "出错啦";
							wx.navigateTo({
							  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
							})
						}
          }).catch(e => {
            uploadErrorInfoFn(`${getWechatPrePayOrderTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
            paying = true;
						let title = "系统通知";
						let notice = "出错啦";
						wx.navigateTo({
						  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
						})
					})
        },
      })
    };
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