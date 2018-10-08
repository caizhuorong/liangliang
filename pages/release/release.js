// pages/index/index.js
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dr:0,
    move_type:true,
    moveing:false,
    start_id:0,
    long_del:true,
    end_id:0,
    ts_top: 0,
    start_position:{
      x:0,
      y:0
    },
    mb_position:{
      x:0,
      y:0
    },
    img_list:[],
    src:'',
    textlength:0,
    checked:false,
    dis_type:false,
    label_list:[
      {
        id:0,
        title:'性别',
        children:[
          {
            title:'男',
            type:true
          },
          {
            title: '男',
            type: false
          },
          {
            title: '男',
            type: true
          },
          {
            title: '男',
            type: false
          },
          {
            title: '男',
            type: true
          },
          {
            title: '男',
            type: false
          },
        ]
      },
      {
        id: 0,
        title: '性别',
        children: [
          {
            title: '男',
            type: true
          },
          {
            title: '男',
            type: false
          },
          {
            title: '男',
            type: true
          },
          {
            title: '男男男男',
            type: false
          },
          {
            title: '男',
            type: true
          },
          {
            title: '男',
            type: false
          },
        ]
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this;
    let { avatar } = options;
    let _data = _this.data.img_list;
    let stroage = wx.getStorageSync('img');
    if (stroage != '' && stroage!= undefined ){
      _data = stroage;
    }
    if (avatar != '' && avatar != undefined ){
      _data.push({
        url:avatar,
        left:0,
        top:0,
        type:false,
        move:false,
      });
    };
    _data.forEach(function(x,y){
      x.left = y % 3 * 210;
      x.top = parseInt(y / 3) * (180 + 25)
    })
    _this.setData({
      ts_top: parseInt(_data.length / 3) * (180 + 25),
      img_list:_data
    });
    wx.getSystemInfo({
      success:function(data){
        _this.setData({
          dr:data.screenWidth/750
        })
      }
    });
  },
  labelBtn(e){
    let _id = e.currentTarget.dataset.id;
    let _ids = e.currentTarget.dataset.ids;
    let _data = this.data.label_list;
    _data[_id].children[_ids].type = !_data[_id].children[_ids].type;
    this.setData({
      label_list:_data
    })
  },
  
  upload() {
    const _this = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        wx.setStorageSync('img',_this.data.img_list);
        const src = res.tempFilePaths[0]
        wx.redirectTo({
          url: `../../other_pages/upload/upload?src=${src}`
        })
      }
    })
  },
  tap:function(e){
    let _data = this.data.img_list;
    _data.forEach(function (x, y) {
      x.type = false;
    })
    _data[e.currentTarget.dataset.id].type = true;
    this.setData({
      img_list: _data,
    })
   
  },
  checkboxChange(e){
    const _this = this;
    let _type = false;
    let _data = _this.data.img_list;
    if( e.detail.value[0] == '1' ){
      _data.forEach(function(x,y){
        if( x.type ){
          _type = true;
        }
      });
      if( _type == false ){
        wx.showToast({
          title:'请先单击图片设置正面照',
          icon:'none',
          duration:1500,
        })
        _this.setData({
          checked:false,
          dis_type:false
        });
      }else{
        _this.setData({
          checked: true,
          dis_type: true
        })
      }
    }else{
      _this.setData({
        checked: false,
        dis_type: false
      })
    }
  },
  onReady: function () {
    const _this = this;
    setTimeout(function(){
      _this.setData({
        move_type:true
      })
    },1500)
  },
  goToindex(){
    wx.removeStorageSync('img');
    wx.switchTab({
      url: '../square/square',
    });
  },
  ballmove(e){
    let _this = this;
    if (_this.data.move_type ){
      let move_x = e.changedTouches[0].pageX / _this.data.dr - 75 / _this.data.dr;
      let move_y = e.changedTouches[0].pageY / _this.data.dr - 98 / _this.data.dr;
      let _data = this.data.img_list;
      _data[_this.data.start_id].left = move_x;
      _data[_this.data.start_id].top = move_y;
      _this.setData({
        img_list: _data
      })
    }
  },
  start:function(e){
    let _data = this.data.start_position;
    _data.x = this.data.img_list[e.currentTarget.dataset.id].left;
    _data.y = this.data.img_list[e.currentTarget.dataset.id].top;
    this.setData({
      start_position:_data,
      start_id:e.currentTarget.dataset.id,
      moveing:false,
      move_type: false,
    })
  },
  longtap(e) {
    let _now_index = e.currentTarget.dataset.id;
    let _data = this.data.img_list;
    _data[_now_index].move = true;
    this.setData({
      img_list: _data,
      move_type: true,
      long_del:false
    })
  },
  end:function(e){
    let _this = this;
    let start_data = _this.data.img_list[_this.data.start_id].url;
    let _data = _this.data.img_list;
    let _datax = _this.data.img_list[_this.data.start_id].left;
    let _datay = _this.data.img_list[_this.data.start_id].top;
    _data.forEach(function(x,y){
      x.move = false
    })
    if (_this.data.move_type) {
      _this.data.img_list.forEach(function(x1,y1){
        if( y1 != _this.data.start_id ){
          if (-30 < _datax - x1.left && _datax - x1.left < 30 && -30 < _datay - x1.top && _datay -x1.top  < 30 ){
            let end_data = _this.data.img_list[y1].url;
            _data[_this.data.start_id].url = end_data;
            _data[_this.data.start_id].left = _this.data.start_position.x;
            _data[_this.data.start_id].top = _this.data.start_position.y;
            _data[y1].url = start_data;
            _this.setData({
              img_list: _data,
              move_type:false,
              long_del:true
            })
          } else {
            _data[_this.data.start_id].left = _this.data.start_position.x;
            _data[_this.data.start_id].top = _this.data.start_position.y;
            _this.setData({
              img_list: _data,
              move_type:false,
              long_del: true
            })
          }
        }
      });
      if (e.currentTarget.offsetTop < -50) {
      _data.splice(_this.data.start_id, 1);
      console.log(_data.length)
      wx.setStorageSync('img', _data)
      _this.setData({
        img_list: _data,
        long_del: true,
        move_type: false,
        ts_top: parseInt(_data.length / 3) * (180 + 25),
      })
    }
    }
  },
 
})