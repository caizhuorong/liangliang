// pages/heart_detail/hear_detail.js
const app = getApp();
const version = require('../../config.js').version;
const user_id = require('../../config.js').user_id;
const selectHairStyleInfo = require('../../config.js').selectHairStyleInfo;
const addFollow = require('../../config.js').addFollow;
const deleteFollow = require('../../config.js').deleteFollow;
const addFavorite = require('../../config.js').addFavorite;
const deleteFavorite = require('../../config.js').deleteFavorite;
const addPraise = require('../../config.js').addPraise;
const deletePraise = require('../../config.js').deletePraise;
const claimHair = require('../../config.js').claimHair;
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    zg_type:true,
    curret:0,
    follow_type:true,
    zan_type:true,
    info:{},
    content_imgs:[],
    labels:[],
    follow_list: [
      {
        stuat: true,
        img_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537868046219&di=eb3650c0d278c4ad07c9472530ddcded&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F728da9773912b31b794ecb378b18367adab4e18a.jpg',
        name: 'nfadassfda',
        label: '123dsfsdfs',
      },
      {
        stuat: true,
        img_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537868046219&di=eb3650c0d278c4ad07c9472530ddcded&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F728da9773912b31b794ecb378b18367adab4e18a.jpg',
        name: 'nfadassfda123dsfsdfs123dsfsdfs123dsfsdfs123dsfsdfs123dsfsdfs123dsfsdfs123dsfsdfs123dsfsdfs',
        label: '123dsfsdfs',
      },
      {
        stuat: false,
        img_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537868046219&di=eb3650c0d278c4ad07c9472530ddcded&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F728da9773912b31b794ecb378b18367adab4e18a.jpg',
        name: 'nfadassfda',
        label: '123dsfsdfs',
      },
      {
        stuat: true,
        img_url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1537868046219&di=eb3650c0d278c4ad07c9472530ddcded&imgtype=0&src=http%3A%2F%2Fb.hiphotos.baidu.com%2Fimage%2Fpic%2Fitem%2F728da9773912b31b794ecb378b18367adab4e18a.jpg',
        name: 'nfadassfda',
        label: '123dsfsdfs',
      }
    ],
    note: [
      {
        name: '大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼大脸猫爱吃鱼',
        heart_num: '1',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '212312',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '3',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }, {
        name: '大脸猫爱吃鱼',
        heart_num: '4',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '5',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://f10.baidu.com/it/u=121654667,1482133440&fm=72',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '6',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img3.imgtn.bdimg.com/it/u=1417732605,3777474040&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      },
      {
        name: '大脸猫爱吃鱼',
        heart_num: '7',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img4.imgtn.bdimg.com/it/u=2748975304,2710656664&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }, {
        name: '大脸猫爱吃鱼',
        heart_num: '8',
        title: '你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识你所不知道的红酒知识',
        url: 'http://img2.imgtn.bdimg.com/it/u=1561660534,130168102&fm=26&gp=0.jpg',
        avatar: 'http://img4.imgtn.bdimg.com/it/u=349345436,3394162868&fm=26&gp=0.jpg'
      }
    ],
    no:0,
    isTemplate:0,//1,发型 0，作品
    uploadtime:0,
    content:'',
    favoriteId:0,
    praiseId:0,
  },
  //判断是否今天或者昨天
  time(data){
    var date = data;
    var year = date.substring(0, 4);
    var month = date.substring(5, 7); 
    var day = date.substring(8, 10); 
    var hour = date.substring(11, 13); 
    var minute = date.substring(14, 16);
    var scord = date.substring(17,19); 
    var createTime = data; 
    var date3 = this.GetDateStr(-1);
    //昨天   
    var str3=date3.split("-");   
    str3[1]=str3[1].length == 1 ? '0'+str3[1]:str3[1];   
    str3[2]=str3[2].length == 1 ? '0'+str3[2]:str3[2];     
   
    var date0 = this.GetDateStr(0);
    //今天   
    var str0=date0.split("-");   
    str0[1]=str0[1].length == 1 ? '0'+str0[1]:str0[1];   
    str0[2]=str0[2].length == 1 ? '0'+str0[2]:str0[2];   
    if(year == str3[0] && month == str3[1] && day == str3[2]){
      return "昨天"+ " "+hour+":"+minute   
    }else if(year == str0[0] && month == str0[1] && day == str0[2]){
      return "今天"+ " "+hour+":"+minute   
    }else{
      return createTime;
    }
  
  },
  GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);
    //获取AddDayCount天后的日期 
    var y = dd.getFullYear(); 
    var m = dd.getMonth()+1;
    //获取当前月份的日期 
    var d = dd.getDate();
    return y+"-"+m+"-"+d; 
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    const _this = this;
    // let userid = options.userid;
    let userid = 1;
    _this.setData({
      no: userid,
      isTemplate: options.isTemplate
    })
    wx.request({
      url: selectHairStyleInfo, //仅为示例，并非真实的接口地址
      method: 'get',
      data: {
        userId: user_id,
        version: version,
        no: userid,
        isTemplate:options.isTemplate
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res);
        let _data = _this.data.info;
        let data = res.data.info;
        if( res.data.code == 0 ){
          let content_imgs = [];
          data.relatedUserStylistResps.forEach(function(x,y){
            content_imgs.push(x.personIcon);
          })
          let dates = _this.time(data.sHairInfo.updateTime);
          _this.setData({
            info: data,
            uploadtime: dates,
            content: data.sHairInfo.synopsis,
            content_imgs: content_imgs,
            favoriteId: data.favoriteId,
            praiseId: data.praiseId,
            zg_type: data.thisStylist.isFollowed == 1 ? false:true,
            zan_type: data.praiseId != null ? false:true,
            follow_type: data.favoriteId != null ? false:true,
            labels: data.sHairTags  
          })
        }else{
          wx.showToast({
            icon:'none',
            title:res.data.message
          })
        }  
        wx.hideLoading();
      },
      fail(error) {
        console.log(error);
        let title = "系统通知";
        let notice = res.message;
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    });
  },
  followfn:function(){
    const _this = this;
    if (_this.data.follow_type) {
      wx.request({
        url: addFavorite + '?userId=' + user_id + '&version=' + version + '&no=' + _this.data.no + '&isTemplate=' + _this.data.isTemplate,
        method: 'post',
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          wx.hideLoading();
          let _data = _this.data.info;
          let data = res.data.info;
          if (res.data.code == 0) {
            _this.setData({
              follow_type: !_this.data.follow_type
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message
            })
          }
        },
        fail(error) {
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      });
    } else {
      wx.request({
        url: deleteFavorite + '?userId=' + user_id + '&version=' + version + '&favoriteNo=' + _this.data.favoriteId + '&isTemplate=' + _this.data.isTemplate,
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();
          let _data = _this.data.info;
          let data = res.data.info;
          if (res.data.code == 0) {
            _this.setData({
              follow_type: !_this.data.follow_type
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message
            })
          }
        },
        fail(error) {
          console.log(error);
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      });
    }
  },
  ican(){
    const _this = this;
    wx.request({
      url: claimHair + '?userId=' + user_id + '&version=' + version + '&no=' + _this.data.no + '&isTemplate=' + _this.data.isTemplate ,
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res);
        wx.hideLoading();
        let _data = _this.data.info;
        let data = res.data.info;
        console.log('在此处把自己的头像加入设计师列表')
      },
      fail(error) {
        let title = "系统通知";
        let notice = res.message;
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    });
  },
  zanfn: function () {
    const _this = this;
    if (_this.data.zan_type) {
      wx.request({
        url: addPraise + '?userId=' + user_id + '&version=' + version + '&no=' + _this.data.no + '&isTemplate=' + _this.data.isTemplate,
        method: 'post',
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          wx.hideLoading();
          let _data = _this.data.info;
          let data = res.data.info;
          if (res.data.code == 0) {
            _this.setData({
              zan_type: !_this.data.zan_type
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message
            })
          }
        },
        fail(error) {
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      });
    } else {
      wx.request({
        url: deletePraise + '?userId=' + user_id + '&version=' + version + '&no=' + _this.data.no + '&isTemplate=' + _this.data.isTemplate,
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();
          let _data = _this.data.info;
          let data = res.data.info;
          if (res.data.code == 0) {
            _this.setData({
              zan_type: !_this.data.zan_type
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message
            })
          }
        },
        fail(error) {
          console.log(error);
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      });
    }
  },
  followType(){
    const _this = this;
    if (_this.data.zg_type ){
      wx.request({
        url: addFollow + '?userId=' + user_id + '&version=' + version + '&stylistId=' + _this.data.info.thisStylist.userId, //仅为示例，并非真实的接口地址
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();
          let _data = _this.data.info;
          let data = res.data.info;
          if (res.data.code == 0) {
            _this.setData({
              zg_type: !_this.data.zg_type
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message
            })
          }
         
        },
        fail(error) {
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      });
    }else{
      wx.request({
        url: deleteFollow + '?userId=' + user_id + '&version=' + version + '&stylistId=' + _this.data.info.thisStylist.userId,
        method: 'post',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          wx.hideLoading();
          let _data = _this.data.info;
          let data = res.data.info;
          if (res.data.code == 0) {
            _this.setData({
              zg_type: !_this.data.zg_type
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: res.data.message
            })
          }
         
        },
        fail(error) {
          console.log(error);
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  goTotakephoto(){
    wx.navigateTo({
      url: '../../other_pages/takephoto/takephoto',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  changeSwiper:function(e){
    this.setData({
      curret:e.detail.current
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})