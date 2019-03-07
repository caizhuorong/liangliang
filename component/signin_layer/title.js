Component({

  behaviors: [],

  properties: {
    text: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    margintop:{
      type:String,
      value:0,
    },
    more:{
      type:String,
      value:0
    },
    url:{
      type:String,
      value:'',
    }
  },
  methods: {
    svae_storage(){
      // let data = {
      //   tab:'1',
      //   subtab:'0',
      //   condition:[]
      // };
      // wx.setStorageSync('active_once', data)
    },
  }

})