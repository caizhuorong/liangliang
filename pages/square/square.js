//index.js
//获取应用实例
const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const smallProgramNo = require('../../config.js').smallProgramNo;
const util = require('../../utils/util.js');
let first = false;
let touchDot = 0;//触摸时的原点 
let time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
let interval = "";// 记录/清理时间记录 
let sex = 0;
let template = require('../../component/template/template.js');
const saveFormId = require('../../config.js').saveFormId;
import { 
  version,
  selectFollowedProductionAndHairTemplate,
  selectFollowedProductionAndHairTemplateTitle,
  addFollow,
  addFollowTitle,
  selectFollowUserList,
  selectFollowUserListTitle,
  getHairTemplateTagList,
  getHairTemplateTagListTitle,
  selectRequiredHairTemplateList,
  selectRequiredHairTemplateListTitle,
  selectRequiredDiscoveryList,
  selectRequiredDiscoveryListTitle,
  deleteFollow,
  deleteFollowTitle,
  nonspecificSharePage,
  selectSquareContent,
  selectSquareContentTitle,
} from '../../config.js';
import { 
  formIdPost, 
  getUrl,
  delNull,
  baseShare,
  numto,
  uploadErrorInfoFn,
	mathRandom
} from '../../utils/util.js';
Page({
  data: {
    curr: 1,
    tips_show: false,
    choose_type: false,
    page_num: 1,
    loading_text: '加载中...',
    follow_list: [],
    onReachBottom: true,
    note: [],
    label_list: [],
    displaytype: false,
    label_click: '',
    sex: 0,
    shareLayer: false,
    layerBanner: '',
    layerLabel: '',
    layerTips: '',
    lstSHairTagPage: [],
  },
  templateClick(e) {
    formIdPost(saveFormId, e.detail.formId, user_id, version, smallProgramNo);
  },
  onUnload() {
    wx.removeStorageSync('selectRequiredHairTemplateList');
    wx.removeStorageSync('selectRequiredDiscoveryList');
  },
  onTabItemTap(item) {
    if (delNull(wx.getStorageSync('userInfo').userId) == '' || delNull(wx.getStorageSync('userInfo').sex) == '') {
      wx.reLaunch({
        url: '../../pages/welcome/welcome',
      })
    }
  },
  chooseTypeLeft(e) {
    const _this = this;
    if (e.detail.x < 55 && e.detail.y < 700) {
      _this.setData({
        choose_type: !_this.data.choose_type
      })
    }
  },
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  moveChooseTypeLeft: function (e) {
    const _this = this;
    var touchMove = e.touches[0].pageX;
    // 向右滑动 
    if (touchMove - touchDot >= 100 && time < 50 && _this.data.choose_type) {
      _this.setData({
        choose_type: !_this.data.choose_type
      })
    }
  },
  // 触摸结束事件 
  touchEnd: function (e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },
  goSquareResultsss(e) {
    const _e = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../../others_pages/square_results/square_results?tag=${_e.tag}&title=${_e.label}&sex=${_e.sex}`,
    })
  },
  goSquareResults(e) {
    const _e = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../../others_pages/square_results/square_results?tag=${_e.tag}&title=${_e.label}&sex=${_e.sex}`,
    })
  },
  onShow() {
    const _this = this;
    wx.hideTabBar();
    if (wx.getStorageSync('active_once') == ''){
      return false;
    }
    _this.setData({
      sex: wx.getStorageSync('userInfo').sex,
    });
    sex = wx.getStorageSync('userInfo').sex;
    // wx.getLocation({
    //   success(res) {
    //     wx.setStorage({
    //       key: 'user_location',
    //       data: {
    //         latitude: res.latitude,
    //         longitude: res.longitude
    //       },
    //     })
    //   }
    // });
    let para = {
      userId: user_id,
      version: version,
      pageId:'H0003'
    };
    util.get(`${getHairTemplateTagList}`,para).then(res=>{
      let data = res.info.templateTagList;
      let _data = [];
      if (res.code == 0) {
        data.forEach(function (x, y) {
          if (x.tagType != 1) {
            _data.push({
              title: x.tagTypeLabel,
              id: x.tagType,
              children: []
            })
          }
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
                label: x.tagLabel,
                id: x.tag,
                staut: false,
              })
            }
          })
        });
        let tab = '', subtab = '';
        if (wx.getStorageSync('active_once') != '') {
          first = false;
          wx.setStorageSync('selectRequiredDiscoveryList', arr);
          let storage_data = wx.getStorageSync('active_once');
          if (storage_data.condition != undefined) {
            if (storage_data.condition.length != 0) {
              storage_data.condition.forEach(function (x, y) {
                _data.forEach(function (xs, ys) {
                  if (ys != 0) {
                    xs.children.forEach(function (xss, yss) {
                      if (xss.id == x) {
                        xss.staut = true
                      } else {
                        xss.staut = false
                      }
                    })
                  }
                });
              });
            } else {
              _data.forEach(function (xs, ys) {
                if (ys != 0) {
                  xs.children.forEach(function (xss, yss) {
                    xss.staut = false
                  })
                }
              });
            };
          } else {
            _data.forEach(function (xs, ys) {
              if (ys != 0) {
                xs.children.forEach(function (xss, yss) {
                  xss.staut = false
                })
              }
            });
          }
          tab = storage_data.tab;
          subtab = storage_data.subtab;
          wx.setStorageSync('selectRequiredHairTemplateList', _data);
          wx.setStorageSync('selectRequiredDiscoveryList', _data);
          if (subtab == '2') {
            _this.setData({
              sex: 1,
            })
            sex = 1;
          } else if (subtab == '3') {
            _this.setData({
              sex: 0,
            })
            sex = 0;
          }
          _this.setData({
            label_list: _data,
          })
          wx.removeStorage({
            key: 'active_once',
            success: function (res) { },
          })
        } else {
          wx.setStorageSync('selectRequiredHairTemplateList', arr);
          wx.setStorageSync('selectRequiredDiscoveryList', arr);
          if (wx.getStorageSync('userInfo').sex == 1) {
            tab = 1;
            sex = 1;
          } else {
            tab = 2;
            sex = 0;
          }
          _this.setData({
            label_list: arr,
          })
        }
        _this.setData({
          loading_text: '加载中...',
          onReachBottom: true,
          page_num: 1,
          choose_type: false,
          displaytype: false,
          curr: tab == '' ? 1 : tab,
        }, () => {
          if (_this.data.curr == 2) {
            _this.setData({
              label_list: wx.getStorageSync('selectRequiredDiscoveryList')
            }, () => {
              _this.selectSquareContent(true, sex);
            })
          } else if (_this.data.curr == 1) {
            _this.setData({
              label_list: wx.getStorageSync('selectRequiredHairTemplateList')
            }, () => {
              _this.selectSquareContent(true, sex);
            })
          }
          _this.setData({
            tips_show: false
          })
          if (_this.data.curr == 0) {
            _this.getFollowList(1, true);
          }
        })
        wx.hideLoading();
      } else if (res.code == 2002) {
        _this.setData({
          note: [],
        })
      } else {
        uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  //事件处理函数
  onLoad: function () {
    const _this = this;
    template.tabbar("tabBar", 1, _this);
    user_id = wx.getStorageSync('userInfo').userId;
    _this.setData({
      sex: wx.getStorageSync('userInfo').sex,
    });
    sex = wx.getStorageSync('userInfo').sex;
    let para = {
      userId: user_id,
      version: version,
      pageId:'H0003'
    };
    util.get(`${getHairTemplateTagList}`, para).then(res => {
      let data = res.info.templateTagList;
      let _data = [];
      if (res.code == 0) {
        data.forEach(function (x, y) {
          if (x.tagType != 1) {
            _data.push({
              title: x.tagTypeLabel,
              id: x.tagType,
              children: []
            })
          }
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
                label: x.tagLabel,
                id: x.tag,
                staut: false,
              })
            }
          })
        });
        let tab = '', subtab = '';
        wx.setStorageSync('selectRequiredHairTemplateList', arr);
        wx.setStorageSync('selectRequiredDiscoveryList', arr);
        if (wx.getStorageSync('userInfo').sex == 1) {
          tab = 1;
          sex = 1;
        } else {
          tab = 2;
          sex = 0;
        }
        _this.setData({
          label_list: arr,
        })
      _this.setData({
        loading_text: '加载中...',
        onReachBottom: true,
        page_num: 1,
        choose_type: false,
        displaytype: false,
        curr: tab == '' ? 1 : tab,
      }, () => {
        if (_this.data.curr == 2) {
          _this.setData({
            label_list: wx.getStorageSync('selectRequiredDiscoveryList')
          }, () => {
            _this.selectSquareContent(true, sex);
          })
        } else if (_this.data.curr == 1) {
          _this.setData({
            label_list: wx.getStorageSync('selectRequiredHairTemplateList')
          }, () => {
            _this.selectSquareContent(true, sex);
          })
        }
        _this.setData({
          tips_show: false
        })
        if (_this.data.curr == 0) {
          _this.getFollowList(1, true);
        }
      })
      wx.hideLoading();
    } else if(res.code == 2002) {
  _this.setData({
    note: [],
  })
} else {
  uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
  let title = "系统通知";
  let notice = '出错啦';
  wx.navigateTo({
    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
  })
}
wx.hideLoading();
}).catch (error=> {
  uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
  let title = "系统通知";
  let notice = "出错啦";
  wx.navigateTo({
    url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
  })
  wx.hideLoading();
  return;
})
  },
  selectSquareContent(clearn_type, sex) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const _this = this;
    let sex_num = 0, sexs = sex, datass;
    if (sex == 0) {
      datass = wx.getStorageSync('selectRequiredDiscoveryList');
    } else {
      datass = wx.getStorageSync('selectRequiredHairTemplateList');
    }
    let datasss = '';
    if (datass) {
      datass.forEach(function (x, y) {
        x.children.forEach(function (xs, ys) {
          if (xs.staut) {
            if (datasss == '') {
              datasss = datasss + xs.id
            } else {
              datasss = datasss + ',' + xs.id
            }
          }
        })
      })
    }
    let param = {
      userId: user_id,
      version: version,
      sex: sex,
      pageNum: _this.data.page_num
    }
    if (datasss != '') {
      param['condition'] = datasss;
    }
    util.get(`${selectSquareContent}`, param).then(res=>{
      let data;
      let _data = _this.data.note;
      if (res.code == 0) {
        data = res.info.resultList
        if (clearn_type) {
          _data = [];
        }
        let loading_text = '加载中...';
        let loading_type = true;
        if (delNull(data) != '') {
          data.forEach(function (x, y) {
            _data.push({
              name: x.showNick,
              heart_num: x.accessCount == null ? '0' : numto(x.accessCount),
              url: x.filePathSmall,
              avatar: x.personIcon,
              type: x.filePaths == null ? false : x.filePaths.length > 1 ? true : false,
              id: x.no,
              isTemplate: x.isTemplate == null ? 0 : x.isTemplate,
              new: delNull(x.newFlag) == 1 ? true : false
            })
          });
          if (data.length < 20) {
            loading_text = '已经拉到底啦';
            loading_type = false;
          } else {
            loading_text = '上拉加载更多';
            loading_type = true;
          };
        }
        if (res.info.lstSHairTagPage.length > 0) {
          res.info.lstSHairTagPage.forEach(function (x, y) {
            if (x.tagListType != '0') {
              x.tagList = x.tagList.split(',');
              x.tagListLabel = x.tagListLabel.split(',');
            }
          })
        }
        _this.setData({
          note: _data,
          loading_text: loading_text,
          onReachBottom: loading_type,
          choose_type: false,
          lstSHairTagPage: res.info.lstSHairTagPage
        });
      } else if (res.code == 2002) {
        _this.setData({
          note: [],
        })
      } else {
        uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${getHairTemplateTagListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  gotorelease() {
    wx.setStorageSync('img', []);
    wx.navigateTo({
      url: '../release/release',
    })
  },
  goSquareResultss(e) {
    const _e = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../../others_pages/square_results/square_results?tag=${_e.tag}&title=${_e.label}&sex=${_e.sex}`,
    })
  },
  layer_qd() {
    const _this = this;
    let _data = _this.data.label_list;
    let data = '';
    _data.forEach(function (x, y) {
      x.children.forEach(function (xs, ys) {
        if (xs.staut) {
          if (data == '') {
            data = data + xs.id
          } else {
            data = data + ',' + xs.id
          }
        }
      });
    });
    _this.setData({
      label_click: data,
      page_num: 1,
      choose_type: false,
      loading_text: '加载中...',
      onReachBottom: false,
      follow_list: [],
      displaytype: false,
    }, () => {
      wx.navigateTo({
        url: `../../others_pages/square_results/square_results?tag=${data}&title=筛选结果&sex=${_this.data.sex}`,
      })
    });
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  closeImg: function () {
    this.setData({
      tips_show: false
    })
  },
  changeChose: function (e) {
    let _data = this.data.label_list;
    let data = e.currentTarget.dataset;
    _data[data.ids].children[data.id].staut = !_data[data.ids].children[data.id].staut;
    this.setData({
      label_list: _data
    })
  },
  layer_cancel: function () {
    let _data = this.data.label_list;
    _data.forEach(function (x, y) {
      x.children.forEach(function (xs, ys) {
        if (x.id == 1 && xs.id == 'TT1|TL1E' && wx.getStorageSync('userInfo').sex == '0') {
          xs.staut = true;
        } else if (x.id == 1 && xs.id == 'TT1|TL2E' && wx.getStorageSync('userInfo').sex == '1') {
          xs.staut = true;
        } else {
          xs.staut = false;
        }
      })
    });
    this.setData({
      label_list: _data,
    })
  },
  chooseType: function (e) {
    const _this = this;
    if (e.currentTarget.dataset.type == 4) {
      _this.setData({
        choose_type: !_this.data.choose_type
      })
    } else {
      _this.setData({
        page_num: 1,
        loading_text: '加载中...',
        onReachBottom: false,
        follow_list: [],
        displaytype: false,
        choose_type: false,
      }, () => {
        if (_this.data.curr == 1) {
          _this.selectSquareContent(true, 1);
        } else {
          _this.selectSquareContent(true, 0);
        }
      });
    }
  },
  changeFollow(e) {
    const _this = this;
    let para={
      userId: user_id,
      version: version,
      stylistId: e.currentTarget.dataset.id
    }
    util.post(`${addFollow}`,para).then(res=>{
      if( res.code == 0 ){
        let _data = _this.data.follow_list;
        _data[e.currentTarget.dataset.ids].stuat = false;
        _this.setData({
          follow_list: _data
        })
        if (res.info.points.points != undefined) {
          if (delNull(res.info.points.points.background) == '') {
            return false;
          }
          let banner_url = res.info.points.points.background;
          let _show;

          if (wx.getStorageSync('signLayer') == 1) {
            _show = false;
          } else {
            _show = true;
          }
          _this.setData({
            shareLayer: _show,
            layerBanner: `${banner_url}`,
            layerLabel: res.info.points.points.prompt,
            layerTips: res.info.points.points.points,
            code: res.info.points.points.code
          });
        }
        wx.hideLoading();
      }else{
        uploadErrorInfoFn(`${addFollowTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
      }
    }).catch(error=>{
      uploadErrorInfoFn(`${addFollowTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  delFollow(e) {
    const _this = this;
    wx.showModal({
      title: '提示',
      content: '确定不再关注此人？',
      confirmText: '确定',
      success(res1) {
        if (res1.confirm) {
          let para={
            userId: user_id,
            version: version,
            stylistId: e.currentTarget.dataset.id
          }
          util.post(`${deleteFollow}`,para).then(res=>{
            wx.hideLoading();
            let data = res.info;
            if (res.code == 0) {
              let _data = _this.data.follow_list;
              _data[e.currentTarget.dataset.ids].stuat = true;
              _this.setData({
                follow_list: _data
              })
            } else {
              uploadErrorInfoFn(`${deleteFollowTitle}`, `event:按钮请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            }
          }).catch(error=>{
            uploadErrorInfoFn(`${deleteFollowTitle}`, `event:按钮请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
            let title = "系统通知";
            let notice = "出错啦";
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
            wx.hideLoading();
            return;
          })
        }
      }
    });
  },
  getFollowList(pageNum, clear_type) {
    const _this = this;
    if (_this.data.onReachBottom) {
      let para={
        userId: user_id,
        version: version,
        pageNum: pageNum,
      }
      util.get(`${selectFollowedProductionAndHairTemplate}`,para).then(res=>{
        const data = res.info;
        if (res.code == 0) {
          if (data != null) {
            _this.setData({
              follow_list: [],
            })
            let _data = _this.data.note;
            if (clear_type) {
              _data = [];
            };
            data.resultList.forEach(function (x, y) {
              _data.push({
                name: x.showNick,
                heart_num: x.accessCount == null ? 0 : numto(x.accessCount),
                url: x.filePaths[0],
                avatar: x.personIcon,
                id: x.no,
                type: x.filePaths.length > 1 ? true : false,
                isTemplate: x.isTemplate == null ? 0 : x.isTemplate,
                new: delNull(x.newFlag) == 1 ? true : false
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
            if (pageNum == 1) {
              _this.setData({
                tips_show: false
              })
            }
          } else {

          }
        } else if (res.code == 2002) {
          _this.setData({
            note: [],
            follow_list: [],
            tips_show: true
          })
          wx.stopPullDownRefresh();
          _this.selectFollowUserList(1, true);
        } else {
          uploadErrorInfoFn(`${selectFollowedProductionAndHairTemplateTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = '出错啦';
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        }
        wx.hideLoading();
      }).catch(error=>{
        uploadErrorInfoFn(`${selectFollowedProductionAndHairTemplateTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      })
    }
  },
  goToHairMan(e) {
    let data = e.currentTarget.dataset;
    wx.navigateTo({
      url: `../../others_pages/heart_center/heart_center?id=${data.id}&isStylist=${data.isstylist}`,
    })
  },
  selectFollowUserList(pageNum, clearn_type) {
    const _this = this;
    if (_this.data.onReachBottom) {
      let para={
        userId: user_id,
        version: version,
        pageNum: pageNum,
      }
      util.get(`${selectFollowUserList}`,para).then(res=>{
        const data = res;
        let _data = _this.data.follow_list;
        if (res.code == 0) {
          _this.setData({
            note: [],
          })
          if (clearn_type) {
            _data = [];
          }
          if (res.info != null) {
            res.info.sHairUserStylistResps.forEach(function (x, y) {
              _data.push({
                stuat: x.isFollowed == 1 ? false : true,
                img_url: x.personIcon,
                name: x.nick,
                label: x.sign,
                id: x.userId,
                isStylist: x.isStylist == null ? 0 : x.isStylist
              })
            });
            let loading_text = '加载中...';
            let loading_type = true;
            if (res.info.sHairUserStylistResps.length < 20) {
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
          }
          wx.hideLoading();
        } else if (res.data.code == 2002) {
          _this.setData({
            note: [],
          })
        } else {
          uploadErrorInfoFn(`${selectFollowUserListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
          let title = "系统通知";
          let notice = '出错啦';
          wx.navigateTo({
            url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
          })
        };
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }).catch(error=>{
        uploadErrorInfoFn(`${selectFollowUserListTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
        let title = "系统通知";
        let notice = "出错啦";
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
        wx.hideLoading();
        return;
      })
    }
  },
  currTab: function (e) {
    const _this = this;
    const { curr } = _this.data;
    if (curr == e.currentTarget.dataset.curr) {
      return;
    } else {
      _this.setData({
        curr: e.currentTarget.dataset.curr,
        loading_text: '加载中...',
        onReachBottom: true,
        page_num: 1,
        choose_type: false,
        displaytype: false,
      }, () => {
        if (_this.data.curr == 2) {
          _this.setData({
            label_list: wx.getStorageSync('selectRequiredDiscoveryList'),
            sex: 0,
          }, () => {
            _this.selectSquareContent(true, 0);
            _this.setData({
              tips_show: false
            })
          })
        } else if (_this.data.curr == 1) {
          _this.setData({
            label_list: wx.getStorageSync('selectRequiredHairTemplateList'),
            sex: 1,
          }, () => {
            _this.selectSquareContent(true, 1);
            _this.setData({
              tips_show: false
            })
          })
        }
        if (e.currentTarget.dataset.curr == 0) {
          _this.getFollowList(1, true);
        }
      })
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
    }
  },
  onPullDownRefresh: function () {
    const _this = this;
    const { curr } = _this.data;
    _this.setData({
      loading_text: '加载中...',
      onReachBottom: true,
      page_num: 1
    }, () => {
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      if (curr == 0) {
        _this.getFollowList(1, true);
      } else if (curr == 1) {
        _this.selectSquareContent(true, 1);
      } else {
        _this.selectSquareContent(true, 0);
      }
    })
  },
  onReachBottom: function () {
    const _this = this;
    const { curr } = _this.data;
    _this.setData({
      displaytype: true,
      page_num: _this.data.page_num + 1
    }, () => {
      if (_this.data.onReachBottom) {
        _this.setData({
          loading_text: '加载中...',
        })
        wx.showLoading({
          title: '加载中...',
          mask: true
        });
        if (curr == 0) {
          if (_this.data.tips_show) {
            wx.hideLoading();
            _this.setData({
              loading_text: '已经拉到底啦',
            })
          } else {
            _this.getFollowList(_this.data.page_num, false);
          }
        } else if (curr == 1) {
          _this.selectSquareContent(false, 1);
        } else {
          _this.selectSquareContent(false, 0);
        }
      }
    })
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
