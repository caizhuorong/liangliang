// pages/index/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    follow_type: false,
    sex_type:true,
    heat_info:{},
    head_img: [
      {
        name: '发色',
        type:false,
      },
      {
        name: '推荐',
        type: false,
      },
      {
        name: '热门',
        type: true,
      },
      {
        name: '最新',
        type: false,
      },
      {
        name: '长发',
        type: false,
      },
      {
        name: '小A老师',
        type: false,
      }
    ],
    bottom_scroll:false,
  },
  followfn: function () {
    this.setData({
      follow_type: !this.data.follow_type
    })
  },
  changSex(){
    this.setData({
      sex_type: !this.data.sex_type
    })
  },
  labelChange(e){
    let _data = this.data.head_img;
    _data.forEach(function(x,y){
      x.type = false
    });
    _data[e.currentTarget.dataset.index].type = true;
    this.setData({
      head_img:_data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    let _data = wx.getStorageSync('faceinfo');
    console.log(_data);
    _this.setData({
      heat_info:_data,
      sex_type: _data.sex == 0 ? true:false
    });

  },
  varilgun(e){
    console.log(e);
    if (e.detail.scrollTop > 4 ){
      this.setData({
        bottom_scroll:true,
      })
    }else{
      this.setData({
        bottom_scroll: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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