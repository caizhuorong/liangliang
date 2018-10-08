/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la


// var host = "https://smallprogram.lianglianglive.com/smallprogram";//生产环境

// var host = "https://panda.lianglianglive.com/smallprogram";//开发环境
// var host = "https://smallprogram.lianglianglive.com/smallprogram_test";//准生产环境
const host = "http://172.168.1.101:8080/hairstyle";

var imgUrl = 'https://headimg.lianglianglive.com/body-style/';
const smallProgramNo = 2;
const organizationNo = 1;
var config = {
  // 下面的地址配合云端 Server 工作
  host,
  imgUrl,
  smallProgramNo,
  organizationNo,
  version: 'v2.0.0_test',
  user_id:'5621dfb6c93328018c7cb2d2ff70f4dc',
  // 登录，获取用户信息
  login: `${host}/user/getUserInfo`,
  // scene
  insertScanHistory: `${host}/user/insertScanHistory`,
  // 轮播图
  getCarouselList: `${host}/face/getCarouselList`,
  //获取关注列表
  selectFollowedProductionAndHairTemplate: `${host}/square/selectFollowedProductionAndHairTemplate`,
  //获取发型师列表
  selectUserStylistList:`${host}/stylistManage/selectUserStylistList`,    
  //关注发型师
  addFollow: `${host}/stylistManage/addFollow`,
  //广场推荐筛选结果取得
  getHairTemplateTagList:`${host}/tag/getHairTemplateTagList`,
  //广场推荐
  selectCommendHairTemplate:`${host}/square/selectCommendHairTemplate`,
  //广场筛选结果取得
  selectRequiredHairTemplateList: `${host}/square/selectRequiredHairTemplateList`,
  //发型师详情
  selectHairStyleInfo: `${host}/stylistManage/selectHairStyleInfo`,
  //发型师关注
  addFollow: `${host}/stylistManage/addFollow`,
  //发型师取消关注
  deleteFollow: `${host}/stylistManage/deleteFollow`,
  //发型收藏
  addFavorite:`${host}/stylistManage/addFavorite`,
  //发型取消收藏
  deleteFavorite: `${host}/stylistManage/deleteFavorite`,
  //发型点赞
  addPraise: `${host}/stylistManage/addPraise`,
  //发型取消点赞
  deletePraise: `${host}/stylistManage/deletePraise`,
  //我也能剪
  claimHair: `${host}/stylistManage/claimHair`,
//上传脸部照片的路径
  uploadFaceFile: `${host}/hairStyle/uploadFaceFile`,
  
//上传脸部照片的路径
  getHairList: `${host}/hair/getHairList`,
  

//融脸接口
  faceSwap: `${host}/hair/faceSwap`,
  
//历史记录融脸接口
  reFaceSwap: `${host}/face/reFaceSwap`,
  
  
//去的发色
  dyeHair: `${host}/hair/dyeHair`,
  
//取得发屋
  getHairListBySex: `${host}/hair/getHairListBySex`,
//取得脸型发型关联一览
  getFaceHairTemplateList: `${host}/face/getFaceHairTemplateList`,
//取得历史记录一览接口
  getHairHistoryList: `${host}/hair/getHairHistoryList`,
  

//收藏
  addHairHistory: `${host}/hair/addHairHistory`,
  
//取消收藏
  deleteHairHistory: `${host}/hair/deleteHairHistory`,
  
//历史记录查看
  getMeasureResultHair: `${host}/measure/getMeasureResultHair`,
  
//分享取得二维码图片
  getQRCode: `${host}/wechat/getQRCode`,
  
//使用头发模板
  useThisHairTemplate: `${host}/hair/useThisHairTemplate`,
  
//请求明星名字
  getStarName: `${host}/hair/getStarName`,
  
//请求系统通知
  getSystemNotice: `${host}/user/getSystemNotice`,


  /*
   wx.request({
      url: historyData,
      data: para,
      success: function (res) {
      }
    })
  wx.request({
      url: deleteHistoryData,
      
      data: para,
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
      }
    })
  */
};

module.exports = config
