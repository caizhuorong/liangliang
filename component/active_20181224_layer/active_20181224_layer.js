Component({

  behaviors: [],

  properties: {
    activeShow: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    layerWidth: {
      type: String,
      value: ''
    },
    layerHeight: {
      type: String,
      value: '',
    },
    imgWidth: {
      type: String,
      value: '',
    },
    imgHeight: {
      type: String,
      value: ''
    },
    activeInfo: {
      type: Object,
      value: {}
    },
    closeType: {
      type: Boolean,
      value: true,
    }
  },
  methods: {
    goToCard() {
      this.setData({
        activeShow: false
      })
      wx.navigateTo({
        url: '../../others_pages/luck_draw/luck_draw',
      })
    },
    img_load(e) {
      if (this.data.activeInfo.detail.showRaffleActive == undefined) {
        return false;
      }

      if (this.data.activeInfo.detail.showRaffleActive[0].closeFlag == '1') {
        this.setData({
          imgWidth: e.detail.width,
          imgHeight: e.detail.height,
          layerWidth: e.detail.width,
          layerHeight: e.detail.height + 100,
        })
      } else {
        this.setData({
          imgWidth: e.detail.width,
          imgHeight: e.detail.height,
          layerWidth: e.detail.width,
          layerHeight: e.detail.height,
        })
      }
      if (this.data.activeInfo.detail.showRaffleActive == undefined) {
        return false;
      }
      if (this.data.activeInfo.detail.showRaffleActive[0].modalFlag == '1') {
        this.setData({
          closeType: false
        })
      } else {
        this.setData({
          closeType: true
        })
      }
    },
    closeLayer() {
      this.setData({
        activeShow: false
      })
    },
  },
  attached() {

  },
  lifetimes: {
    attached() {

    },
  }
})
