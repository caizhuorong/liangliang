// pages/change_like/change_like.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    label_list:[
      {
        label:'复古',
        id:1,
        staut:false
      },
      {
        label: '复古',
        id: 1,
        staut: false
      },
      {
        label: '复古',
        id: 1,
        staut: false
      },
      {
        label: '复古',
        id: 1,
        staut: false
      },
      {
        label: '复古',
        id: 1,
        staut: false
      },
      {
        label: '复古',
        id: 1,
        staut: false
      },
      {
        label: '复古',
        id: 1,
        staut: false
      },
      {
        label: '复古',
        id: 1,
        staut: false
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeChose(e){
    let _data = this.data.label_list;
    let num = 0;

    _data.forEach(function (x, y) {
      if (x.staut) {
        num = num + 1;
      }
    });
    if (num >= 5) {
      wx.showToast({
        title: '喜好最多只能选择5项',
        icon: "none"
      })
    } else {
      _data[e.currentTarget.dataset.id].staut = !_data[e.currentTarget.dataset.id].staut;
      this.setData({
        label_list: _data
      })
    }
  }
})