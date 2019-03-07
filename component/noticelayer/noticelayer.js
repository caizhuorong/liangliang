Component({

  behaviors: [],

  properties: {
    noticeShow: { // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    noticeLayerBanner: {
      type: Array,
      value: [],
    },
    widthImg:{
      type:Number,
      value:0
    },
    heightImg:{
      type:Number,
      value:0
    },
    leftImg:{
      type:Number,
      value:0
    },
    topImg:{
      type:Number,
      value:0
    }
  },
  methods: {
    goToCard(){
      if (this.data.noticeLayerBanner.length > 1) {
        let _data = this.data.noticeLayerBanner;
        _data.splice(0, 1);
        this.setData({
          noticeLayerBanner: _data
        })
      } else {
        this.setData({
          noticeShow: false
        })
      }
      // wx.navigateTo({
      //   url: '../../other_pages/card/card',
      // })
     
    },
    loadImg(e){
      console.log(e);
      let desix = 750 / wx.getSystemInfoSync().screenWidth;
      let imgd_rpx= e.detail.width/500/desix;
      this.setData({
        heightImg: e.detail.height * imgd_rpx,
        topImg:e.detail.height *imgd_rpx /2
      })
    },
    closeLayer() {
      if (this.data.noticeLayerBanner.length >1 ){
        let _data = this.data.noticeLayerBanner;
        _data.splice(0,1);
        this.setData({
          noticeLayerBanner: _data
        })
      }else{
        this.setData({
          noticeShow: false
        })
      }
    },
  },
})
