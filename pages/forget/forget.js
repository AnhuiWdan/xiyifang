// pages/register/register.js
const app = getApp()
Page({

  /*** 页面的初始数据*/
  data: {
    mobile:'',
    psd:'',
    verifyCode:'',
    disabled:false,
    sendTime:'发送验证码',
    currentTime:60
    
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
    var interval = null ;
    var that = this;
    console.log(that.data.mobile);
    if (that.data.mobile == ''){
      wx.showModal({
        title: '手机号不能为空！',
        showCancel: false
      })
      return false
    } else if (!/^1[34578]\d{9}$/.test(that.data.mobile)){
      wx.showModal({
        title: '手机号有误！',
        showCancel: false
      })
      return false
    }else{
       wx.showLoading({
         title: '发送中...',
         mask: true
       });
      wx.request({
        url: 'https://xwxapi.itknow.cn/api/AccountManage/SendAuthCode',
        data:{
          UserName: that.data.mobile
        },
        header:{
          'content-type':'application/json'
        },
        method:'post',
        success:function(res){
          wx.hideLoading();
          if(res.data.Code == '200'){
            var currentTime = that.data.currentTime;
            that.setData({
              disabled: true,
              sendTime: currentTime + '秒',
            })
            interval = setInterval(function () {
              currentTime--;
              that.setData({
                sendTime: currentTime + '秒',
              })
              if (currentTime <= 0) {
                clearInterval(interval)
                that.setData({
                  sendTime: '重新发送',
                  currentTime: 60,
                  disabled: false
                })
              }
            }, 1000)
          }
        },
        fail:function(){
          wx.hideLoading();
        },
        complete: function() {wx.hideLoading()}
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
    }else if (!mobileReg.test(mobile)) {
      wx.showModal({
        title: '手机号有误！',
        showCancel: false
      })
      return false
    } else if (psd.length<6 || psd.length>32){
      //判断密码长度
      wx.showModal({
        title: '密码长度有误！',
        showCancel: false
      })
      return false
    }else if (verifyCode == '') {
      //判断验证码
      wx.showModal({
        title: '验证码不能为空！',
        showCancel: false
      })
      return false
    }else if(verifyCode.length != 6){
      wx.showModal({
        title: '验证码长度有误！',
        showCancel: false
      })
      return false
    }else {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      wx.request({
        url: 'https://xwxapi.itknow.cn/api/AccountManage/RetrievePassword',
        data:{
          UserName:mobile,
          Password:psd,
          AuthCode: verifyCode
        },
        header: {
          'content-type': 'application/json'
        },
        method:'post',
        success:function(res){
          wx.hideLoading();
          if(res.data.Code == 200){
            wx.showToast({
              title: '修改成功',
              icon:'success',
              duration:20000,
              mask:true,
              success: function() {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../login/login',
                  })
                }, 2000)
              }
            })
            
          } else {
            wx.showModal({
              title: res.data.Message,
              showCancel: false
            })
            return false
          }
        },
        fail: () => { wx.hideLoading() },
        complete: () => { wx.hideLoading() }
      })
    }
  }
})