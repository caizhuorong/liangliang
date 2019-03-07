
const getQRCode = require('../config.js').getQRCode;
const smallProgramNo = require('../config.js').smallProgramNo;
const getStarName = require('../config.js').getStarName;
var canvasToImg = {
  bindNoClose: function () {

  },
  bindToCanvas2: function (use, faceUrl, hairUrl, sex) {
    var that = this;
    var para = {
      sex: sex
    }
    wx.showLoading({
      title: '加载中',
			mask:true
    })
    wx.request({
      url: getStarName,
      data: para,
      method: "GET",
      success: function (res) {
        console.log(res);
        var starName = res.data.info.starName;
        that.setData({
          starName: starName,
          isCanvas: true
        });
        that.drawCanvasNextOne(use, faceUrl, hairUrl, sex);
      },
      fail: function () {
        wx.navigateTo({
          url: '../error/error',
        })
      }
    })



  },
  drawCanvasNextOne: function (use, faceUrl, hairUrl, sex) {
    var standardPixelRatio = this.data.standardPixelRatio;
    var rate = this.data.rate;
    var that = this;
    var ctx = wx.createCanvasContext('myCanvas');

    var ctx = wx.createCanvasContext('myCanvas')
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, 720, 1168)
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, 720, 1168)
    ctx.clearRect(0, 0, 720, 1168)
    ctx.draw();

    this.drawRect(ctx, '#fff', 0, 0, 720, 1168);
    this.drawImg(ctx, 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/hair_save_bg.png', 0, 0, 720, 1168);
    if (sex == "0") {
      this.drawFont(ctx, "skrskr~有了这个发型，" + this.data.starName + "也得给我pass，", '#3F3F3F', 32, 'left', 55, 48 + 20, 605);
      this.drawFont(ctx, "不信你试试", '#3F3F3F', 32, 'left', 55, 48 + 60 + 20, 605);
    } else {
      this.drawFont(ctx, "原来我和" + this.data.starName + "的区别只是一个发型！谁都", '#3F3F3F', 32, 'left', 55, 48 + 20, 605);
      this.drawFont(ctx, "别拦我！我美我先剪！", '#3F3F3F', 32, 'left', 55, 48 + 60 + 20, 605);
    }


    this.drawFont(ctx, "长按小程序码", '#3F3F3F', 28, 'left', 271, 1028 + 20, 247);
    this.drawFont(ctx, '进入"量量发型设计"', '#3F3F3F', 28, 'left', 271, 1028 + 70, 247);

    ctx.restore();
    //画网络图片
    //加载网络图片
    //下载脸头像
    var curIndex = this.data.curIndex;

    var faceUrl = faceUrl;
    var hairUrl = hairUrl;
    // var faceUrl = this.data.styleDesignImgFace;
    // var hairUrl = this.data.styleDesignImgHair;
    var para = {
      smallProgramNo: smallProgramNo,
      scene: that.data.userInfo.userId,
			userId:user_id,
			version: version,
    }
    //请求二维码
    wx.request({
      url: getQRCode,
      data: para,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var code = res.data.code;
        if (code == 0) {
          var url = res.data.info.qrcode;

          wx.downloadFile({
            url: url,
            success: function (res3) {
              if (res3.tempFilePath) {
                console.log(res3.tempFilePath);
                that.drawImg(ctx, res3.tempFilePath, 62, 977, 167, 170);
                ctx.restore();
                //判断faceUrl是不是本地缓存的
                if (faceUrl.indexOf("https") > -1) {
                  wx.downloadFile({
                    url: faceUrl,
                    success: function (res) {
                      if (res.tempFilePath) {
                        that.drawImg(ctx, res.tempFilePath, 0, 175, 720, 720);
                        ctx.restore();

                        that.drawCanvasNext(ctx, hairUrl, use);
                      } else {
                        wx.hideLoading();
                        that.setData({
                          goNextPage: "error",
                        });
                        wx.navigateTo({
                          url: '../error/error',
                        })
                      }
                    }
                  })
                } else {
                  that.drawImg(ctx, faceUrl, 0, 175, 720, 720);
                  that.drawCanvasNext(ctx, hairUrl, use);
                }

              } else {
                wx.hideLoading();
                let title = "系统通知";
    let notice = '出错啦';
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })

              }
            },
            fail: function () {
              wx.hideLoading();
              that.setData({
                goNextPage: "error",
              });
              let title = "系统通知";
    let notice = '出错啦';
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })

            }
          })
        } else {
          wx.hideLoading();
           let title = "系统通知";
    let notice = '出错啦';
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })

        }
      },
      fail: function () {
        wx.hideLoading();
        that.setData({
          goNextPage: "error",
        });
         let title = "系统通知";
    let notice = '出错啦';
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })

      }

    })
    this.setData({
      isShare: false
    });
  },
  drawCanvasNext: function (ctx, hairUrl, use) {
    var that = this;
    var standardPixelRatio = this.data.standardPixelRatio;
    var rate = this.data.rate;

    if (hairUrl && hairUrl.length > 0) {
      wx.downloadFile({
        url: hairUrl,
        success: function (res2) {
          if (res2.tempFilePath) {
            console.log(res2.tempFilePath);
            that.drawImg(ctx, res2.tempFilePath, 0, 175, 720, 720);
            ctx.restore();
            that.drawCanvasNext3(ctx, standardPixelRatio, rate, use);

          } else {
            wx.hideLoading();
            that.setData({
              goNextPage: "error",
            });
            let title = "系统通知";
    let notice = '出错啦';
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })

          }
        },
        fail: function () {
          wx.hideLoading();
          that.setData({
            goNextPage: "error",
          });
          let title = "系统通知";
    let notice = '出错啦';
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })

        }
      });
    } else {
      that.drawCanvasNext3(ctx, standardPixelRatio, rate, use);
    }

  },
  drawCanvasNext3: function (ctx, standardPixelRatio, rate, use) {
    var that = this;
    //画印章
    that.drawImg(ctx, 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img/hair_save_pic.png', 528, 124, 183, 183);
    //设置旋转的字
    var nowDate = new Date();
    var year = nowDate.getFullYear().toString().substring(2, 4);
    var month = (nowDate.getMonth() + 1).toString();
    month = month.length <= 1 ? "0" + month : month;
    var day = nowDate.getDate().toString();
    day = day.length <= 1 ? "0" + day : day;
    ctx.save();
    ctx.translate(606 / standardPixelRatio * rate, (231 + 50) / standardPixelRatio * rate); //设置画布上的(0,0)位置，也就是旋转的中心点
    ctx.rotate(-30 * Math.PI / 180);
    ctx.setFillStyle('#05C4F0');
    ctx.setFontSize(22 / standardPixelRatio * rate);
    ctx.fillText(year + "." + month + "." + day, 0, 0);
    ctx.draw(true, that.getTempFilePath);
  },
  getTempFilePath: function () {
    this.canvasToImg();
  },
  canvasToImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 720,
      height: 1168,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res.tempFilePath);
        that.setData({
          shareImgUrl: res.tempFilePath,
          isShare: true,
          isCanvas: false
        });
        // wx.saveFile({
        //   tempFilePath: res2.tempFilePath,
        //   success: function (res) {
        //     var savedFilePath = res.savedFilePath;

        //   }
        // })
        // if (use == "save") {

        // } else {
        //   callBackShare(that, res.tempFilePath);
        // }



        wx.hideLoading();
      },
      fail: function () {
        wx.hideLoading();
        that.setData({
          goNextPage: "error",
        });
        let title = "系统通知";
    let notice = '出错啦';
    wx.navigateTo({
      url: '../../other_pages/error/error?title=' + title + "&notice=" + notice,
    })

      }
    })
  },
  saveImageToPhotosAlbum: function () {
    var that = this;
    var shareImgUrl = this.data.shareImgUrl;
    // that.saveImageToPhotosAlbum();

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          //用户已经授权过
          //调用saveImageToPhotosAlbum
          that.saveImageToPhotosAlbum2(shareImgUrl);

        } else {
          // //用户没有授权过 
          //用户没有授权过 
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success(res) {
              that.setData({
                showCameraDialog: false
              });
              //调用saveImageToPhotosAlbum
              that.saveImageToPhotosAlbum2(shareImgUrl);
            },
            fail() {
              that.setData({
                showCameraDialog: true
              });
            }
          })


          // wx.showModal({
          //   title: '提示',
          //   content: '我们希望获取保存图片到相册权限。',
          //   showCancel: false,
          //   confirmText: '去设置',
          //   success: res => {
          //     if (res.confirm) {
          //       wx.authorize({
          //         scope: 'scope.writePhotosAlbum',
          //         success(res) {
          //           console.log('保存图片授权成功')
          //           //调用saveImageToPhotosAlbum
          //           that.saveImageToPhotosAlbum2(shareImgUrl);
          //         },
          //         fail() {
          //           setTimeout(function () {
          //             wx.openSetting({
          //               success: (res) => {
          //                 if (res.authSetting['scope.writePhotosAlbum']) {
          //                   //调用saveImageToPhotosAlbum
          //                   that.saveImageToPhotosAlbum2(shareImgUrl);
          //                 }
          //               }
          //             })
          //           }, 300);
          //         }
          //       })
          //     }
          //   }
          // })
        }
      }
    })

  },
  //用户点击了“去设置”
  openSetting: function (e) {
    var that = this;
    console.log(e.detail.authSetting.camera);

    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      that.setData({
        showCameraDialog: false
      });
      //调用saveImageToPhotosAlbum
      that.saveImageToPhotosAlbum2(that.data.shareImgUrl);
    } else {
      that.setData({
        showCameraDialog: true
      });
    }

  },
  saveImageToPhotosAlbum2: function (shareImgUrl) {
    var that = this;
    wx.saveImageToPhotosAlbum({
      filePath: shareImgUrl,
      success: function () {
        that.setData({
          // isCanvas: false
        });
        wx.showModal({
          title: '海报已保存至系统相册',
          content: '快分享给好友，让小伙伴们一起来体验吧！',
          showCancel: false,
          confirmText: "知道了",
          confirmColor: "#05C4F0"
        })
      },
      fail: function () {
        wx.showModal({
          title: '',
          content: '保存失败',
          showCancel: false,
          confirmText: "知道了",
          confirmColor: "#05C4F0"
        })
      }
    })
  },
  drawRect: function (ctx, fillColor, x, y, width, height) { //fillRect:x, y, width, height
    var standardPixelRatio = parseInt(this.data.standardPixelRatio);
    var rate = this.data.rate;
    ctx.setFillStyle(fillColor);
    ctx.fillRect(x / standardPixelRatio * rate, y / standardPixelRatio * rate, width / standardPixelRatio * rate, height / standardPixelRatio * rate);
  },
  drawFont: function (ctx, context, fontColor, fontSize, textAlign, x, y, maxWidth) {
    //fontPosition:x,y
    var standardPixelRatio = this.data.standardPixelRatio;
    var rate = this.data.rate;
    ctx.setFillStyle(fontColor) // 文字颜色：黑色
    ctx.setFontSize(fontSize / standardPixelRatio * rate)
    ctx.setTextAlign(textAlign)
    ctx.fillText(context, x / standardPixelRatio * rate, y / standardPixelRatio * rate, maxWidth / standardPixelRatio * rate);
    ctx.stroke();
  },
  drawLine: function (ctx, lineWidth, color, beginX, beginY, toX, toY) {
    var standardPixelRatio = this.data.standardPixelRatio;
    var rate = this.data.rate;
    ctx.beginPath();
    ctx.setStrokeStyle(color);
    ctx.setLineWidth(lineWidth / standardPixelRatio * rate);

    ctx.moveTo(beginX / standardPixelRatio * rate, beginY / standardPixelRatio * rate);
    ctx.lineTo(toX / standardPixelRatio * rate, toY / standardPixelRatio * rate);
    ctx.stroke();
  },
  drawImg: function (ctx, imgUrl, x, y, width, height) {
    //imgPosition:x,y,width,height
    var standardPixelRatio = this.data.standardPixelRatio;
    var rate = this.data.rate;
    ctx.drawImage(imgUrl, x / standardPixelRatio * rate, y / standardPixelRatio * rate, width / standardPixelRatio * rate, height / standardPixelRatio * rate)
    ctx.stroke();
  },
  bindClose: function () {

    this.setData({
      isShare: false
    });
  }
}
module.exports = canvasToImg;