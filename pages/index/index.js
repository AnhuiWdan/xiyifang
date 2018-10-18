// pages/index/index.js
Page({

  /*** 页面的初始数据*/
  data: {
  
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
  washClick: function () {
    //跳转我要洗衣
    wx.navigateTo({
      url: '../wash/wash',
    })
  },
  orderClick: function () {
    //跳转我的订单
    wx.navigateTo({
      url: '../order/order',
    })
  },
  changeClick:function(){
    //跳转密码修改页
    wx.navigateTo({
      url: '../change/change',
    })
  },
  //退出按钮，进入登录页
  logoutClick:function(){
    wx.navigateTo({
      url: '../login/login',
    })
  }
})