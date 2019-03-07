const app = getApp();
let user_id = wx.getStorageSync('userInfo').userId;
const util = require('../../utils/util.js');
import { formatTimes, formatLocation, getUrl, baseShare, uploadErrorInfoFn,mathRandom} from '../../utils/util.js';
import { 
  nonspecificSharePage, 
  updateUserInfo, 
  updateUserInfoTitle, 
  selectStylistAuthInfo, 
  selectStylistAuthInfoTitle,
  authHairStylist,
  authHairStylistTitle, 
  updateHairStoreInfo,
  updateHairStoreInfoTitle,
  updateHairStylistInfo, 
  updateHairStylistInfoTitle, 
  selectHairTagByTagType,
  selectHairTagByTagTypeTitle,
  selectUserInfoWithStylist,
  selectUserInfoWithStylistTitle,
  selectUserInfoDetail,
  selectUserInfoDetailTitle, 
  version
} from '../../config.js';
Page({
  data: {
    user_info:{},
    man_info:[],
    type:false,
    interestTags:'',
    occupationTags:'',
    goodAtTags:'',
    goodStyleTags:'',
    headLevelTags:'',
    sHairServiceResps: [],
    start_time: '',
    startYear: '',
    telephone:'',
    timeEnd: '',
    wechatQrcode: '',
    workDate: '',
    optionsIcon:'',
    freeServiceTags:'',
    yeardefault:10,
    shareLayer:false,
		layerBanner:'',
    layerLabel:'',
    layerTips:'',
    sex: [
      {
        id: 0,
        name: '男'
      },
      {
        id: 1,
        name: '女'
      },
    ],
    occupation:[],
    isStylist:0,
    headLevel:[],
    stringifysHairServiceResps:'',
    from:'',
    server_text:'',
    startYears: [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025],
  },
  choose_location(){
    const that = this
    wx.chooseLocation({
      success(ress) {
        console.log(ress);
        that.data.man_info.address = ress.address == undefined ? '' : ress.address;
        that.setData({
          man_info: that.data.man_info
        })
        wx.showLoading({
          title: '加载中',
					mask:true
        })
				let para={
					userId: user_id,
					version: version,
					storeNo: that.data.man_info.no == undefined ? '':that.data.man_info.no,
					address: ress.address,
					latitude: ress.latitude,
					longitude: ress.longitude
				}
				util.post(`${updateHairStoreInfo}`,para).then(res=>{
					var code = res.code;
					if (code == 0) {
					  wx.showToast({
					    icon: 'none',
					    title: '修改成功'
					  });
					} else {
            uploadErrorInfoFn(`${updateHairStoreInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
					  let title = "系统通知";
					  let notice = '出错啦';
					  wx.navigateTo({
					  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
					  })
					}
					wx.hideLoading();
				}).catch(error=>{
          uploadErrorInfoFn(`${updateHairStoreInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
					var title = "系统通知";
					var notice = "出错啦";
					wx.navigateTo({
					  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
					})
					wx.hideLoading();
					return;
				})
      }
    })
  },
  startYears(e){
    console.log(e);
    const _this = this;
    this.setData({
      startYear: parseInt(_this.data.startYears[e.detail.value]),
      yeardefault: e.detail.value,
    },()=>{
      wx.showLoading({
        title: '加载中',
				mask:true
      })
			let para={
				userId: user_id,
				version: version,
				workFrom: _this.data.startYears[e.detail.value]
			}
			util.post(`${updateHairStylistInfo}`,para).then(res=>{
				var code = res.code;
				if (code == 0) {
				  wx.showToast({
				    icon: 'none',
				    title: '修改成功'
				  });
				} else {
          uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
				wx.hideLoading();
			}).catch(error=>{
        uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    })
  },
  bindPickerChange(e){
    wx.showLoading({
      title: '加载中...',
			mask:true
    })
    const _this = this;
    let data = _this.data.user_info;
    data.sex = _this.data.sex[e.detail.value].tagLabel == '男' ? 0 : 1;
    data.sexid = _this.data.sex[e.detail.value].tagLabel == '男' ? 0:1;
    console.log(data.sexid);
    _this.setData({
      user_info: data
    },()=>{
      let url = '';
      let urlTitle = '';
      let datas = {
        userId: user_id,
        version: version,
        sex: _this.data.user_info.sexid
      };
      if (_this.data.isStylist == 0) {
        url = updateUserInfo;
        urlTitle = updateUserInfoTitle;
        datas['personId'] = wx.getStorageSync('userInfo').personId
      } else {
        url = updateHairStylistInfo;
        urlTitle = updateHairStylistInfo;
      }
			util.post(`${url}`,datas).then(res=>{
				var code = res.code;
				if (code == 0) {
				  wx.showToast({
				    icon: 'none',
				    title: '修改成功'
				  });
				} else {
          uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datas)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice ='出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
				wx.hideLoading();
			}).catch(error=>{
        uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datas)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    })
  },
  bindPickerChangeoccupation(e){
    const _this = this;
    let data = _this.data.occupationTags;
    data = _this.data.occupation[e.detail.value].tagLabel;
    let datas = _this.data.occupation[e.detail.value].tag;
    _this.setData({
      occupationTags: data
    },()=>{
      wx.showLoading({
        title: '加载中',
				mask:true
      })
      let url = '';
      let urlTitle = '';
      let datass = {
        userId: user_id,
        version: version,
        occupation: datas
      };
      if (_this.data.isStylist == 0) {
        url = updateUserInfo;
        datass['personId'] = wx.getStorageSync('userInfo').personId,
          urlTitle = updateUserInfoTitle;
      } else {
        url = updateHairStylistInfo;
        urlTitle = updateHairStylistInfoTitle;
      }
			util.post(`${url}`,datass).then(res=>{
				var code = res.code;
				if (code == 0) {
				  wx.showToast({
				    icon: 'none',
				    title: '修改成功'
				  });
				} else {
          uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datass)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
				wx.hideLoading();
			}).catch(error=>{
        uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datass)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    })
  },
  bindDateChange(e){
    const _this = this;
    let data = _this.data.user_info;
    data.birthday = e.detail.value;
    _this.setData({
      user_info: data
    },()=>{
      let datestr = new Date(_this.data.user_info.birthday);
      datestr = datestr.getTime();
      wx.showLoading({
        title: '加载中',
				mask:true
      })
      let url = '';
      let urlTitle = '';
      let datas = {
        userId: user_id,
        version: version,
        birthday: datestr
      };
      if (_this.data.isStylist == 0) {
        url = updateUserInfo;
        urlTitle = updateUserInfoTitle;
        datas['personId'] = wx.getStorageSync('userInfo').personId
      } else {
        url = updateHairStylistInfo;
        urlTitle = updateHairStylistInfoTitle;
      }
			util.post(`${url}`,datas).then(res=>{
				var code = res.code;
				if (code == 0) {
				  wx.showToast({
				    icon: 'none',
				    title: '修改成功'
				  });
				} else {
          uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datas)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
				wx.hideLoading();
			}).catch(error=>{
        uploadErrorInfoFn(`${urlTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(datas)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    })
  },
  bindPickerChangeheadLevel(e){
    const _this = this;
    let data = _this.data.headLevelTags;
    data = _this.data.headLevel[e.detail.value].tagLabel;
    let datas = _this.data.headLevel[e.detail.value].tag;
    _this.setData({
      headLevelTags: data
    },()=>{
      wx.showLoading({
        title: '加载中',
				mask:true
      })
			let para={
				userId: user_id,
				version: version,
				level: datas
			}
			util.post(`${updateHairStylistInfo}`,para).then(res=>{
				var code = res.code;
				if (code == 0) {
				  wx.showToast({
				    icon: 'none',
				    title: '修改成功'
				  });
				} else {
          uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
				wx.hideLoading();
			}).catch(error=>{
        uploadErrorInfoFn(`${updateHairStylistInfoTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    })
  },
  sbmt(){
    if (this.data.headLevelTags == null || this.data.headLevelTags == '' || this.data.headLevelTags == undefined ){
      wx.showToast({
        title: '请选择头衔',
        icon:'none'
      })
      return false;
    };
    if (this.data.startYear == null || this.data.startYear == '' || this.data.startYear == undefined ){
      wx.showToast({
        title: '请选择入行年份',
        icon: 'none'
      })
      return false;
    };
    if (this.data.goodAtTags == null || this.data.goodAtTags == '' || this.data.goodAtTags == undefined || this.data.goodAtTags.length == 0 ) {
      wx.showToast({
        title: '请选择特长',
        icon: 'none'
      })
      return false;
    };
    if (this.data.goodStyleTags == null || this.data.goodStyleTags == '' || this.data.goodStyleTags == undefined || this.data.goodStyleTags.length == 0) {
      wx.showToast({
        title: '请选择擅长风格',
        icon: 'none'
      })
      return false;
    };
    if (this.data.telephone == null || this.data.telephone == '' || this.data.telephone == undefined) {
      wx.showToast({
        title: '请填写联系电话',
        icon: 'none'
      })
      return false;
    };
    if (this.data.wechatQrcode == null || this.data.wechatQrcode == '' || this.data.wechatQrcode == undefined) {
      wx.showToast({
        title: '请上传二维码',
        icon: 'none'
      })
      return false;
    };
    if (this.data.start_time == null || this.data.start_time == '' || this.data.start_time == undefined) {
      wx.showToast({
        title: '请选择营业开始时间',
        icon: 'none'
      })
      return false;
    };
    if (this.data.timeEnd == null || this.data.timeEnd == '' || this.data.timeEnd == undefined) {
      wx.showToast({
        title: '请选择营业结束时间',
        icon: 'none'
      })
      return false;
    };
    if (this.data.server_text == null || this.data.server_text == '' || this.data.server_text == undefined) {
      wx.showToast({
        title: '请填写服务价格',
        icon: 'none'
      })
      return false;
    };
    if (this.data.man_info.storeName == null || this.data.man_info.storeName == '' || this.data.man_info.storeName == undefined) {
      wx.showToast({
        title: '请填写商铺信息',
        icon: 'none'
      })
      return false;
    };
    if (this.data.man_info.address == null || this.data.man_info.address == '' || this.data.man_info.address == undefined) {
      wx.showToast({
        title: '请选择地址',
        icon: 'none'
      })
      return false;
    };
    if (this.data.freeServiceTags == null || this.data.freeServiceTags == '' || this.data.freeServiceTags == undefined) {
      wx.showToast({
        title: '请选择服务特色',
        icon: 'none'
      })
      return false;
    };
    const _this = this;
		let para={
			userId: user_id,
			version: version,
		}
		util.post(`${authHairStylist}`,para).then(res=>{
			if (res.code == 0) {
			  if (_this.data.from == 'index' ){
			    wx.switchTab({
			      url: '../index/index',
			    })
			  }else{
			    wx.switchTab({
			      url: '../user/user',
			    })
			  }
			  
			} else {
        uploadErrorInfoFn(`${authHairStylistTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			 let title = "系统通知";
			 let notice = '出错啦';
			 wx.navigateTo({
			 	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			 })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${authHairStylistTitle}`, `event:点击按钮;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  onLoad: function (options) {
		user_id = wx.getStorageSync('userInfo').userId;
    const _this = this;
    wx.setStorageSync('user_type', options.data);
    if (options.avatar ){
      this.setData({
        optionsIcon: options.avatar,
        from:options.from == undefined ? '':options.from
      })
    }
    _this.setData({
      type: wx.getStorageSync('user_type') == 2 ? true : false
    })
		let para={
			userId: user_id,
			version: version,
			tagType: 1
		}
		util.get(`${selectHairTagByTagType}`,para).then(res=>{
			 if (res.code == 0) {
			  _this.setData({
			    sex: res.info.sHairTags
			  })
			} else {
         uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
			 let title = "系统通知";
			 let notice = '出错啦';
			 wx.navigateTo({
			 	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			 })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
		let param = {
			userId: user_id,
			version: version,
			tagType: 11
		}
		util.get(`${selectHairTagByTagType}`,param).then(res=>{
			if (res.code == 0) {
			  _this.setData({
			    occupation:res.info.sHairTags
			  })
			} else {
        uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
			 let title = "系统通知";
			 let notice = '出错啦';
			 wx.navigateTo({
			 	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			 })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
		let params = {
			userId: user_id,
			version: version,
			tagType: 14
		}
		util.get(`${selectHairTagByTagType}`,params).then(res=>{
			if (res.code == 0) {
			  _this.setData({
			    headLevel: res.info.sHairTags
			  })
			} else {
        uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(params)};errorinfo:${JSON.stringify(res)}`);
			  let title = "系统通知";
			  let notice = '出错啦';
			  wx.navigateTo({
			  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			  })
			}
		}).catch(error=>{
      uploadErrorInfoFn(`${selectHairTagByTagTypeTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(params)};errorinfo:${JSON.stringify(error)}`);
			var title = "系统通知";
			var notice = "出错啦";
			wx.navigateTo({
			  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
			})
			wx.hideLoading();
			return;
		})
  },
  onShow(){
    const _this = this;
    if (wx.getStorageSync('user_type') == 0) {
      _this.setData({
        isStylist:0,     
      })
			let para={
				userId: user_id,
				version: version
			}
			util.get(`${selectUserInfoDetail}`,para).then(res=>{
				if (res.code == 0) {
				  let interestTags = res.info.user.interestTags == null || res.info.user.interestTags == undefined ? [] : res.info.user.interestTags;
				  let interestTags_data = interestTags.join('、');
				  let occupationTags = res.info.user.occupationTags == null || res.info.user.occupationTags == undefined ? [] : res.info.user.occupationTags;
				  let occupationTags_data = occupationTags.join('、');
				  if (res.info.user.birthday != null ){
				    res.info.user.birthday = formatTimes(res.info.user.birthday / 1000, 'Y-M-D');
				  }
				  _this.setData({
				    user_info: res.info.user,
				    interestTags: interestTags_data,
				    occupationTags: occupationTags_data,
				  })
				} else {
          uploadErrorInfoFn(`${selectUserInfoDetailTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${selectUserInfoDetailTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(para)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
    } else if (wx.getStorageSync('user_type') == 1) {
      _this.setData({
        isStylist:1,
      })
			let param={
				 userId: user_id,
				version: version
			}
			util.get(`${selectUserInfoWithStylist}`,param).then(res=>{
				if (res.code == 0) {
				  let interestTags = res.info.user.interestTags == null ?[]: res.info.user.interestTags;
				  let interestTags_data = interestTags.join('、');
				  let occupationTags = res.info.user.occupationTags == null ? [] : res.info.user.occupationTags;
				  let occupationTags_data = occupationTags.join('、');
				  let dates = [];
				  let server = '';
				  let goodAtTags_data='';
				  let goodStyleTags_data = '';
				  let headLevelTags_data = '';
				  let datta = '';
				  if (res.info.stylist != undefined ){
				    let goodAtTags = res.info.stylist.goodAtTags == null ? [] : res.info.stylist.goodAtTags;
				    goodAtTags_data = goodAtTags.join('、');
				    let goodStyleTags = res.info.stylist.goodStyleTags == null ? [] : res.info.stylist.goodStyleTags;
				    goodStyleTags_data = goodStyleTags.join('、');
				    let headLevelTags = res.info.stylist.headLevelTags == null ? [] : res.info.stylist.headLevelTags;
				    headLevelTags_data = headLevelTags.join('、');
				    
				    if (res.info.stylist.workDate != null ){
				      let worrr = res.info.stylist.workDate == null ? '' : res.info.stylist.workDate;
				      let date_work = worrr.split(",");
				      date_work.forEach(function (x, y) {
				        if (x == 0) {
				          switch (y) {
				            case 0:
				              dates.push('周一');
				              break;
				            case 1:
				              dates.push('周二');
				              break;
				            case 2:
				              dates.push('周三');
				              break;
				            case 3:
				              dates.push('周四');
				              break;
				            case 4:
				              dates.push('周五');
				              break;
				            case 5:
				              dates.push('周六');
				              break;
				            case 6:
				              dates.push('周日');
				              break;
				          }
				        }
				      });
				      dates = dates.join('、');
				    }
				    if (res.info.stylist.sHairStore != null ){
				      let datta = res.info.stylist.sHairStore.freeServiceTags == null ? [] : res.info.stylist.sHairStore.freeServiceTags;
				      datta = datta.join('、');
				    }
				    if (res.info.stylist.sHairServiceResps != null  ){
				      res.info.stylist.sHairServiceResps.forEach(function (x, y) {
				        let min = x.priceMin;
				        let max = x.priceMax;
				        if (min != null || max != null) {
				          if (server == '' && min != null && max != null) {
				            if (x.priceFlag == 1) {
				              server = x.serviceLabel + ':' + min + '元\n';
				            } else {
				              server = x.serviceLabel + ':' + min + '元-' + max + '元\n';
				            }
				          } else {
				            if (x.priceFlag == 1) {
				              server = server + x.serviceLabel + ':' + min + '元\n';
				            } else {
				              server = server + x.serviceLabel + ':' + min + '元-' + max + '元\n';
				            }
				          }
				        }
				      })
				    }
				  }
				  if (res.info.user.birthday!=null ){
				    res.info.user.birthday = formatTimes(res.info.user.birthday / 1000, 'Y-M-D');
				  }
				  
				  let date_value = 22;
				  _this.data.startYears.forEach(function(x,y){
				    if (x == res.info.stylist.startYear ){
				      date_value = y;
				    }
				  })
				  _this.setData({
				    user_info: res.info.user,
				    interestTags: interestTags_data,
				    occupationTags: occupationTags_data,
				    goodAtTags: goodAtTags_data,
				    goodStyleTags: goodStyleTags_data,
				    headLevelTags: headLevelTags_data,
				    man_info: res.info.stylist == undefined ? '' : res.info.stylist.sHairStore,
				    sHairServiceResps: res.info.stylist == undefined ? '' : res.info.stylist.sHairServiceResps,
				    start_time: res.info.stylist == undefined ? '' : res.info.stylist.timeStart +' - ',
				    startYear: res.info.stylist == undefined ? '' : res.info.stylist.startYear,
				    yeardefault: date_value,
				    telephone: res.info.stylist == undefined ? '':res.info.stylist.telephone,
				    timeEnd: res.info.stylist == undefined ? '': res.info.stylist.timeEnd,
				    wechatQrcode: res.info.stylist == undefined ? '': res.info.stylist.wechatQrcode,
				    workDate: dates,
				    server_text: server,
				    stringifysHairServiceResps: res.info.stylist == undefined ?'':JSON.stringify(res.info.stylist.sHairServiceResps),
				    freeServiceTags:datta
				  })
				} else {
          uploadErrorInfoFn(`${selectUserInfoWithStylistTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(res)}`);
				  let title = "系统通知";
				  let notice = '出错啦';
				  wx.navigateTo({
				  	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				  })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${selectUserInfoWithStylistTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(param)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})

    }else{
      _this.setData({
        isStylist: 2,
      });
      wx.setNavigationBarTitle({
        'title':'发型师认证'
      });
			let params = {
				 userId: user_id,
				version: version
			}
			util.get(`${selectStylistAuthInfo}`,params).then(res=>{
				if (res.code == 0) {
				  let interestTags_data = '';
				  if (res.info.interestTags != null && res.info.interestTags!=undefined ){
				    let interestTags = res.info.interestTags;
				    interestTags_data = interestTags.join('、');
				  }
				  let occupationTags_data = '';
				  if (res.info.occupationTags != null && res.info.occupationTags !=undefined ){
				    let occupationTags = res.info.occupationTags;
				    occupationTags_data = occupationTags.join('、');
				  };
				  let dates = [];
				  let server = '';
				  let goodAtTags_data = '';
				  let goodStyleTags_data = '';
				  let headLevelTags_data = '';
				  if (res.info.goodAtTags != null && res.info.goodAtTags != undefined ){
				    let goodAtTags = res.info.goodAtTags;
				    goodAtTags_data = goodAtTags.join('、');
				  }
				  if (res.info.goodStyleTags != null && res.info.goodStyleTags != undefined ){
				    let goodStyleTags = res.info.goodStyleTags;
				    goodStyleTags_data = goodStyleTags.join('、');
				  }
				  if (res.info.headLevelTags != null && res.info.headLevelTags != undefined ){
				    let headLevelTags = res.info.headLevelTags;
				    headLevelTags_data = headLevelTags.join('、');
				  };
				  let datta = '';
				  if (res.info.workDate != null && res.info.workDate != undefined && res.info.workDate != '' ){
				    let date_work = res.info.workDate.split(",");
				    date_work.forEach(function (x, y) {
				      if (x == 0) {
				        switch (y) {
				          case 0:
				            dates.push('周一');
				            break;
				          case 1:
				            dates.push('周二');
				            break;
				          case 2:
				            dates.push('周三');
				            break;
				          case 3:
				            dates.push('周四');
				            break;
				          case 4:
				            dates.push('周五');
				            break;
				          case 5:
				            dates.push('周六');
				            break;
				          case 6:
				            dates.push('周日');
				            break;
				        }
				      }
				    });
				    dates = dates.join('、');
				  }
				  if (res.info.sHairStore != null && res.info.sHairStore != undefined ){
				    datta = res.info.sHairStore.freeServiceTags;
				    datta = datta.join('、');
				  }
				  if (res.info.sHairServiceResps !=null && res.info.sHairServiceResps != undefined ){
				    res.info.sHairServiceResps.forEach(function (x, y) {
				      let min = x.priceMin;
				      let max = x.priceMax;
				      if (min != null || max != null) {
				        if (server == '') {
				          if (x.priceFlag == 1) {
				            server = x.serviceLabel + ':' + min + '元\n';
				          } else {
				            server = x.serviceLabel + ':' + min + '元-' + max + '元\n';
				          }
				        } else {
				          if (x.priceFlag == 1) {
				            server = server + x.serviceLabel + ':' + min + '元\n';
				          } else {
				            server = server + x.serviceLabel + ':' + min + '元-' + max + '元\n';
				          }
				        }
				      }
				
				    })
				  }
				  res.info.birthday = formatTimes(res.info.birthday / 1000, 'Y-M-D');
				  let date_value = 22;
				  _this.data.startYears.forEach(function (x, y) {
				    if (x == res.data.info.startYear) {
				      date_value = y;
				    }
				  })
				  _this.setData({
				    user_info: res.info,
				    interestTags: interestTags_data,
				    occupationTags: occupationTags_data,
				    goodAtTags: goodAtTags_data,
				    goodStyleTags: goodStyleTags_data,
				    headLevelTags: headLevelTags_data,
				    man_info: res.info.sHairStore == null ? {} : res.info.sHairStore,
				    sHairServiceResps: res.info.sHairServiceResps,
				    start_time: res.info.timeStart == null || res.info.timeStart == '' ?'':  res.info.timeStart+' - ',
				    startYear: res.info.startYear == null || res.info.startYear == '' ? '' : res.info.startYear,
				    yeardefault: date_value,
				    telephone: res.info.telephone == undefined ? '' : res.info.telephone,
				    timeEnd: res.info.timeStart == null ? '':res.data.info.timeEnd,
				    wechatQrcode: res.info.wechatQrcode == undefined ? '' : res.info.wechatQrcode,
				    workDate: dates,
				    server_text: server,
				    stringifysHairServiceResps: JSON.stringify(res.info.sHairServiceResps),
				    freeServiceTags: datta
				  })
				} else {
          uploadErrorInfoFn(`${selectStylistAuthInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(params)};errorinfo:${JSON.stringify(res)}`);
				 let title = "系统通知";
				 let notice = '出错啦';
				 wx.navigateTo({
				 	url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				 })
				}
			}).catch(error=>{
        uploadErrorInfoFn(`${selectStylistAuthInfoTitle}`, `event:进入页面请求;requestParameters:${JSON.stringify(params)};errorinfo:${JSON.stringify(error)}`);
				var title = "系统通知";
				var notice = "出错啦";
				wx.navigateTo({
				  url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
				})
				wx.hideLoading();
				return;
			})
  
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
    if (storageShareInfo.otherFlag == '1' ){
      shareImageUrl = storageShareInfo.otherPicture;
    }else{
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