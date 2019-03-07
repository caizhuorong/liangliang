/**
 * 小程序配置文件
 */
var imgUrl = 'https://headimg.lianglianglive.com/body-style/';
let env =0;
let host = "https://panda.lianglianglive.com/hairstyle";//开发环境
let h5Active = 'https://panda.lianglianglive.com/'; //开发环境
if (env == 1) {
  host = "https://service.lianglianglive.com/hairstyle";//生产环境
  h5Active = 'https://otherservice.lianglianglive.com/'; //生产环境
}
const smallProgramNo = 3;
const organizationNo = 1;
var config = {
  // 下面的地址配合云端 Server 工作
  host,
  imgUrl,
  // h5Active:'https://otherservice.lianglianglive.com/',
  h5Active: h5Active,
  smallProgramNo:3,
  organizationNo:1,
  faceDetectCounts:8,
	//非特定分享页
	nonspecificSharePage:['绝了！海量发型等你来试，不好看算我输', '这可能是本世纪zui好用的换发神器','你有多久没有好好打理你的头发了','对不起，让你久等了'],
  friendSharePage: ['Help me!我发现了一款很适合我的发型，需要你帮我点击解锁', '掐指一算，你需要一款新发型来冲冲喜了', '只有长得好看的人才能收到的神秘邀请', '有了TA，你就离人生巅峰不远了','没带眼镜做头发的后果。。。笑cry'],
  friendSharePageImg: ['https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/all_share_new_5.png', 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/all_share_new_2.png', 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/all_share_new_3.png', 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/all_share_new_2.png', 'https://faceshapetemplate.lianglianglive.com/file/fixed/hair2/img_new/all_share_new_4.png'],
  AiSharePage: ['高能黑科技！是我见过最专业的脸型分析了，一起来试试！','来PK吗？颜值高的请客'],
  changeHairSharePage: ['有了这款发型，这次还不让我C位出道！', '来battle啊！我就不信你用这个发型比我好看','我剪这款发型你觉得咋样？'],
	hairMan:['你还没有来找我，只是因为你还不认识我！安排！','不推销不办卡！用作品说话！试过的都说好'],
  version: 'v1.5.2',
  user_id: wx.getStorageSync('userInfo').userId,
  // 登录，获取用户信息
  login: `${host}/wechat/getUserInfo`,
  loginTitle: `getUserInfo接口出错`,
  //得到支付的订单信息
  getWechatPayOrder: `${host}/wechat/getWechatPayOrder`,
  getWechatPayOrderTitle: `订单信息取得出错`,
  //取得融脸次数信息
  getCountInfo: `${host}/hairStyle/getCountInfo`,
  getCountInfoTitle: `剩余融脸次数信息取得出错`,
  //取得AI分析结果
  getAnalyzeResult: `${host}/hairStyle/getAnalyzeResult`,
  getAnalyzeResultTitle: `取得AI分析结果出错`,
  //发型师认证按钮
  authHairStylist: `${host}/mine/authHairStylist`,
  authHairStylistTitle: `发型师认证出错`,
  //发型师认证信息取得
  selectStylistAuthInfo: `${host}/mine/selectStylistAuthInfo`,
  selectStylistAuthInfoTitle: `发型师认证信息取得出错`,
  //分析推荐
  faceAnalyze: `${host}/hairStyle/faceAnalyze`,
  faceAnalyzeTitle: `人脸分析发型推荐出错`,
  //分享到群
  insertShareInfo: `${host}/wechat/insertShareInfo`,
  //取消我也能剪
  refuseHair: `${host}/stylistManage/refuseHair`,
  refuseHairTitle: `取消【我也能剪】出错`,
  //小程序二维码生成
  getQRCode: `${host}/wechat/getQRCode`,
  getQRCodeTitle: `小程序二维码生成出错`,
  //设计师微信二维码上传
  uploadWeChatQRCodeFile: `${host}/mine/uploadWeChatQRCodeFile`,
  uploadWeChatQRCodeFileTitle: `设计师微信二维码上传出错`,
  //发型师店铺信息修改
  updateHairStoreInfo: `${host}/mine/updateHairStoreInfo`,
  updateHairStoreInfoTitle: `发型师店铺信息修改出错`,
  //发型师服务项目价格信息修改
  updateHairServiceInfo: `${host}/mine/updateHairServiceInfo`,
  //发型师信息修改
  updateHairStylistInfo: `${host}/mine/updateHairStylistInfo`,
  updateHairStylistInfoTitle: `发型师信息修改出错`,
  //普通用户信息修改
  updateUserInfo: `${host}/mine/updateUserInfo`,
  updateUserInfoTitle: `普通用户信息修改出错`,
  //普通用户头像上传
  uploadUserHeadImgFile: `${host}/mine/uploadUserHeadImgFile`,
  uploadUserHeadImgFileTitle: `普通用户头像上传出错`,
  //根据标签类别，取得该类别的标签一览
  selectHairTagByTagType: `${host}/mine/selectHairTagByTagType`,
  selectHairTagByTagTypeTitle: `根据标签类别，取得该列别标签一览出错`,
  //我的页面情报取得
  selectMinePageContents: `${host}/mine/selectMinePageContents`,
  selectMinePageContentsTitle: `我的页面情报取得出错`,
  //用户情报基本信息取得
  selectUserInfoDetail: `${host}/mine/selectUserInfoDetail`,
  selectUserInfoDetailTitle: `用户情报基本信息取得出错`,
  //理发师信息取得+用户情报
  selectUserInfoWithStylist: `${host}/mine/selectUserInfoWithStylist`,
  selectUserInfoWithStylistTitle: `理发师信息取得+用户情报出错`,
  //头像上传
  uploadStylistHeadImgFile: `${host}/mine/uploadStylistHeadImgFile`,
  uploadStylistHeadImgFileTitle: `发型师头像上传出错`,
  //获取关注列表
  selectFollowedProductionAndHairTemplate: `${host}/square/selectFollowedProductionAndHairTemplate`,
  selectFollowedProductionAndHairTemplateTitle: `关注模板列表取得出错`,
  //获取发型师列表
  selectUserStylistList: `${host}/stylistManage/selectUserStylistList`,
  selectUserStylistListTitle: `发型师列表取得出错`,
  //获取待关注者一览
  selectFollowUserList: `${host}/stylistManage/selectFollowUserList`,
  selectFollowUserListTitle: `待关注者一览取得出错`,
  //关注发型师
  //广场推荐筛选结果取得
  getHairTemplateTagList: `${host}/tag/getHairTemplateTagList`,
  getHairTemplateTagListTitle: `广场推荐筛选结果取得出错`,
  //广场推荐
  selectCommendHairTemplate: `${host}/square/selectCommendHairTemplate`,
  selectCommendHairTemplateTitle: `广场推荐出错`,
  //广场筛选结果
  selectRequiredTemplateList: `${host}/square/selectRequiredTemplateList`,
  selectRequiredTemplateListTitle: `广场筛选结果出错`,
  //广场自定义筛选结果
  selectNewestTemplate: `${host}/square/selectNewestTemplate`,
  selectNewestTemplateTitle: `最新发型取得出错`,
  //广场筛选结果取得
  selectRequiredHairTemplateList: `${host}/square/selectRequiredHairTemplateList`,
  selectRequiredHairTemplateListTitle: `广场筛选结果取得出错`,
  //发型详情
  selectHairStyleInfo: `${host}/stylistManage/selectHairStyleInfo`,
  selectHairStyleInfoTitle: `发型详情取得出错`,
  //统计用户使用过的模板数
  countFaceSwap: `${host}/hairStyle/countFaceSwap`,
  countFaceSwapTitle: `统计用户使用过的模板数出错`,
  //发型师关注
  addFollow: `${host}/stylistManage/addFollow`,
  addFollowTitle: `发型师关注出错`,
  //发型师取消关注
  deleteFollow: `${host}/stylistManage/deleteFollow`,
  deleteFollowTitle: `发型师取消关注出错`,
  //发型收藏
  addFavorite: `${host}/stylistManage/addFavorite`,
  addFavoriteTitle: `发型收藏出错`,
  //发型取消收藏
  deleteFavorite: `${host}/stylistManage/deleteFavorite`,
  deleteFavoriteTitle: `发型取消收藏出错`,
  //发型点赞
  addPraise: `${host}/stylistManage/addPraise`,
  addPraiseTitle: `发型点赞出错`,
  //发型取消点赞
  deletePraise: `${host}/stylistManage/deletePraise`,
  deletePraiseTitle: `发型取消点赞出错`,
  //我也能剪
  claimHair: `${host}/stylistManage/claimHair`,
  claimHairTitle: `【我也能剪】出错`,
  //上传脸部照片的路径
  uploadFaceFile: `${host}/hairStyle/uploadFaceFile`,
  uploadFaceFileTitle: `上传脸部照片出错`,
  //取得模板发型对应的发型师列表
  getHairStylist: `${host}/hairStyle/getHairStylist`,
  getHairStylistTitle: `取得模板发型对应的发型师列表出错`,
  //上传脸部照片的路径
  getHairList: `${host}/hair/getHairList`,
  getHairListTitle: `上传脸部照片出错`,
  //发型师详情
  selectStylistInfo: `${host}/stylistManage/selectStylistInfo`,
  selectStylistInfoTitle: `发型师详情取得出错`,
  //用户详情
  selectUserInfo: `${host}/stylistManage/selectUserInfo`,
  selectUserInfoTitle: `用户详情取得出错`,
  //作品上传(封面)
  uploadProductionCoverFile: `${host}/product/uploadProductionCoverFile`,
  uploadProductionCoverFileTitle: `作品上传(封面)出错`,
  //作品上传(封面以外)
  uploadProductionFiles: `${host}/product/uploadProductionFiles`,
  uploadProductionFilesTitle: `作品上传(封面以外)出错`,
  //广场发现发型和作品一览取得
  selectDiscoveryList: `${host}/square/selectDiscoveryList`,
  selectDiscoveryListTitle: `广场发现发型和作品一览取得出错`,
  //广场的发现页面的发型和作品筛选一览取得
  selectRequiredDiscoveryList: `${host}/square/selectRequiredDiscoveryList`,
  selectRequiredDiscoveryListTitle: `广场的发现页面的发型和作品筛选一览取得出错`,
  //我想试发
  addProductionToTemplate: `${host}/stylistManage/addProductionToTemplate`,
  addProductionToTemplateTitle: `我想试发出错`,
  //删除我想试发
  deleteProductionToTemplate: `${host}/stylistManage/deleteProductionToTemplate`,
  deleteProductionToTemplateTitle: `删除我想试发出错`,
  //融脸接口
  faceSwap: `${host}/hairStyle/faceSwap`,
  faceSwapTitle: `融脸接口出错`,
  //动态取得发型tabs
  getHairTypeTabs: `${host}/hairStyle/getHairTypeTabsNew2`,
  getHairTypeTabsTitle: `获取发型tab出错`,
  //取得发型模板列表
  getHairTemplateList: `${host}/hairStyle/getHairTemplateListNew`,
  getHairTemplateListTitle:`获取发型模板列表出错`,
  //主页情报取得
  selectHomepageContents: `${host}/homepage/selectHomepageContents`,
  selectHomepageContentsTitle: `主页情报取得出错`,
  // //历史记录融脸接口
  // reFaceSwap: `${host}/face/reFaceSwap`,
  // reFaceSwapTitle: `历史记录融脸接口出错`, ？？？？？？？？？？？？
  //去的发色
  dyeHair: `${host}/hairStyle/dyeHair`,
  dyeHairTitle: `设计发色出错`,
  //取得发色列表
  getHairColorList: `${host}/hairStyle/getHairColorList`,
  getHairColorListTitle: `取得发色列表出错`,
  //在发型设计页面收藏融合后的发型
  addHairStyleFavorite: `${host}/hairStyle/addHairStyleFavorite`,
  addHairStyleFavoriteTitle: `在发型设计页面收藏融合后的发型出错`,
  //取消收藏融合后的发型
  delHairStyleFavorite: `${host}/hairStyle/delHairStyleFavorite`,
  delHairStyleFavoriteTitle: `取消收藏融合后的发型出错`,
  //晒过的发型
  selectMyUploadHairList: `${host}/mine/selectMyUploadHairList`,
  selectMyUploadHairListTitle: `晒过的发型取得出错`,
  //收藏的发型
  selectMyFavoriteHairList: `${host}/mine/selectMyFavoriteHairList`,
  selectMyFavoriteHairListTitle: `收藏的发型模板取得出错`,
  //尝试过的发型
  selectMyFavoriteStyleList: `${host}/mine/selectMyFavoriteStyleList`,
  selectMyFavoriteStyleListTitle: `尝试过的发型取得出错`,
  //邀请好友画面情报取得
  selectInvitationUserContents: `${host}/homepage/selectInvitationUserContents`,
  selectInvitationUserContentsTitle: `邀请好友画面情报取得出错`,
  //邀请好友列表
  selectInvitationUserList: `${host}/homepage/selectInvitationUserList`,
  selectInvitationUserListTitle: `邀请好友列表出错`,
  // //取得脸型发型关联一览
  // getFaceHairTemplateList: `${host}/face/getFaceHairTemplateList`,
  // getFaceHairTemplateListTitle: `取得脸型发型关联一览出错`, ？？？？？？？？？？？？？？？？？？
  //取得历史记录一览接口
  getHairHistoryList: `${host}/hair/getHairHistoryList`,
  getHairHistoryListTitle: `取得历史记录一览接口出错`,
  //意见反馈
  insertRoast: `${host}/mine/insertRoast`,
  insertRoastTitle: `意见反馈出错`,
  // //收藏
  // addHairHistory: `${host}/hair/addHairHistory`, ？？？？？？？？？？？？？？？？？？
  // addHairHistoryTitle: `收藏出错`,
  // //取消收藏
  // deleteHairHistory: `${host}/hair/deleteHairHistory`,
  // deleteHairHistoryTitle: `取消收藏出错`,
  // //历史记录查看
  // getMeasureResultHair: `${host}/measure/getMeasureResultHair`,
  // getMeasureResultHairTitle: `历史记录查看出错`, ？？？？？？？？？？？？？？？？？？
  //分享取得二维码图片
  getQRCode: `${host}/wechat/getQRCode`,
  getQRCodeTitle: `小程序二维码取得出错`,
  // //使用头发模板
  // useThisHairTemplate: `${host}/hair/useThisHairTemplate`,
  // useThisHairTemplateTitle: `使用头发模板出错`, ？？？？？？？？？？？？？？？？？？
  //请求明星名字
  getStarName: `${host}/hair/getStarName`,
  getStarNameTitle: `请求明星名字出错`,
  //请求系统通知
  getSystemNotice: `${host}/homepage/getSystemNotice`,
  getSystemNoticeTitle: '系统状态取得出错',
  //用户关注一览取得
  selectFollowList: `${host}/mine/selectFollowList`,
  selectFollowListTitle: `用户关注一览取得出错`,
  //用户粉丝一览取得
  selectFansList: `${host}/mine/selectFansList`,
  selectFansListTitle: `用户粉丝一览取得出错`,
  //消费记录取得
  selectConsumptionList: `${host}/mine/selectConsumptionList`,
  selectConsumptionListTitle: `消费记录取得出错`,
  //取得用户最近使用的照片
  getNewlyUsedPic: `${host}/hairStyle/getNewlyUsedPic`,
  getNewlyUsedPicTitle: `取得用户最近使用的照片出错`,
  //删除晒过的发型
  deleteProduction: `${host}/product/deleteProduction`,
  deleteProductionTitle: `删除晒过的发型出错`,
  //统一下单接口
  getWechatPrePayOrder: `${host}/wechatPay/getWechatPrePayOrder`,
  getWechatPrePayOrderTitle: `统一下单接口出错`,
  //发型解锁商品一览取得
  getTemplateCountsGoods: `${host}/wechatPay/getTemplateCountsGoods`,
  getTemplateCountsGoodsTitle: `发型解锁商品一览取得出错`,
  //使用最近用过的照片融脸
  useNewlyPicFaceSwap: `${host}/hairStyle/useNewlyPicFaceSwap`,
  useNewlyPicFaceSwapTitle: `使用最近用过的照片融脸出错`,
  //微信支付结果取得
  getPayOrderStatus: `${host}/wechatPay/getPayOrderStatus`,
  getPayOrderStatusTitle: `微信支付结果取得出错`,
  //抽奖奖励
  setTemplateRaffle: `${host}/raffle/setTemplateRaffle`,
  setTemplateRaffleTitle: `抽奖出错`,
  //用户的积分情报取得
  selectMyPointsInfo: `${host}/mine/selectMyPointsInfo`,
  selectMyPointsInfoTitle: `用户的积分情报取得出错`,
  //积分添加
  receiveHairPoints: `${host}/coupon/receiveHairPoints`,
  receiveHairPointsTitle: `积分添加出错`,
  //我的劵包（所有）
  getAllHairCouponList: `${host}/coupon/getAllHairCouponList`,
  getAllHairCouponListTitle: `我的劵包（所有）取得出错`,
  //设置券包为已读
  readCoupon: `${host}/coupon/readCoupon`,
  readCouponTitle: `设置券包为已读出错`,
  //支付时有效优惠券一览取得
  getHairCouponList: `${host}/coupon/getHairCouponList`,
  getHairCouponListTitle: `我的劵包（有效）取得出错`,
  //积分兑换
  exchangeHairPoints: `${host}/coupon/exchangeHairPoints`,
  exchangeHairPointsTitle: `积分兑换出错`,
  //广场画面表示内容取得
  selectSquareContent: `${host}/square/selectSquareContent`,
  selectSquareContentTitle: `广场画面表示内容取得出错`,
  //抽奖信息取得
  getRafflePrizeInfo_20181224: `${host}/raffle/getRafflePrizeInfo_20181224`,
  getRafflePrizeInfo_20181224Title: `抽奖信息取得出错`,
  //邀请好友排行榜
  getInviteFriendCountList: `${host}/raffle/getInviteFriendCountList`,
  getInviteFriendCountListTitle: `邀请好友排行榜出错`,
  //抽奖
  setRaffle_20181224: `${host}/raffle/setRaffle_20181224`,
  setRaffle_20181224Title: `抽奖出错`,
  //获奖情况取得
  getRaffleInfoByUserId: `${host}/raffle/getRaffleInfoByUserId`,
  getRaffleInfoByUserIdTitle: `获奖情况取得出错`,
  //小程序用户formId积蓄
  saveFormId: `${host}/wechat/saveFormId`,
  saveFormIdTitle: `小程序用户formId积蓄出错`,
  //取得最后一次融脸效果
  getLastFaceSwap: `${host}/hairStyle/getLastFaceSwap`,
  getLastFaceSwapTitle: `最后一次融脸结果取得出错`,
  //检测照片
  checkUploadPic: `${host}/hairStyle/checkUploadPic`,
  checkUploadPicTitle: `检测照片出错`,
  //融脸结果内容取得
  selectHairStyleResult: `${host}/stylistManage/selectHairStyleResult`,
  selectHairStyleResultTitle: `发型设计详情取得出错`,
  //错误信息上传
  uploadErrorInfo: `${host}/wechat/uploadErrorInfo`,
  uploadErrorInfoTitle: `错误信息上传出错`,
  //客服
  setCustomerRelation: `${host}/wechat/setCustomerRelation`,
  setCustomerRelationTitle:'客服点击错误'
};

module.exports = config;
