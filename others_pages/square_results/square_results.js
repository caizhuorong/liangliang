//index.js
//获取应用实例
const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
const smallProgramNo = require('../../config.js').smallProgramNo;
import {
  uploadErrorInfoFn,
  version,
  numto,
  baseShare,
  delNull,
  getUrl,
  formIdPost,
	mathRandom
} from '../../utils/util.js';
import {
  nonspecificSharePage,
  selectRequiredTemplateList,
  selectRequiredTemplateListTitle,
  selectNewestTemplate,
  selectNewestTemplateTitle,
  selectRequiredDiscoveryList,
  selectRequiredDiscoveryListTitle,
  saveFormId,
  saveFormIdTitle,
} from '../../config.js';
let sex = 0;
let tagArray = [];
let tagString = '';
let title="";
Page({
  data: {
    page_num: 1,
    loading_text: '加载中...',
    onReachBottom: true,
    note: [],
    sex: 0,
    tips_show: false,
  },
  templateClick(e) {
    formIdPost(saveFormId, e.detail.formId, user_id, version, smallProgramNo);
  },
  onLoad: function (options) {
    user_id = wx.getStorageSync('userInfo').userId;
    wx.setNavigationBarTitle({
      title: options.title,
    });
    title = options.title;
    const _this = this;
    sex = options.sex == undefined ? wx.getStorageSync('userInfo').sex : options.sex;
    tagString = options.tag;
    if (options.tag == 'NEW') {
      _this.selectNewestTemplate();
    } else {
        _this.selectRequiredTemplateList(true);
    }
  },
  selectNewestTemplate() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const _this = this;
    let para = {
      userId: user_id,
      version: version,
      sex: sex
    }
    util.get(`${selectNewestTemplate}`, para).then(res => {
      if (res.code == 0) {
        let _data = [];
        let data = res.info.resultList
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
        });
        wx.stopPullDownRefresh();
        wx.hideLoading();
      } else if (res.code == 2002) {
        _this.setData({
          note: [],
        })
      } else {
        uploadErrorInfoFn(`${selectNewestTemplateTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
    }).catch(error => {
      uploadErrorInfoFn(`${selectNewestTemplateTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = '出错啦';
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
    })
  },


  selectRequiredTemplateList(clearn_type) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const _this = this;
    let param = {
      userId: user_id,
      version: version,
      sex: sex,
      pageNum: _this.data.page_num,
      condition: tagString
    }
    let url;
    let urlTitle;
    if ( title == '筛选结果' ){
      url = selectRequiredDiscoveryList;
      urlTitle = selectRequiredDiscoveryListTitle;
    }else{
      url = selectRequiredTemplateList;
      urlTitle = selectRequiredTemplateListTitle;
    }
    util.get(`${url}`,param).then(res=>{
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
        _this.setData({
          note: _data,
          loading_text: loading_text,
          onReachBottom: loading_type,
          choose_type: false,
        });
      } else if (res.code == 2002) {
        _this.setData({
          note: [],
        })
      } else {
        uploadErrorInfoFn(`${urlTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
        let title = "系统通知";
        let notice = '出错啦';
        wx.navigateTo({
          url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    }).catch(error=>{
      uploadErrorInfoFn(`${urlTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
      let title = "系统通知";
      let notice = "出错啦";
      wx.navigateTo({
        url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
      })
      wx.hideLoading();
      return;
    })
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
      if (tagString == 'NEW') {
        _this.selectNewestTemplate();
      } else {
        _this.selectRequiredTemplateList(true);
      }

    })
  },
  onReachBottom: function () {
    const _this = this;
    const { curr } = _this.data;
    if (tagString == 'NEW') {
      return false;
    }
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
        if (_this.data.tips_show) {
          wx.hideLoading();
          _this.setData({
            loading_text: '已经拉到底啦',
          })
        } else {
          _this.selectRequiredTemplateList(false);
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
