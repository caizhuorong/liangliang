// pages/index/index.js
Page({

  data: {
    num:0,
  },
  change(e){
    this.setData({
      num:e.detail.cursor
    })
  }
})