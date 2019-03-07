Component({

  behaviors: [],

  properties: {
    show:{ // 属性名
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false, // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    rember:{
      type:Boolean,
      value:0,
    },
    layerBanner:{
      type:String,
      value:'',
    },
    layerLabel:{
      type:String,
      value:''
    },
    layerTips:{
      type:String,
      value:'',
    },
    code:{
      type:String,
      value:'',
    }
  },
  methods: {
    svae_storage(){
      let data = {
        tab:'1',
        subtab:'0',
        condition:[]
      };
      wx.setStorageSync('active_once', data)
    },
    btn(){
      this.setData({
        show:false
      })
      wx.navigateTo({
        url: '../../other_pages/integral/integral',
      })
    },
    layerRemberClick(){
      if( !this.data.rember == true  ){
        if (this.data.code == 'PT0005|PP00001'  ){
          wx.setStorageSync('shareLayer', 1);
        };
        if (this.data.code == 'PT0004|PP00001') {
          wx.setStorageSync('signLayer', 1);
        };
        if (this.data.code == 'PT0002|PP00002' ){
          wx.setStorageSync('sunLayer', 1);
        }
        if (this.data.code == 'PT0001|PP00002') {
          wx.setStorageSync('hairLayer', 1);
        }
      }else{
        if (this.data.code == 'PT0005|PP00001' ){
          wx.setStorageSync('shareLayer', 0);
        }
        if (this.data.code == 'PT0004|PP00001') {
          wx.setStorageSync('signLayer', 0);
        }
        if (this.data.code == 'PT0002|PP00002') {
          wx.setStorageSync('sunLayer', 0);
        }
        if (this.data.code == 'PT0001|PP00002') {
          wx.setStorageSync('hairLayer', 0);
        }
      }
      this.setData({
        rember:!this.data.rember
      })
    },
    closeLayer(){
      this.setData({
        show:false
      })
    },
  },
})
