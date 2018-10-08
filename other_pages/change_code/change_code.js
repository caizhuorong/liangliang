// pages/change_like/change_like.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1:0,
    value2: 0,
    value3: 0,
    value4: 0,
    value5: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  upload(){
    wx.chooseImage({ 
      count: 1, // 默认9      
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有      
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有      
      success: function (res) {        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片        
        var tempFilePaths = res.tempFilePaths;        
        wx.uploadFile({          
          url: 'https://...',      //此处换上你的接口地址          
          filePath: tempFilePaths[0],          
          name: 'img',          
          header: {              
            "Content-Type": "multipart/form-data",            
            'accept': 'application/json',            
          },          
          formData:{	    
            'user':'test' //其他额外的formdata，可不写          
          },          
          success: function(res){            
            var data=res.data;	    
            console.log('data');          
          },          
          fail: function(res){            
            console.log('fail');           
          },        
        })      
      }
    })  
  },
  btn(){
    const _this = this;
   
  },
})