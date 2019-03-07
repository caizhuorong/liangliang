// pages/index/index.js
const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import { getUrl, baseShare, numto, uploadErrorInfoFn,mathRandom  } from '../../utils/util.js';
import {
  version,
  selectMyUploadHairList,
  selectMyUploadHairListTitle,
  selectMyFavoriteHairList,
  selectMyFavoriteHairListTitle,
  nonspecificSharePage,
  selectMyFavoriteStyleList,
  selectMyFavoriteStyleListTitle,
  delHairStyleFavorite,
  delHairStyleFavoriteTitle,
  deleteProduction,
  deleteProductionTitle,
  deleteFavorite,
  deleteFavoriteTitle
} from '../../config.js';
Page({
  data: {
    left:true,
    note: [],
    page_num: 1,
    loading_text: '加载中...',
    onReachBottom: true,
    displaytype: false,
    curr:1,
    touchTimeStart:0,
    touchTimeEnd:0,
    canheight: 0,
    canwidth:0,
    nodata:4,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
  },
  showdel(e){
    const _this = this;
    let es = e.currentTarget.dataset;
    _this.data.note.forEach(function (x, s) {
      if (_this.data.curr == 1) {
        if (x.favoriteNo == es.favoriteno) {
          x.deltype = true;
          _this.setData({
            note: _this.data.note
          })
        }
      } else {
        if (x.id == es.templateno) {
          x.deltype = true;
          _this.setData({
            note: _this.data.note
          })
        }
      }

    })
  },
  showdels(e) {
    const _this = this;
    let es = e.currentTarget.dataset;
    _this.data.note.forEach(function (x, s) {
      if (x.favoriteNo == es.favoriteno) {
        console.log(0)
        x.delstype = true;
        _this.setData({
          note: _this.data.note
        })
      }
    })
  },
  hiddendel(e){
    const _this = this;
    let es = e.currentTarget.dataset;
      _this.data.note.forEach(function (x, s) {
        if (x.favoriteNo == es.favoriteno) {
          x.delstype = false;
          _this.setData({
            note: _this.data.note
          })
        }
      })
  },
  down(e){
    wx.showLoading({
      title: '加载中...',
      mask:true
    })
    const _this = this;
    let es = e.currentTarget.dataset;
    let src = _this.data.note[es.index].resultFilePath;
    wx.getImageInfo({
      src:src,
      success(res){
        _this.setData({
          canwidth:res.width,
          canheight:res.height,
        },()=>{
          if (_this.data.note[es.index].resultFilePathColor != undefined ){
            wx.getImageInfo({
              src: _this.data.note[es.index].resultFilePathColor,
              success(ress) {
                _this.can(res.path, ress.path);
              },
              fail(error) {
                console.log(error);
              }
            })
          }else{
            _this.can(res.path, _this.data.note[es.index].resultFilePathColor);
          }
          
        })
      },
      fail(error){
        console.log(error);
      }
    })
  },
  goToDetails(){},
  can(img1,img2){
    console.log(img1,img2);
    const _this = this;
    const ctxs = wx.createCanvasContext('friends');
    let deisx = 750 / wx.getSystemInfoSync().screenWidth;
    ctxs.drawImage(img1, 0, 0, _this.canwidth, _this.canheight, 0, 0, _this.canwidth, _this.canheight);
    if (img2 != undefined ){
    
      ctxs.drawImage(img2, 0, 0, _this.canwidth, _this.canheight, 0, 0, _this.canwidth, _this.canheight);
    }
    ctxs.draw(true,function () {
      wx.hideLoading();
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: _this.canwidth,
        height: _this.canheight,
        destWidth: _this.canwidth,
        destHeight: _this.canheight,
        canvasId: 'friends',
        quality: 1,
        success: function (ress) {
          wx.hideLoading();
          wx.saveImageToPhotosAlbum({
            filePath: ress.tempFilePath,
            success: function (res) {
              wx.showModal({
                title: '提示',
                content: '照片已保存至系统相册',
                'showCancel': false,
                'confirmText': '我知道了',
                success() {
                  
                },
              })
            },
            fail(error) {
              wx.showModal({
                "title": "提示",
                'content': '您还没有授权相册，请点击‘设置’，去授权',
                'showCancel': true,
                'cancelText': '取消',
                'confirmText': '设置',
                success(ressss) {
                  if (ressss.confirm) {
                    wx.openSetting({
                      success(resss) {
                        if (resss.authSetting["scope.writePhotosAlbum"]) {
                        } else {
                        }
                      },
                      fail(errors) {
                      }
                    })
                  }

                },
                fail(errorss) {
                }
              });

            }
          })
        },
        fail(error) {
        }
      });
    })
  },
  goToDetail(e){
    const _this = this;
    let es = e.currentTarget.dataset;
    if (es.deltype) {
      _this.data.note.forEach(function (x, s) {
        if (x.id == es.templateno) {
          x.deltype = false;
          _this.setData({
            note: _this.data.note
          })
        }
      })
    } else {
      if (es.istemplate != 2) {
        wx.navigateTo({
          url: `../heart_detail/hear_detail?templateNo=${es.templateno}&isTemplate=${es.istemplate}`,
        })
      }
    }
  },
  del(e){
    const _this = this;
    wx.showModal({
      tutle: '提示',
      content: '您确定要删除该发型吗?',
      success(moderes) {
        console.log(moderes);
        if (moderes.confirm) {
          wx.showLoading({
            title: '加载中...',
            mask: true
          })

          let es = e.currentTarget.dataset;

          if (_this.data.curr == 0) {
            let para = {
              productionNo: es.templateno,
              userId: user_id,
              version: version
            };
            util.post(`${deleteProduction}`, para).then(res => {
              console.log(res);
              if (res.code == 0) {
                let data = _this.data.note;
                data.forEach(function (x, y) {
                  if (x.id == es.templateno) {
                    data.splice(y, 1);
                  }
                })
                if (data.length == 0) {
                  _this.data.nodata = 0;
                }
                _this.setData({
                  note: data,
                  nodata: _this.data.nodata
                });
                wx.hideLoading();
              } else {
                uploadErrorInfoFn(`${deleteProductionTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
                let title = "系统通知";
                let notice = '出错啦';
                wx.navigateTo({
                  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                })
              }
            }).catch(e => {
              uploadErrorInfoFn(`${deleteProductionTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            })
          } else {
            let para = {
              favoriteNo: es.favoriteno,
              userId: user_id,
              version: version,
              isTemplate: es.istemplate
            };
            util.post(`${deleteFavorite}`, para).then(res => {
              if (res.code == 0) {
                let data = _this.data.note;
                data.forEach(function (x, y) {
                  if (x.favoriteNo == es.favoriteno) {
                    data.splice(y, 1);
                  }
                })
                if (data.length == 0) {
                  _this.data.nodata = 1;
                }
                _this.setData({
                  note: data,
                  nodata: _this.data.nodata
                });
                wx.hideLoading();
              } else {
                uploadErrorInfoFn(`${deleteFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
                let title = "系统通知";
                let notice = '出错啦';
                wx.navigateTo({
                  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
                })
              }
            }).catch(e => {
              uploadErrorInfoFn(`${deleteFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            })
          }
        }else{

        }
      }
    });  
  },
  dels(e){
    const _this = this;
    wx.showModal({
      tutle:'提示',
      content:'您确定要删除该发型吗?',
      success(moderes){
        if ( moderes.confirm ){
          let es = e.currentTarget.dataset;
          let para = {
            favoriteNo: _this.data.note[es.index].favoriteNo,
            userId:user_id,
            version: version
          };
          util.post(`${delHairStyleFavorite}`, para).then(res=>{
            if( res.code == 0 ){
              let data = _this.data.note;
              data.splice(es.index,1);
              if (data.length == 0) {
                _this.data.nodata = 2;
              }
              _this.setData({
                note:data,
                nodata:_this.data.nodata
              });
            }else{
              uploadErrorInfoFn(`${delHairStyleFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
              let title = "系统通知";
              let notice = '出错啦';
              wx.navigateTo({
                url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
              })
            }
          }).catch(e=>{
            uploadErrorInfoFn(`${delHairStyleFavoriteTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
            let title = "系统通知";
            let notice = '出错啦';
            wx.navigateTo({
              url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
            })
          })
        }else{

        }
      },
    })
  },
  error_mask(){},
  change(e) {
    const _this = this;
    if (e.currentTarget.dataset.id != _this.data.curr ){
      wx.showLoading({
        title: '加载中...',
				mask:true
      });
      _this.setData({
        loading_text: '加载中...',
        onReachBottom: true,
        page_num: 1,
        note: [],
        displaytype: false,
        curr:e.currentTarget.dataset.id
      });
      if (e.currentTarget.dataset.id == 0) {
        _this.selectMyUploadHairList();
      } else if (e.currentTarget.dataset.id == 1 ) {
        _this.selectMyFavoriteHairList();
      }else{
        _this.selectMyFavoriteStyleList();
      };
    };
  },
  selectMyFavoriteStyleList(){
    const _this = this;
    let para={
      userId: user_id,
      version: version,
      pageNum: _this.data.page_num,
    }
    util.get(`${selectMyFavoriteStyleList}`,para).then(res=>{
      let data = res.info.resultList;
      let _data = _this.data.note;
      if (res.code == 0) {
        let loading_text = '加载中...';
        let loading_type = true;
        if( data.length == 0  && _data.length == 0 ){
          _this.setData({
            nodata: 2
          })
        }else{
          data.forEach(function (x, y) {
            _data.push({
              no: x.no,
              resultFilePath: x.resultFilePath == null ? '' : x.resultFilePath,
              resultFilePathColor: x.resultFilePathColor,
              favoriteNo: x.favoriteNo,
              delstype:false
            })
          });
          _this.setData({
            nodata:4
          })
        }
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
      } else if (res.data.code == 2003) {
        _this.setData({
          nodata: 2
        })
      } else {
        uploadErrorInfoFn(`${selectMyFavoriteStyleListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }).catch(e=>{
      uploadErrorInfoFn(`${selectMyFavoriteStyleListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(e)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
  },
  selectMyUploadHairList(){
    const _this = this;
		let para={
			 userId: user_id,
			version: version,
			pageNum: _this.data.page_num
		}
		util.get(`${selectMyUploadHairList}`,para).then(res=>{
			let data = res.info.resultList;
			let _data = _this.data.note;
			if (res.code == 0) {
			  let loading_text = '加载中...';
			  let loading_type = true;
			  if (data.length == 0 && _data.length == 0 ){
			    _this.setData({
			      nodata: 0
			    })
			  }else{
			    data.forEach(function (x, y) {
			      _data.push({
			        name: x.showNick == null ? '' : x.showNick,
			        heart_num: x.accessCount == null ? '0' : numto(x.accessCount),
			        url: x.filePaths[0],
			        avatar: x.personIcon,
			        type: x.filePaths != null ? x.filePaths.length > 1 ? true : false : false,
			        id: x.no,
			        isTemplate: x.isTemplate == null ? 0 : x.isTemplate,
			        delFlag: x.delFlag == null ? 0 : x.delFlag,
			        deltype: false,
			        favoriteNo: x.favoriteNo
			      })
			    });
			   
			    if (data.length < 20) {
			      loading_text = '已经拉到底啦';
			      loading_type = false;
			    } else {
			      loading_text = '上拉加载更多';
			      loading_type = true;
			    };
			    _this.setData({
			      nodata:4
			    })
			  }
			  _this.setData({
			    note: _data,
			    loading_text: loading_text,
			    onReachBottom: loading_type,
			  });
			} else if (res.code == 2003 ){
			  _this.setData({
			    nodata:0
			  })
			} else  {
        uploadErrorInfoFn(`${selectMyUploadHairListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			}
			wx.stopPullDownRefresh();
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${selectMyUploadHairListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  selectMyFavoriteHairList() {
    const _this = this;
		let para={
			userId: user_id,
			version: version,
			pageNum: _this.data.page_num
		}
		util.get(`${selectMyFavoriteHairList}`,para).then(res=>{
			let data = res.info.resultList;
			let _data = _this.data.note;
			if (res.code == 0) {
			  let loading_text = '加载中...';
			  let loading_type = true;
			  if(  data.length == 0 && _data.length == 0 ){
			    _this.setData({
			      nodata:1
			    })
			  }else{
			    data.forEach(function (x, y) {
			      if (x.isTemplate == 2) {
			        _data.push({
			          name: x.showNick == null ? '' : x.showNick,
			          heart_num: x.accessCount == null ? '0' : numto(x.accessCount),
			          url: x.resultFilePath,
			          urls: x.resultFilePathColor,
			          avatar: x.personIcon,
			          type: x.filePaths != null ? x.filePaths.length > 1 ? true : false : false,
			          id: x.no,
			          isTemplate: x.isTemplate == null ? 0 : x.isTemplate,
			          delFlag: x.delFlag,
			          deltype: false,
			          favoriteNo: x.favoriteNo
			        })
			      } else {
			        _data.push({
			          name: x.showNick == null ? '' : x.showNick,
			          heart_num: x.accessCount == null ? '0' : numto(x.accessCount),
			          url: x.filePaths[0],
			          avatar: x.personIcon,
			          type: x.filePaths != null ? x.filePaths.length > 1 ? true : false : false,
			          id: x.no,
			          isTemplate: x.isTemplate == null ? 0 : x.isTemplate,
			          delFlag: x.delFlag,
			          deltype: false,
			          favoriteNo: x.favoriteNo
			        })
			      }
			    });
			    _this.setData({
			      nodata:4
			    })
			  };
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
			} else if (res.data.code == 2003) {
			  _this.setData({
			    nodata: 1
			  })
			}else {
        uploadErrorInfoFn(`${selectMyFavoriteHairListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			}
			wx.stopPullDownRefresh();
			wx.hideLoading();
		}).catch(error=>{
      uploadErrorInfoFn(`${selectMyFavoriteHairListTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			let title = "系统通知";
			let notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  onLoad(){
		user_id = wx.getStorageSync('userInfo').userId;
    wx.showLoading({
      title: '加载中...',
			mask:true
    })
    this.selectMyFavoriteHairList();
  },
  onPullDownRefresh: function () {
    const _this = this;
    const { curr } = _this.data;
    _this.setData({
      loading_text: '加载中...',
      onReachBottom: true
    })
    wx.showLoading({
			title:'加载中...',
			mask:true
		});
    if (curr == 1) {
      _this.setData({
        note: [],
        page_num:1
      }, () => {
        _this.selectMyFavoriteHairList();
      })
    } else if (curr == 0 ) {
      _this.setData({
        note: [],
        page_num:1
      }, () => {
        _this.selectMyUploadHairList();
      })
    }else{
      _this.setData({
        note: [],
        page_num: 1
      }, () => {
        _this.selectMyFavoriteStyleList();
      })
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const _this = this;
    const { left } = _this.data;
    _this.setData({
      displaytype: true
    })
    if (_this.data.onReachBottom) {
      _this.setData({
        loading_text: '加载中...',
      })
      wx.showLoading({
				title:'加载中...',
				mask:true
			});
      if (left) {
        _this.setData({
          page_num: _this.data.page_num + 1
        }, () => {
          _this.selectMyFavoriteHairList();
        })
      } else {
        _this.setData({
          page_num: _this.data.page_num + 1
        }, () => {
          _this.selectMyUploadHairList();
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
  gotoresease(){
    wx.navigateTo({
      url: '../release/release',
    })
  },
  gotosquare(){
    wx.switchTab({
      url: '../square/square',
    })
  },
  gotodesign(){
    wx.switchTab({
      url: '../heart_design/heart_design',
    })
  },
})