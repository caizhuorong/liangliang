Component({

  behaviors: [],

  properties: {
    giftShow: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    giftLayerBanner: {
      type: Array,
      value: [],
    },
  },
  methods: {
    goToCard(){
      if (this.data.giftLayerBanner.length > 1) {
        let _data = this.data.giftLayerBanner;
        _data.splice(0, 1);
        this.setData({
          giftLayerBanner: _data
        })
      } else {
        this.setData({
          giftShow: false
        })
      }
      // wx.navigateTo({
      //   url: '../../other_pages/card/card',
      // })
      wx.showToast({
        title: '领取成功',
      })
    },
    closeLayer() {
      if (this.data.giftLayerBanner.length >1 ){
        let _data = this.data.giftLayerBanner;
        _data.splice(0,1);
        this.setData({
          giftLayerBanner: _data
        })
      }else{
        this.setData({
          giftShow: false
        })
      }
    },
  },
})
