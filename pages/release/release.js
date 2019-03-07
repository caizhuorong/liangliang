const app = getApp();
const version = require('../../config.js').version;
let user_id = wx.getStorageSync('userInfo').userId;
const getHairTemplateTagList = require('../../config.js').getHairTemplateTagList;
const uploadProductionFiles = require('../../config.js').uploadProductionFiles;
const uploadProductionCoverFile = require('../../config.js').uploadProductionCoverFile;
const baseShare = require('../../utils/util.js').baseShare;
const nonspecificSharePage = require('../../config.js').nonspecificSharePage;
const getUrl = require('../../utils/util.js').getUrl;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dr:0,
    move_type:false,
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
    dis_type:false,
    label_list:[],
    value:'',
    uploadimg:[],
    uploadimgid:'',
    order:0,
    btn_type:true,
    thisid:0,
    textare:false,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  value(e){
    this.setData({
      value:e.detail.value,
      textlength: e.detail.value.length
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    wx.getSystemInfo({
      success:function(data){
        _this.setData({
          dr:data.screenWidth/750
        })
      }
    });
		let para={
			userId: user_id,
			version: version,
		}
		util.get(`${getHairTemplateTagList}`,para).then(res=>{
			let data = res.info.templateTagList;
			let _data = [];
			if( res.code == 0 ){
			
			}else{
			 let title = "系统通知";
			 let notice = '出错啦';
			 wx.navigateTo({
			 	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			 })
			}
			data.forEach(function (x, y) {
			  _data.push({
			    title: x.tagTypeLabel,
			    id: x.tagType,
			    children: [],
			    inputFlag: x.inputFlag
			  })
			});
			var arr = _data,
			  i,
			  j,
			  len = arr.length;
			for (i = 0; i < len; i++) {
			  for (j = i + 1; j < len; j++) {
			    if (arr[i].id == arr[j].id) {
			      arr.splice(j, 1);
			      len--;
			      j--;
			    }
			  }
			}
			data.forEach(function (x, y) {
			  arr.forEach(function (xs, ys) {
			    if (x.tagType == xs.id) {
			      arr[ys].children.push({
			        title: x.tagLabel,
			        id: x.tag,
			        type: false,
			        exclusiveFlag: x.exclusiveFlag
			      })
			    }
			  })
			});
			_this.setData({
			  label_list: arr
			})
			wx.hideLoading();
		}).catch(error=>{
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  labelBtn(e){
    let _id = e.currentTarget.dataset.id;
    let _ids = e.currentTarget.dataset.ids;
    let _data = this.data.label_list;
    let _exclusiveFlag = e.currentTarget.dataset.type;
    console.log(_exclusiveFlag);
    if ( _exclusiveFlag == 1 ){
      console.log(_data[_id].children[_ids].type);
      if (_data[_id].children[_ids].type == false ){
        _data[_id].children.forEach(function(x,y){
          x.type = false;
        })
        _data[_id].children[_ids].type = !_data[_id].children[_ids].type;
      };
    }else{
      _data[_id].children[_ids].type = !_data[_id].children[_ids].type;
    };
    this.setData({
      label_list: _data
    })
  },
  
  upload() {
    const _this = this;
    
    wx.chooseImage({
      count: 9 - _this.data.img_list.length, // 默认9
      sizeType: ['compressed', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths;
        let _data = _this.data.img_list;
        src.forEach(function(x,y){
          _data.push({
            url: x,
            left: 0,
            top: 0,
            type: false,
            move: false,
          });
        });
        _data.forEach(function (x, y) {
          x.left = y % 3 * 210;
          x.top = parseInt(y / 3) * (180 + 25)
        })
        _this.setData({
          ts_top: parseInt(_data.length / 3) * (180 + 25),
          img_list: _data
        },()=>{
          wx.hideLoading();
        });
      }
    })
  },

  tap:function(e){
    this.setData({
      btn_type:false,
      thisid:e.currentTarget.dataset.id,
      textare:true,
    })
    // let _data = this.data.img_list;
    // if (_data[e.currentTarget.dataset.id].type == true ){
    //   _data[e.currentTarget.dataset.id].type = false;
    //   this.setData({
    //     img_list: _data,
    //   })
    // }else{
    //   _data.forEach(function (x, y) {
    //     x.type = false;
    //   })
    //   _data[e.currentTarget.dataset.id].type = true;
    //   this.setData({
    //     img_list: _data,
    //   })
    // }
  },
  cancel(){
    this.setData({
      btn_type:true,
      textare: false,
    })
  },
  setfm(){
    let _datas = this.data.img_list[this.data.thisid];
    this.data.img_list.splice(this.data.thisid,1);
    this.data.img_list.unshift(_datas);
    this.data.img_list.forEach(function (x, y) {
      x.left = y % 3 * 210;
      x.top = parseInt(y / 3) * (180 + 25)
    })
    this.setData({
      img_list: this.data.img_list,
      long_del: true,
      move_type: false,
      btn_type: true,
      textare:false,
      ts_top: parseInt(this.data.img_list.length / 3) * (180 + 25),
    })
  },
  setzm(){
    this.data.img_list.forEach(function(x,y){
      x.type = false;
    })
    this.data.img_list[this.data.thisid].type=true;

    this.setData({
      img_list:this.data.img_list,
      btn_type: true,
      textare:false,
    })
  },
  del(){
    this.data.img_list.splice(this.data.thisid,1);
    this.data.img_list.forEach(function (x, y) {
      x.left = y % 3 * 210;
      x.top = parseInt(y / 3) * (180 + 25)
    })
    this.setData({
      img_list: this.data.img_list,
      long_del: true,
      move_type: false,
      btn_type: true,
      textare:false,
      ts_top: parseInt(this.data.img_list.length / 3) * (180 + 25),
    })
  },
  checkboxChange(e){
    this.setData({
      dis_type: !this.data.dis_type
    })
  },
  goToindex(){
    const _this = this;
    let _type = false;
    let _data = _this.data;
    let _datas = _this.data.img_list;
    _datas.forEach(function (x, y) {
      if (x.type) {
        _type = true;
      }
    });
    if (_datas.length == 0 ){
      wx.showToast({
        title: '请先上传照片',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    if (_type == false && _data.dis_type ) {
      wx.showToast({
        title: '请先单击图片设置正面照',
        icon: 'none',
        duration: 1500,
      })
      return false;
    }
    let laebl_list_type_length=0;
    let inputFlag = 0;
    let inputFlags = true;
    if ( _data.dis_type  ){
      _data.label_list.forEach(function(x,y){
        if( x.inputFlag == 1 ){
          let a = 0;
          x.children.forEach(function (xs, ys) {
            if (!xs.type) {
              inputFlag =false;
              a = a +1;
            }
          });
          if( a == x.children.length ){
            inputFlags=false;
          }
        };
      })
    }
    if (!inputFlags ){
      wx.showToast({
        title: '带星号栏目必须有一个选项',
        icon: 'none'
      })
      return false;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let data = '';
    _data.label_list.forEach(function (x, y) {
      x.children.forEach(function (xs, ys) {
        if (xs.type) {
          if (data == '') {
            data = data + xs.id
          } else {
            data = data + ',' + xs.id
          }
        }
      });
    })
    let files = [];
    _data.img_list.forEach(function (x, y) {
      files.push(x);
    });
    _this.setData({
      uploadimg: files,
    }, () => {
      wx.getImageInfo({
        src: _this.data.uploadimg[0].url,
        success(imgs){
          wx.uploadFile({
            url: uploadProductionCoverFile,
            filePath: _this.data.uploadimg[0].url,
            name: 'file',
            
            formData: {
              userId: user_id,
              version: version,
              sex: wx.getStorageSync('userInfo').sex,
              isTemplate: _data.dis_type ? 1 : 0,
              tags: data,
              synopsis: _data.value,
              frontFlag: _this.data.uploadimg[0].type ? '1' : '0',
              width:imgs.width,
              height:imgs.height
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              let ress = JSON.parse(res.data)
              wx.hideLoading();
              console.log(ress);
              let data = ress.info;
              if (ress.code == 0) {
                let _data = _this.data.uploadimg;
              
                if (ress.info.points != null ){
                  wx.setStorageSync('releaseLayer', ress.info.points.points);
                };
               
                _data.splice(0, 1);
                _this.setData({
                  uploadimg: _data,
                  uploadimgid: data.production_no,
                },() => {
                  _this.forImgList();
                })
              } else {
                let title = "系统通知";
                let notice = "出错啦";
                wx.navigateTo({
                  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                })
                wx.hideLoading();
              }
            },
            fail: function (error) {
              let title = "系统通知";
              let notice = "出错啦";
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
              wx.hideLoading();
            }
          });
        },
      })
      
    })
  },
  forImgList(){
    const _this = this;
    if( _this.data.uploadimg.length == 0 ){
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'none'
      })
      setTimeout(function(){
        
        wx.switchTab({
          url: '../square/square',
        });
      },1500)
    }else{
      _this.setData({
        order:_this.data.order+1
      },()=>{
        _this.otherImgList();
      });
    }
  },
  otherImgList(){
    const _this = this;
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    wx.getImageInfo({
      src: _this.data.uploadimg[0].url,
      success(imgs){
        wx.uploadFile({
          url: uploadProductionFiles, //仅为示例，非真实的接口地址
          filePath: _this.data.uploadimg[0].url,
          name: 'file',
          formData: {
            'production_no': _this.data.uploadimgid,
            'order': _this.data.order,
            'userId': user_id,
            'isTemplate': _this.data.dis_type ? 1 : 0,
            'coverFlag': '0',
            'frontFlag': _this.data.uploadimg[0].type ? '1' : '0',
            'width':imgs.width,
            'height':imgs.height
          },
          success: function (res) {
            console.log(res);
            let ress = JSON.parse(res.data)
            let data = ress.info;
            if (ress.code == 0) {
              let _data = _this.data.uploadimg;
              _data.splice(0, 1);
              _this.setData({
                uploadimg: _data
              }, () => {
                _this.forImgList();
              })
            } else {
              let title = "系统通知";
              let notice = "出错啦";
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            }
          },
          fail: function (error) {
            let title = "系统通知";
            let notice = "出错啦";
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
          }
        }); 
      },
    })
    
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
          if (-50 < _datax - x1.left && _datax - x1.left < 50 && -50 < _datay - x1.top && _datay -x1.top  < 50 ){
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
        }else{
          if (_this.data.img_list.length == 1 ){
            _data[_this.data.start_id].left = _this.data.start_position.x;
            _data[_this.data.start_id].top = _this.data.start_position.y;
            _this.setData({
              img_list: _data,
              move_type: false,
              long_del: true
            })
          }
        }
      });
      if (e.currentTarget.offsetTop < -50) {
        _data.splice(_this.data.start_id, 1);
        wx.setStorageSync('img', _data);
        _data.forEach(function (x, y) {
          x.left = y % 3 * 210;
          x.top = parseInt(y / 3) * (180 + 25)
        })
        _this.setData({
          ts_top: parseInt(_data.length / 3) * (180 + 25),
          img_list: _data
        });
      _this.setData({
        img_list: _data,
        long_del: true,
        move_type: false,
        ts_top: parseInt(_data.length / 3) * (180 + 25),
      })
    }
    }
  },
  onShareAppMessage: function () {
    wx.showShareMenu({
      withShareTicket: false
    });
    const _this = this;
    baseShare(_this);
    let storageShareInfo = wx.getStorageSync('shareInfo');
    let shareTitle = storageShareInfo.otherTitle.split('|');
    let x = mathRandom(shareTitle);
    let shareImageUrl = '';
    if (storageShareInfo.otherFlag == '1') {
      shareImageUrl = storageShareInfo.otherPicture;
    } else {
      shareImageUrl = '';
    }
    var shareObj = {
      title: shareTitle[x],
      desc: '拍照就能造型，为你量身打造适合你的发型',
      path: `/pages/index/index?shareUserId=${wx.getStorageSync('userInfo').userId}&scene=${getUrl()}`,
      imageUrl: shareImageUrl,
      success: function (res) { // 转发成功之后的回调
      },
    }
    return shareObj;
  },
})