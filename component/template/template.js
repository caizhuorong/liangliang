//初始化数据
const getLastFaceSwap = require('../../config.js').getLastFaceSwap;
const util = require('../../utils/util.js');
const version = require('../../config.js').version;
let user_id;
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "/pages/index/index",
      "iconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_10.png",
      "selectedIconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_11.png",
    },
    {
      "current": 1,
      "pagePath": "/pages/square/square",
      "iconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_12.png",
      "selectedIconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_13.png",

    },
    {
      "current": 2,
      "pagePath": "/pages/heart_design/heart_design",
      "iconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_14.png",
      "selectedIconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_15.png",
    },
    {
      "current": 3,
      "pagePath": "/pages/user/user",
      "iconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_16.png",
      "selectedIconPath": "https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/new_icon_17.png",
    }
  ]
}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
  user_id = wx.getStorageSync('userInfo').userId;
  let para={
    userId: user_id,
    version: version
  }
  util.get(`${getLastFaceSwap}`,para).then(res=>{
    if( res.code == 0 ){
      wx.setStorageSync('faceinfo', res.info);
    }else{

    }
  }).catch(error=>{
    console.log(error);
  })
}
module.exports = {
  tabbar: tabbarmain
}
