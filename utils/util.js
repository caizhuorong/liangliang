const smallProgramNo = require('../config.js').smallProgramNo;
const organizationNo = require('../config.js').organizationNo;
const insertShareInfo = require('../config.js').insertShareInfo;
import { uploadErrorInfo, version} from '../config.js';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
const formatTimes = (number, format) => {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const numto = num => {
  if (num.length == 4) {
    num = num/1000;
    num = num.toFixed(2);
    num = num + 'k';
    return num;
  } else if (num.length == 5) {
    num = num/10000;
    num = num.toFixed(2);
    num = num + 'w';
    return num;
  }else{
    return num;
  }
}

//formId上传
const formIdPost = (saveFormId,formId, user_id, version, smallProgramNo)=>{
  let para = {
    userId: user_id,
    version: version,
    smallprogramNo: smallProgramNo,
    formId:formId,
    pagePath:getUrlIndex(),
  }
  wx.request({
    url: saveFormId,
    header:{
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: 'post',
    data: para,
    success(res){
    },
    fail(){}
  })

}
const mathRandom = (shareTitle) =>{
   return Math.round(Math.random() * shareTitle.length - 1);
}
function getUrlIndex  (){
  let  pages = getCurrentPages() //获取加载的页面
  let  currentPage = pages[pages.length - 1]; //获取当前页面的对象
  let  url = currentPage.route; //当前页面url
  return url;
}
const formatLocation = (longitude, latitude) => {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }
  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)
  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
function baseShares(res){
  var shareTickets = res.shareTickets;
  let scene = getUrlIndex();
  if (shareTickets == undefined) {
    wx.request({
      url: insertShareInfo,
      data: {
        'userId': wx.getStorageSync('userInfo').userId,
        'smallprogramNo': smallProgramNo,
        'organizationNo': organizationNo,
        'scene': scene,
      },
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
      }
    })
  } else {
    wx.getShareInfo({
      shareTicket: shareTickets[0],
      success: function (res) {
        var encryptedDataForShare = res.encryptedData;
        var ivForShare = res.iv;
        wx.login({
          success: function (res) {
            var code = res.code;
            wx.request({
              url: insertShareInfo,
              data: {
                'code': code,
                'encryptedDataForShare': encryptedDataForShare,
                "ivForShare": ivForShare,
                'userId': wx.getStorageSync('userInfo').userId,
                'smallprogramNo': smallProgramNo,
                'organizationNo': organizationNo,
                'scene': scene
              },
              method: 'post',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              success: function (res) {
              }
            })
          }
        })
      }
    })
  };
}

