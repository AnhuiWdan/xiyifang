// pages/register/register.js
const app = getApp()
Page({

  /*** 页面的初始数据*/
  data: {
    mobile:'',
    psd:'',
    verifyCode:'',
    disabled:false,
    currentTime:61
    
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
  
  },
  /*** 生命周期函数--监听页面卸载*/
  onUnload: function () {
  
  },
//方法
  inputMobile: function (e) {
    //手机号码
    this.setData({
      mobile: e.detail.value
    })
  },
  inputPsd: function (e) {
    //密码
    this.setData({
      psd: e.detail.value
    })
  },
  importVerify: function (e) {
    //验证码
    this.setData({
      verifyCode: e.detail.value
    })
  },
  loginClick:function(){
    //登录
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //点击发送验证码
  getCode:function(){
    console.log(this.data.mobile);
    if(this.data.mobile == ''){
      wx.showModal({
        title: '手机号不能为空！',
        showCancel: false
      })
      return false
    } else if (!/^1[34578]\d{9}$/.test(this.data.mobile)){
      wx.showModal({
        title: '手机号格式有误！',
        showCancel: false
      })
      return false
    }else{
      console.log(this.data.mobile);
      wx.request({
        url: 'https://xwxapi.itknow.cn/api/AccountManage/SendAuthCode',
        data:{
          UserName:this.data.mobile
        },
        header:{
          Authorization:'VXsCkNFfes/vUAX9VR7o846FRxnTp1wWe83OUuIH24RGTl6z8cjjjKfojynRyMuFlCaplDRqAIXScS2u9WNMXQ=='
        }
      })
    }
  },
  registerClick:function(){
    //注册
    var mobile = this.data.mobile;
    var psd = this.data.psd;
    var verifyCode = this.data.verifyCode;
    var mobileReg = /^1[34578]\d{9}$/;
    if (mobile == '') {
      wx.showModal({
        title: '手机号不能为空！',
        showCancel: false
      })
      return false
    } else if (mobile.length != 11) {
      wx.showModal({
        title: '手机号长度有误！',
        showCancel: false
      })
      return false
    } else if (!mobileReg.test(mobile)) {
      wx.showModal({
        title: '手机号有误！',
        showCancel: false
      })
      return false
    } else if (verifyCode == '') {
      //判断密码没写，这里是直接判断验证码，验证码是否正确也需要后期调接口判断
      wx.showModal({
        title: '验证码不能为空！',
        showCancel: false
      })
      return false
    }else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  }





})