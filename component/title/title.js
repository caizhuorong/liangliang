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
    },
    widths:{
      type:Number,
      value:95
    },
    sex:{
      type:String,
      value:'',
    },
    condition:{
      type:Array,
      value:[],
    },
    newType:{
      type:String,
      value:'',
    }
  },
  methods: {
    svae_storage(){
      console.log(this.data.condition);
      // let data = {
      //   tab:'1',
      //   subtab:'0',
      //   condition:[]
      // };
      // wx.setStorageSync('active_once', data)
      // let data = {
      //   title:this.data.text,
      //   sex:this.data.sex,
      //   newType: this.data.newType,
      //   condition: this.data.condition,
      // }
      // wx.setStorageSync('square_results', data);
    },
  }

})