function isEmpty(obj){
  let isEmptys = true;
  if (obj != undefined && obj != null && obj != ''  ){
    isEmptys = false;
  }else{
    isEmptys = true;
  }
  return isEmptys;
}
function baseShare (_this,type){
  let scene = getUrlIndex();
  wx.request({
    url: insertShareInfo,
    data: {
      'userId': wx.getStorageSync('userInfo').userId,
      'smallprogramNo': smallProgramNo,
      'organizationNo': organizationNo,
      'scene': scene,
			'pagePath':getUrlIndex()
    },
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if( res.data.code == 0 ){
        if (res.data.info.points != null ){
          let banner_url = res.data.info.points.points.background;
          let _show;
          if (wx.getStorageSync('shareLayer') == 1) {
            _show = false;
          } else {
            _show = true;
          }
          _this.setData({
            shareLayer: _show,
            layerBanner: `${banner_url}`,
            layerLabel: res.data.info.points.points.prompt,
            layerTips: res.data.info.points.points.points,
            code: res.data.info.points.points.code
          });
          if (type ){
            type();
          }
          
        }
      }else{
        
      }
    }
  })
}
function uploadErrorInfoFn(title,content) {
  let scene = getUrlIndex();
  wx.request({
    url: uploadErrorInfo,
    data: {
      'userId': wx.getStorageSync('userInfo').userId,
      'smallprogramNo': smallProgramNo,
      "version": version,
      'organizationNo': organizationNo,
      'pagePath': getUrlIndex(),
      'title':title,
      'content':content
    },
    method: 'post',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
     
    },
    fail(error){

    },
  })
}
function delNull (str){
  let strs = str; 
  if (strs == null || strs == undefined || strs == '' ){
    strs =''
  };
  return strs;
}
const http = ({ url = '', params = {}, ...other } = {}) => {
    params['pagePath'] = getUrlIndex();
  let time = Date.now()
    return new Promise((resolve, reject) => {
      wx.request({
        url: getUrl(url),
        data: params,
        ...other,
        complete: (res) => {
          wx.hideLoading()
          if (res.statusCode >= 200 && res.statusCode < 100000) {
            resolve(res.data)
          } else {
            reject(res)
            var title = "出错啦";
            var notice = "呀，网络出了问题";
            var btntitle = '重新连接网络';
            var imgurl = 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/network.png';
            var btnshow = true;
            wx.navigateTo({
              url: `../../pages/error/error?title=${title}&notice=${notice}&btntitle=${btntitle}&imgurl=${imgurl}&btnshow=${btnshow}`,
            })
          }
        },
        success(ress) {
        },
        fail(error) {
      
        }
      })
    })
}
//onLoad
const utilOnLoad = (options,_this)=>{
  if (options != undefined) {
    _this.setData({
      param: JSON.stringify(options)
    })
  }
  var scene = "";
  if (options && options.scene) {
    scene = decodeURIComponent(options.scene)
    app.globalData.scene = scene;
  }
  _this.setData({
    scene: scene,
  });
  if (wx.getStorageSync('userInfo').userId != undefined) {
    _this.setData({
      userId: wx.getStorageSync('userInfo').userId,
      // activeId: options.activeId,
      // url:options.url
    })
  }
}
//onShareAppMessage
const utilOnShareAppMessage = (_this) =>{
  let para = {
    userId: wx.getStorageSync('userInfo').userId,
    version: version,
  }
  if (!isEmpty(_this.data.share)) {
    let subjectMenu = _this.data.share.param;
    let url_param = '';
    for (var key in subjectMenu) {
      para[`${key}`] = subjectMenu[key];
    }
    if (_this.data.share.method == 'post') {
      util.post(`${_this.data.share.interface}`, para).then(res1 => {
        if (res1.code == 0) {
          wx.showModal({
            title: '提示',
            content: '领取成功',
            showCancel: false,
            confirmText: '我知道了',
            success() {
            }
          });
        } else {

        }
      }).catch(e => {
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      })
    } else {
      util.get(`${_this.data.share.interface}`, para).then(res1 => {
        if (res1.code == 0) {
          wx.showModal({
            title: '提示',
            content: '领取成功',
            showCancel: false,
            confirmText: '我知道了',
            success() {
            }
          });
        } else {

        }
      }).catch(e => {
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      })
    }
  }
}
//onMyEvent
const utilOnMyEvent = (e,_this)=>{
  _this.setData({
    sex: wx.getStorageSync('userInfo').sex
  })
}
//activelayer
const utilActiveLayer = (e,_this)=>{
  _this.setData({
    activeShow: true,
    activeInfo: e
  })
}
//giftlayer
const utilGiftLayer = (e,_this) =>{
  _this.setData({
    giftShow: true,
    giftLayerBanner: e.detail
  })
}
//points
const utilPoints = (e,_this) =>{
  if (delNull(e.detail.points.points.background) == '') {
    return false;
  }
  let banner_url = e.detail.points.points.background;
  let _show;
  if (wx.getStorageSync('signLayer') == 1) {
    _show = false;
  } else {
    _show = true;
  }
  _this.setData({
    shareLayer: _show,
    layerBanner: `${banner_url}`,
    layerLabel: e.detail.points.points.prompt,
    layerTips: e.detail.points.points.points,
    code: e.detail.points.points.code
  });
}
const queryString =  function queryString(name,url) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(url);
  if (results === null) {
    return "";
  } else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}
const getUrl = url => {
  if (url.indexOf('://') == -1) {
    url = url
  }
  return url
}
module.exports = {
  formatTime: formatTime,
  numto: numto,
  isEmpty: isEmpty,
  formatTimes: formatTimes,
  formatLocation: formatLocation,
  baseShare:baseShare,
  uploadErrorInfoFn: uploadErrorInfoFn,
	getUrl: getUrlIndex,
  queryString: queryString,
  delNull: delNull,
  formIdPost: formIdPost,
  utilGiftLayer: utilGiftLayer,
  utilPoints: utilPoints,
  utilActiveLayer: utilActiveLayer,
  utilOnMyEvent: utilOnMyEvent,
  utilOnLoad: utilOnLoad,
  mathRandom: mathRandom,
  get (url, params = {}) {
    return http({
      url,
      params
    })
  },
  post(url, params = {}) {
    return http({
      url,
      params,
      method: 'post',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
    })
  },
}
