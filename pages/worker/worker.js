// pages/index/index.js
const {URL} = require('../../utils/http');
Page({

  /*** 页面的初始数据*/
  data: {
    isLogin: false,
    phoneNum: '',
    isStu: true
  },
  onLoad() {
    // 逻辑判断是否已经登录
    const app = getApp();
    if(!!app.globalData.Authorization) {
      this.setData({
        isLogin: true,
        phoneNum: app.globalData.phoneNum
      })
    }
  },
  scan() {
    wx.scanCode({
      success: (res)=> {
        console.log(res);
        console.log(res.result);
      },
      fail: (rej)=> {
        console.log(rej);
      }
    })
  },
  // mineClick: function () {
  //   //跳转个人中心
  //   wx.navigateTo({
  //     url: '../mine/mine',
  //   })
  // },
  orderClick: function () {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
       //跳转我的订单
      wx.navigateTo({
        url: '../workerOrder/workerOrder',
      })
    }
    
   
  },
  changeClick:function(){
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
       //跳转密码修改页
      wx.navigateTo({
        url: '../change/change',
      })
    }
    
  },
  //退出按钮，进入登录页
  logoutClick:function(){
    const app = getApp();
    app.globalData.Authorization = '';
    app.globalData.phoneNum = '';
    wx.navigateTo({
      url: '../login/login',
    });
    this.setData({
      isLogin: false,
      phoneNum: ''
    })
  }
})