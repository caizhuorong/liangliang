//index.js
//获取应用实例
const app = getApp();
const version = require('../../config.js').version;
const user_id = require('../../config.js').user_id;
const selectFollowedProductionAndHairTemplate = require('../../config.js').selectFollowedProductionAndHairTemplate;
const addFollow = require('../../config.js').addFollow;
const selectUserStylistList = require('../../config.js').selectUserStylistList;
const getHairTemplateTagList = require('../../config.js').getHairTemplateTagList;
const selectCommendHairTemplate = require('../../config.js').selectCommendHairTemplate;
const selectRequiredHairTemplateList = require('../../config.js').selectRequiredHairTemplateList;
Page({
  data: {
    curr:1,
    tips_show:false,
    choose_type:false,
    curr_type:2,
    page_num:1,
    loading_text:'加载中...',
    follow_list:[],
    onReachBottom:true,
    note: [],
    label_list:[],
    displaytype:false,
    label_type:false,
    label_click:''
  },
  //事件处理函数
  onLoad: function () {
    const _this = this;
    wx.request({
      url: getHairTemplateTagList, //仅为示例，并非真实的接口地址
      method:'get',
      data:{
        userId:user_id,
        version:version,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let data = res.data.info.templateTagList;
        let _data = [];
        data.forEach(function(x,y){
          _data.push({
            title: x.tagTypeLabel,
            id: x.tagType,
            children: []
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
          arr.forEach(function(xs,ys){
            if (x.tagType == xs.id) {
              arr[ys].children.push({
                label: x.tagLabel,
                id: x.tag,
                staut: false,
              })
            }
          })
        });
        _this.setData({
          label_list:arr
        })
        wx.hideLoading();
      },
      fail(error) {
        console.log(error);
        let title = "系统通知";
        let notice = res.message;
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    });
    _this.selectCommendHairTemplate();
  },
  gotorelease(){
    wx.setStorageSync('img', []);
    wx.navigateTo({
      url: '../release/release',
    })
  },
  selectCommendHairTemplate(){
    const _this = this;
    wx.request({
      url: selectCommendHairTemplate, //仅为示例，并非真实的接口地址
      method: 'get',
      data: {
        userId: user_id,
        version: version,
        orderFlag: _this.data.curr_type,
        sex: 1,
        pageNum:_this.data.page_num
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let data = res.data.info.resultList;
        let _data = _this.data.note;
        console.log(data);
        if (res.data.code == 0 ){
          data.forEach(function (x, y) {
            _data.push({
              name: x.showNick,
              heart_num: x.accessCount == null ? '0' : x.accessCount,
              url: x.filePath,
              avatar: x.personIcon,
              type: false,
              id: x.no,
              isTemplate: x.isTemplate == null ? 0 : x.isTemplate
            })
          });

          let loading_text = '加载中...';
          let loading_type = true;
          if (data.length < 20) {
            loading_text = '已经拉到底啦';
            loading_type = false;
          } else {
            loading_text = '上拉加载更多';
            loading_type = true;
          };
          _this.setData({
            note: _data,
            loading_text: loading_text,
            onReachBottom: loading_type
          });
        }else{
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        }
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
      fail(error) {
        let title = "系统通知";
        let notice = res.message;
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    });
  },
  layer_qd(){
    const _this = this;
    let _data = _this.data.label_list;
    let data = '';
    _data.forEach(function(x,y){
      x.children.forEach(function(xs,ys){
        if (xs.staut){
          if (data == ''){
            data = data + xs.id
          }else{
            data = data + ',' + xs.id
          }
        }
      });
     
    })
    _this.setData({
      label_click:data
    },()=>{
      _this.selectRequiredHairTemplateList(1);
    })
   
  },
  selectRequiredHairTemplateList(pageNum){
    const _this = this;
    console.log(_this.data.label_click);
    wx.request({
      url: selectRequiredHairTemplateList, //仅为示例，并非真实的接口地址
      method: 'get',
      data: {
        userId: user_id,
        version: version,
        orderFlag: _this.data.curr_type,
        pageNum: pageNum ,
        condition: _this.data.label_click
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        let data = res.data.info.resultList;
        let _data = [];
        console.log(data);
        if (res.data.code == 0) {
          data.forEach(function (x, y) {
            _data.push({
              name: x.showNick,
              heart_num: x.accessCount == null ? '0' : x.accessCount,
              url: x.filePath,
              avatar: x.personIcon,
              type: false,
              id: x.no,
              isTemplate: x.isTemplate == null ? 0 : x.isTemplate
            })
          });

          let loading_text = '加载中...';
          let loading_type = true;
          if (data.length < 20) {
            loading_text = '已经拉到底啦';
            loading_type = false;
          } else {
            loading_text = '上拉加载更多';
            loading_type = true;
          };
          _this.setData({
            note: _data,
            loading_text: loading_text,
            onReachBottom: loading_type,
            choose_type: false,
            page_num: 1
          });
        } else {
          let title = "系统通知";
          let notice = res.message;
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        }
        wx.stopPullDownRefresh();
        wx.hideLoading();
      },
      fail(error) {
        let title = "系统通知";
        let notice = res.message;
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    });
  },
  closeImg:function(){
    this.setData({
      tips_show:false
    })
  },
  changeChose:function(e){
    let _data = this.data.label_list;
    let data = e.currentTarget.dataset;
    _data[data.ids].children[data.id].staut = !_data[data.ids].children[data.id].staut;
    this.setData({
      label_list: _data
    })
  },
  layer_cancel:function(){
    let _data = this.data.label_list;
    _data.forEach(function(x,y){
      x.children.forEach(function(xs,ys){
        xs.staut = false;  
      })
    });
    this.setData({
      label_list:_data,
      label_type:false
    })
  },
  chooseType:function(e){
    const _this = this;
    _this.layer_cancel()
    if( e.currentTarget.dataset.type == 4 ){
      _this.setData({
        choose_type: !_this.data.choose_type
      },()=>{
        if (_this.data.choose_type == true) {
          wx.hideTabBar({
            animation: true //是否需要过渡动画
          })
        } else {
          wx.showTabBar({
            animation: true //是否需要过渡动画
          })
        }
      })
    }else{
      _this.setData({
        curr_type: e.currentTarget.dataset.type,
        page_num:1,
        loading_text: '加载中...',
        onReachBottom: false,
        note: [],
        follow_list: [],
        label_type:false
      },()=>{
        _this.selectCommendHairTemplate();
      });
    }
  },
  changeFollow(e){
    const _this = this;
    console.log(e.currentTarget.dataset.id);
    wx.request({
      url: addFollow+'?userId='+user_id+'&version='+version+'&stylistId='+e.currentTarget.dataset.id, //仅为示例，并非真实的接口地址
      method: 'post',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data);
        let _data = _this.data.follow_list;
        _data[e.currentTarget.dataset.ids].stuat = false;
        _this.setData({
          follow_list:_data
        })
        wx.hideLoading();
      },
      fail(error) {
        console.log(error);
        let title = "系统通知";
        let notice = res.message;
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      }
    })
  },
  getFollowList(pageNum){
    const _this = this;
    if (_this.data.onReachBottom ){
      wx.request({
        url: selectFollowedProductionAndHairTemplate, //仅为示例，并非真实的接口地址
        data: {
          userId: user_id,
          version: version,
          pageNum: pageNum,
        },
        method: 'get',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          console.log(res);
          const data = res.data.info;
          if( res.data.code == 0 ){
            if (data != null) {
              let _data = _this.data.follow_list;
              data.resultList.forEach(function (x, y) {
                _data.push({
                  name: x.showNick,
                  heart_num: x.accessCount == null ? 0 : x.accessCount,
                  url: x.filePaths[0],
                  avatar: x.personIcon,
                  id: x.userId,
                  type: x.filePaths.length > 1 ?true:false,
                  isTemplate: x.isTemplate == null ? 0 : x.isTemplate
                })
              });

              let loading_text = '加载中...';
              let loading_type = true;
              if (data.resultList.length < 20) {
                loading_text = '已经拉到底啦';
                loading_type = false;
              } else {
                loading_text = '上拉加载更多';
                loading_type = true;
              };
              _this.setData({
                note: _data,
                loading_text: loading_text,
                onReachBottom: loading_type
              });
              wx.stopPullDownRefresh();
              _this.setData({
                tips_show: false
              })
            } else {
              _this.setData({
                tips_show: true
              });
              wx.stopPullDownRefresh();
              _this.selectUserStylistList(1)
            }
          }else{
            let title = "系统通知";
            let notice = res.message;
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
            wx.hideLoading();
            return;
          }
          wx.hideLoading();
        },
        fail(error) {
          console.log(error);
          let title = "系统通知";
          let notice = "系统维护中";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      })
    }
  },
  selectUserStylistList(pageNum){
    const _this = this;
    if (_this.data.onReachBottom) {
      wx.request({
        url: selectUserStylistList, //仅为示例，并非真实的接口地址
        data: {
          userId: user_id,
          version: version,
          pageNum: pageNum,
        },
        method: 'get',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          const data = res.data;
            let _data = _this.data.follow_list;
            res.data.info.sHairUserStylistResps.forEach(function (x, y) {
              _data.push({
                stuat: x.isFollowed == 1 ? false : true,
                img_url: x.personIcon,
                name: x.nick,
                label: x.goodAt,
                id: x.userId,
              })
            });

            let loading_text = '加载中...';
            let loading_type = true;
            if (res.data.info.sHairUserStylistResps.length < 20) {
              loading_text = '已经拉到底啦';
              loading_type = false;
            } else {
              loading_text = '上拉加载更多';
              loading_type = true;
            };
            _this.setData({
              follow_list: _data,
              loading_text: loading_text,
              onReachBottom: loading_type
            });
          wx.stopPullDownRefresh();
          wx.hideLoading();
        },
        fail(error) {
          console.log(error);
          let title = "系统通知";
          let notice = "系统维护中";
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
          wx.hideLoading();
          return;
        }
      })
    }
  },
  currTab:function(e){
    const _this = this;
    const { curr } = _this.data;
    _this.layer_cancel();
    if( curr == e.currentTarget.dataset.curr ){
      return ;
    }else{
      _this.setData({
        curr: e.currentTarget.dataset.curr,
        loading_text:'加载中...',
        onReachBottom: true,
        note:[],
        follow_list:[],
        page_num:1,
        label_type:false,
        
      })
      wx.showLoading();
      if (e.currentTarget.dataset.curr == 0  ){
        _this.getFollowList(1);
      } else if (e.currentTarget.dataset.curr == 1){
        _this.selectCommendHairTemplate();
        _this.setData({
          tips_show: false
        })
      }else{

      }
      
      
    }
  },
  onPullDownRefresh: function () {
    const _this = this;
    const { curr } = _this.data;
    _this.setData({
      loading_text: '加载中...',
      onReachBottom:true
    })
    wx.showLoading();
    if (curr == 0) {
      _this.setData({
        follow_list:[],
        note: [],
        page_num: 1
      },()=>{
        _this.getFollowList(1);
      })
    } else if (curr == 1) {
      _this.setData({
        follow_list: [],
        note: [],
        page_num: 1
      }, () => {
        if (_this.data.label_type) {
          _this.selectRequiredHairTemplateList(_this.data.page_num);
        } else {
          _this.selectCommendHairTemplate();
        }
      })
    } else {

    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const _this = this;
    const { curr } = _this.data;
    if( _this.data.onReachBottom ){
      _this.setData({
        loading_text: '加载中...',
        displaytype:true
      })
      wx.showLoading();
    }
    
    if (curr == 0) {
      if( _this.data.tips_show ){
        _this.selectUserStylistList(_this.data.page_num + 1);
      }else{
        _this.getFollowList(_this.data.page_num + 1);
      }
      _this.setData({
        page_num: _this.data.page_num + 1
      })
    } else if (curr == 1) {
      _this.setData({
        page_num: _this.data.page_num + 1
      }, () => {
        if (_this.data.label_type) {
          _this.selectRequiredHairTemplateList(_this.data.page_num);
        } else {
          _this.selectCommendHairTemplate();
        }
      })
    } else {

    }
  },
})
