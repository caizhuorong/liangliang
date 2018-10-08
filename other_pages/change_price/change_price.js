// pages/change_like/change_like.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1:0,
    value2: 0,
    value3: 0,
    value4: 0,
    value5: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  input1(e){
    
    this.setData({
      value1:e.detail.value
    })
  },
  input2(e){
    this.setData({
      value2: e.detail.value
    })
  },
  input3(e){
    this.setData({
      value3: e.detail.value
    })
  },
  input4(e){
    this.setData({
      value4: e.detail.value
    })
  },
  input5(e){
    this.setData({
      value5: e.detail.value
    })
  },
  btn(){
    const _this = this;
    if (/^\d+(\.\d{1,2})?$/.test(_this.data.value1) && /^\d+(\.\d{1,2})?$/.test(_this.data.value2) && /^\d+(\.\d{1,2})?$/.test(_this.data.value3) && /^\d+(\.\d{1,2})?$/.test(_this.data.value4) && /^\d+(\.\d{1,2})?$/.test(_this.data.value5) ) {
      console.log(9)
    } else {
      wx.showToast({
        title: '请输入正确价格',
        icon:'none'
      })
    }
  },
})