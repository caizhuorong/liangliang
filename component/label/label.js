Component({

  behaviors: [],

  properties: {
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    value:{
      type:String,
      value:''
    },
    type:{
      type:String,
      value:true,
    },
    url:{
      type:String,
      value:''
    },
    end:{
      type:String,
      value:'',
    }
  },
  methods: {

  }

})