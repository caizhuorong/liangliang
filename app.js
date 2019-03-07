//app.js
var aldstat = require("./utils/ald-stat.js");
const login = require('./config.js').login;

const version = require('./config.js').version;
const receiveHairPoints = require('./config.js').receiveHairPoints;
const util = require('./utils/util.js');
let setTime = 0;
let setFn;
App({
  
  onLaunch: function (opss) {
    wx.hideTabBar();
    // 展示本地存储能力
    // 登录
    gobalData: {
      imgUrl: 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/'
    };
    wx.removeStorageSync('ops');
    wx.removeStorageSync('userInfo');
    wx.removeStorageSync('faceinfo');
    wx.removeStorageSync('active_tab');
    wx.removeStorageSync('templateNotice');
    wx.setStorageSync('ops', opss)
    this.globalData.userInfo = '';
  },
  onShow(){
    if (setTime < 300) {
      this.setTime();
    }
    wx.hideTabBar();
  },
  onHide(){
    clearInterval(setFn);
  },
  setTime(){
    const _this = this;
    if( setTime  < 300 ){
      setFn = setInterval(function () {
        _this.setFns();
      }, 1000);
    }
  },
  setFns(){
    setTime = setTime +1;
    if (setTime >= 300 ){
      clearInterval(setFn);
      if (wx.getStorageSync('userInfo') != '' ){
        let para = {
          pointsType: 'PT0007',
          version: version,
          userId: wx.getStorageSync('userInfo').userId,
        }
        util.post(`${receiveHairPoints}`, para).then(res=>{
          if (res.code == 0 && res.info.lstPoints != null && res.info.lstPoints.length != 0  ){
            wx.showToast({
              title: `${res.info.lstPoints[0].points.prompt},恭喜你获得${res.info.lstPoints[0].points.points}积分`,
              icon:'none'
            })
          }
        }).catch(e=>{

        })
      }
    
    }
  },
  onError(Error){
    console.log(Error);
    let title = "系统通知";
    let notice = "出错啦";
    wx.navigateTo({
      url: './other_pages/error/error?title=' + title + "&notice=" + notice,
    })
  },
  globalData: {
    userInfo: null,
    deviceWidth: "",
    deviceHeight: "",
    scene:0,
    sceneSystem:'',
  },
})