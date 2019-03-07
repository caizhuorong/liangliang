// component/new_year_theme.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    templateNotice: {
      type: String,
      value: '0',
    },
    now: {
      type: Number,
      value: 0
    },
    newYearTag: {
      type: Array,
      value: [],
    },
    templateNoticeTagsLabel:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show:true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    noto(){
      wx.showToast({
        title: '未解锁，敬请期待',
        mask:true,
        icon:'none'
      })
    },
    gotoSquare(e){
      wx.navigateTo({
        url: `../../others_pages/square_results/square_results?tag=${e.currentTarget.dataset.tag}&sex=${wx.getStorageSync('userInfo').sex}&title=${e.currentTarget.dataset.label}`,
      })
    },
    closeNew(){
      this.setData({
        show:false
      })
    },
    openNew(){
      this.setData({
        show:true
      })
    },
  }
})
// tag = NEW & sex={ { sex } }& title=每日上新
