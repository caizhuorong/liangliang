// component/transformComponent.js
let setIntervals;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tramsHidden:{
      type:Boolean,
      value:true
    },
    sex:{
      type:Number,
      value:0
    },
    num:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    setIntervalss (){
      const _this = this;
      setIntervals = setInterval(function(){
        if (_this.data.num > 19 ){
          _this.setData({
            num: 1,
          })
          // _this.setIntervalsss()
          // clearInterval(setIntervals);
        }else{
          _this.setIntervalsss()
        }
      },100);
    },
    setIntervalsss(){
      this.setData({
        num: this.data.num +1,
      })
    },
  },
  attached(){
    this.setIntervalss();
  },
  lifetimes: {
    attached(){
      this.setIntervalss();
    }
  }
})
