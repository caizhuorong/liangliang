// pages/Lottery/Lottery.js
const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const organizationNo = require('../../config.js').organizationNo;
const util = require('../../utils/util.js');
import {
  getUrl,
  baseShare,
  delNull,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
import {
  version,
  updateUserTelephone,
  updateUserTelephoneTitle,
  getRafflePrizeInfo,
  getRafflePrizeInfoTitle,
  getInviteFriendCountList,
  getInviteFriendCountListTitle,
  setRaffle,
  setRaffleTitle,
  getRaffleInfoByUserId,
  getRaffleInfoByUserIdTitle,
  nonspecificSharePage,
} from '../../config.js';
Page({
  data: {
    last_index: 0,//上一回滚动的位置
    amplification_index: 0,//轮盘的当前滚动位置
    roll_flag: true,//是否允许滚动
    max_number: 8,//轮盘的全部数量
    speed: 100,//速度，速度值越大，则越慢 初始化为300
    finalindex: 5,//最终的奖励
    myInterval: "",//定时器
    max_speed: 40,//滚盘的最大速度
    minturns: 8,//最小的圈数为2
    runs_now: 0,//当前已跑步数
    min_height:0,
    showDialogs:false,
    raffleNum:0,
    friendNum:0,
    lstAllRaffleSelfName:'',
    lstAllRaffleSelfLength:[0,0,0,0,0,0,0],
    currentTab: 1,
    rafflePrize:[],
    friend:[],
    raffleType:false,
    lstAllRaffle:[],
    marqueePace: 1,//文字滚动速度，建议为1。数值越大，滚动越快
    interval: 20,// 时间间隔。数值越大，滚动越慢
    marqueeDistance: 0,//初始滚动距离。
    userInfo:wx.getStorageSync('userInfo'),
    fs:0,
    lstAllRaffleSelf:[],
    myinfo:{},
    ran_list:[],
    layerType:true,
    layer_text:'',
  },
  cope(e){
    wx.setClipboardData({
      data:'量量看',
      success(res){
        console.log(res);
      },
    })
  },
  getInviteFriendCountList(curr){
    const _this = this;
    let para = {
      userId: wx.getStorageSync('userInfo').userId,
      version: version,
      activeId: 'RA20181224001'
    }
    util.get(`${getInviteFriendCountList}`,para).then(res=>{
      if( res.code == 0 ){
        let myinfo = {
          rewarCount:0,
          userNick: delNull(wx.getStorageSync('userInfo').showNick),
          img: wx.getStorageSync('userInfo').personIcon,
        };
        if (res.info.inviteFriendCountSelf != null  ){
          myinfo.rewarCount = res.info.inviteFriendCountSelf.rewarCount;
          myinfo.no = res.info.inviteFriendCountSelf.no;
        }else{

        }
        let ran_list = [];
        res.info.invitedUserCountList.forEach(function(x,y){
          ran_list.push({
            no: x.no,
            userNick: x.userNick,
            rewarCount: x.rewarCount
          })
        })
        _this.setData({
          myinfo: myinfo,
          ran_list: ran_list,
          currentTab: curr
        })
        wx.hideLoading();
      }else{
        uploadErrorInfoFn(`${getInviteFriendCountListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        var title = "系统通知";
        var notice = "系统维护中";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    }).catch(error=>{
      uploadErrorInfoFn(`${getInviteFriendCountListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      var title = "系统通知";
      var notice = "系统维护中";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  getRaffleInfoByUserId(curr){
    const _this = this;
    let para={
      userId: wx.getStorageSync('userInfo').userId,
      version: version,
      activeId: 'RA20181224001'
    }
    util.get(`${getRaffleInfoByUserId}`,para).then(res=>{
      if( res.code == 0 ){
        let lstAllRaffleSelf = [];
        let lstAllRaffleSelfName = '';
        let length = [0,0,0,0,0,0,0];
        if (delNull(res.info.lstAllRaffleSelf.length) != '' ){
          res.info.lstAllRaffleSelf.forEach(function (x, y) {
            lstAllRaffleSelf.push({
              prizeId: x.prizeId
            })
            if (x.prizeId == 'RA20181224001_001' ){
              length[0] = length[0] + 1;
            } else if (x.prizeId == 'RA20181224001_002' ){
              length[1] = length[1] + 1;
            } else if (x.prizeId == 'RA20181224001_003') {
              length[2] = length[2] + 1;
            } else if (x.prizeId == 'RA20181224001_004') {
              length[3] = length[3] + 1;
            } else if (x.prizeId == 'RA20181224001_005') {
              length[4] = length[4] + 1;
            } else if (x.prizeId == 'RA20181224001_006') {
              length[5] = length[5] + 1;
            } else if (x.prizeId == 'RA20181224001_007') {
              length[6] = length[6] + 1;
            } else if (x.prizeId == 'RA20181224001_008') {
              length[7] = length[7] + 1;
            }
          })
          lstAllRaffleSelfName = wx.getStorageSync('userInfo').showNick;
        }else{

        }
        _this.setData({
          lstAllRaffleSelf: lstAllRaffleSelf,
          lstAllRaffleSelfName: lstAllRaffleSelfName,
          lstAllRaffleSelfLength:length,
          currentTab: curr,
        },()=>{
          wx.hideLoading();
          _this.setFontSize();
        })
        
      }else{
        uploadErrorInfoFn(`${getRaffleInfoByUserIdTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        var title = "系统通知";
        var notice = "系统维护中";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    }).catch(error=>{
      uploadErrorInfoFn(`${getRaffleInfoByUserIdTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      var title = "系统通知";
      var notice = "系统维护中";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  setFontSize() {
    let w = 550;
    let fLength = this.data.lstAllRaffleSelfName.toString().length+8;
    this.setData({
      fs: w / fLength
    })
  },
  getRafflePrizeInfo(curr,cjtype){
    const _this = this;
    let para={
      userId:wx.getStorageSync('userInfo').userId,
      version: version,
      activeId: 'RA20181224001'
    };
    util.get(`${getRafflePrizeInfo}`,para).then(res=>{
      if( res.code == 0  ){
        let raffleType = false;
        let raffleNum = 0;
        let friendNum = 0;
        if (res.info.friend.invitationList != undefined ){
          if (res.info.raffleCount < res.info.remainCount && parseInt(res.info.friend.invitationList.length / needInvitedFriends) > res.info.raffleCount) {
          if (res.info.raffleCount < res.info.remainCount && parseInt(res.info.friend.invitationList.length / 3) > res.info.raffleCount) {
            raffleType = true;
            raffleNum = res.info.remainCount - res.info.raffleCount > parseInt(res.info.friend.invitationList.length / needInvitedFriends) - res.info.raffleCount ? parseInt(res.info.friend.invitationList.length / needInvitedFriends) - res.info.raffleCount : res.info.remainCount - res.info.raffleCount;
          } else {
            friendNum = needInvitedFriends - parseInt(res.info.friend.invitationList.length) % needInvitedFriends;
          }
        }
        if (cjtype != 1 ){
         _this.setData({
           rafflePrize: res.info.rafflePrize,
         })
        };
        _this.setData({
          friend: res.info.friend.invitationList == undefined ? [] : res.info.friend.invitationList,
          lstAllRaffle: res.info.lstAllRaffle,
          raffleType: raffleType,
          raffleNum: raffleNum,
        },()=>{
          wx.hideLoading();
        })
      }else{
          uploadErrorInfoFn(`${getRafflePrizeInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        var title = "系统通知";
        var notice = "系统维护中";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    }
  }).catch(error=>{
    uploadErrorInfoFn(`${getRafflePrizeInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
    var title = "系统通知";
    var notice = "系统维护中";
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })
    wx.hideLoading();
    return;
  })
},
closeLayer(){
  this.setData({
    layerType:true
  })
},
  //开始滚动
  startrolling: function () {
    if (!this.data.raffleType ){
      wx.showToast({
        title: `再邀请${this.data.friendNum}人即可获得抽奖机会`,
        icon:'none'
      })
      return false;
    }
    if (wx.getStorageSync('userInfo').mobile == null || wx.getStorageSync('userInfo').mobile == '') {
      this.setData({
        showDialogs: true,
      })
      return false;
    }
    let _this = this;
    //初始化步数
    _this.data.runs_now = 0;
    //当前可以点击的状态下
    if (_this.data.roll_flag) {
      _this.data.roll_flag = false;
      //启动滚盘，注，若是最终后台无返回就不好意思里
      let para = {
        userId:wx.getStorageSync('userInfo').userId,
        version: version,
        activeId: 'RA20181224001'
      };
      let _index = 0;
      util.post(`${setRaffle}`,para).then(res=>{
        if( res.code == 0 ){
          _this.data.rafflePrize.forEach(function(x,y){
            if (x.prizeId == res.info.prize.prizeId ){
              _index = y+2;
            }
          })
          _index = _index - _this.data.amplification_index + 8;
          _index %= 8;
          _this.setData({
            finalindex: _index %= 8,
            layer_text: res.info.prize.name,
          },()=>{
            _this.rolling();
          })
        }else{ 
          uploadErrorInfoFn(`${setRaffleTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          var title = "系统通知";
          var notice = "系统维护中";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      }).catch(error=>{
        uploadErrorInfoFn(`${setRaffleTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        var title = "系统通知";
        var notice = "系统维护中";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      })
      
    }
  },

    getPhoneNumber(e){
      console.log(e);
      //当用户点击允许用户获取用户信息之后返回用户信息
      var that = this;
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        //用户按了允许授权按钮
        let _systeminfo_data = wx.getSystemInfoSync();
        wx.checkSession({
          success:function(re){
                var para = {
                  smallprogramNo: smallProgramNo,
                  organizationNo: organizationNo,
                  ivForTel: e.detail.iv,
                  encryptedDataForTel: e.detail.encryptedData,
                  version: version,
                  userId: wx.getStorageSync('userInfo').userId
                }
								util.post(`${updateUserTelephone}`,para).then(res=>{
									console.log(res);
									var code = res.code;
									if (code == 0) {
									  let _userinfo = wx.getStorageSync('userInfo');
									  console.log(_userinfo.telephone)
									  _userinfo.mobile = delNull(res.info.pureMobile) == '' ? res.info.mobile : res.info.mobile;
									  wx.setStorageSync('userInfo', _userinfo);
									  that.setData({
									    showDialogs: false,
									  });
									  wx.hideLoading();
									} else {
                    uploadErrorInfoFn(`${updateUserTelephoneTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
									  var title = "系统通知";
									  var notice = "系统维护中";
									  wx.navigateTo({
									    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
									  })
									  wx.hideLoading();
									  return;
									}
								}).catch(error=>{
                  uploadErrorInfoFn(`${updateUserTelephoneTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
									var title = "系统通知";
									var notice = "系统维护中";
									wx.navigateTo({
									  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
									})
									wx.hideLoading();
									return;
								})
   
          },
          fail:function(){
            console.log('失败');
            // 登录,获取code
            wx.login({
              success: res => {
                var code = res.code;
                that.setData({
                  angle_code: code
                })
                var para = {
                  smallprogramNo: smallProgramNo,
                  organizationNo: organizationNo,
                  code: code,
                  ivForTel: e.detail.iv,
                  encryptedDataForTel: e.detail.encryptedData,
                  version: version,
                  userId: wx.getStorageSync('userInfo').userId
                }
                //发送code，encryptedData，iv到后台解码，获取用户信息
								util.post(`${updateUserTelephone}`,para).then(res=>{
									var code = res.code;
									if (code == 0) {
									  let _userinfo = wx.getStorageSync('userInfo');
									  _userinfo.mobile = delNull(res.info.pureMobile) == '' ? res.info.mobile : res.info.mobile;
									  wx.setStorageSync('userInfo', _userinfo);
									  that.setData({
									    showDialogs: false,
									  });
									  wx.hideLoading();
									} else {
                    uploadErrorInfoFn(`${updateUserTelephoneTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
									  var title = "系统通知";
									  var notice = "系统维护中";
									  wx.navigateTo({
									    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
									  })
									  wx.hideLoading();
									  return;
									}
								}).catch(error=>{
                  uploadErrorInfoFn(`${updateUserTelephoneTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
									var title = "系统通知";
									var notice = "系统维护中";
									wx.navigateTo({
									  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
									})
									wx.hideLoading();
									return;
								})
              },
              fail: function () {
                var title = "系统通知";
                var notice = "系统维护中";
                wx.navigateTo({
                  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                })
                wx.hideLoading();
                return;
              }
            })
          }
        })
        
      } else {
        //用户按了拒绝按钮
        that.setData({
          showDialog: true
        });
      }
    },
  
  onShow: function () {
    user_id = wx.getStorageSync('userInfo').userId
    this.data.min_height = getApp().globalData.deviceHeight;
    this.setData(this.data);
    var vm = this;
    wx.showLoading({
      title: '加载中',
      icon:'none'
    })
    this.getRafflePrizeInfo(1);
    //
  },
  //滚动轮盘的动画效果
  rolling: function (amplification_index) {
    var _this = this;
    this.data.myInterval = setTimeout(function () { _this.rolling(); }, this.data.speed);
    this.data.runs_now++;//已经跑步数加一
    this.data.amplification_index++;//当前的加一
    //获取总步数，接口延迟问题，所以最后还是设置成1s以上
    var count_num = this.data.minturns * this.data.max_number + this.data.finalindex - this.data.last_index;
    //上升期间
    if (this.data.runs_now <= (count_num / 3) * 2) {
      this.data.speed -= 30;//加速
      if (this.data.speed <= this.data.max_speed) {
        this.data.speed = this.data.max_speed;//最高速度为40；
      }
    }
    //抽奖结束
    else if (this.data.runs_now >= count_num) {
      clearInterval(this.data.myInterval);
      this.data.roll_flag = true;
      this.setData({
        layerType: false,
      },()=>{
        _this.getRafflePrizeInfo(1,1);
      })
    }
    //下降期间
    else if (count_num - this.data.runs_now <= 10) {
      this.data.speed += 20;
    }
    //缓冲区间
    else {
      this.data.speed += 10;
      if (this.data.speed >= 100) {
        this.data.speed = 100;//最低速度为100；
      }
    }
    if (this.data.amplification_index > this.data.max_number) {//判定！是否大于最大数
      this.data.amplification_index = 1;
    }
    this.setData(this.data);
  },
  swiperTab: function (e) {
    console.log(1);
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    if (e.detail.current == 0) {
      that.getRaffleInfoByUserId(e.detail.current);
    } else if (e.detail.current == 1) {
      that.getRafflePrizeInfo(e.detail.current);
    } else {
      that.getInviteFriendCountList(e.detail.current);
    }
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      console.log(e.target.dataset.current);
      if (e.target.dataset.current == 0 ){
        that.getRafflePrizeInfo(0, 1);
      } else if (e.target.dataset.current == 1 ){
        that.getRafflePrizeInfo(1, 1);
      }else{
        that.getRafflePrizeInfo(2, 1);
      }
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onShareAppMessage: function () {
    const _this = this;
    wx.showShareMenu({
      withShareTicket: false
    });
    baseShare(_this);
    var shareObj = {
      title: '快来和我一起把戴森吹风机领回家。',
      title: '百分百中奖！3千元的戴森吹风机等你来抽',
      desc: '拍照就能造型，为你量身打造适合你的发型',
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl: 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/active20181224/active_active20181224_share_new.png',
      success: function (res) { // 转发成功之后的回调
        console.log(res);
      },
      fail(e) {
        console.log(e);
      },
      complete(c) {
        console.log(c)
      }
    }
    return shareObj;
  },
})









