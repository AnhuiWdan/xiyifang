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
    wx.request({
      url: `${URL}AccountInfo/GetUserInfo`,
      header: {
        'content-type':'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        // if(res.data.Code == 200){
        //   res.data.Data
        // }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
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
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
      //跳转我要洗衣
      wx.navigateTo({
        url: '../wash/wash',
      })
    }
    
  },
  orderClick: function () {
    if(!this.data.isLogin) {
      wx.navigateTo({
        url: '../login/login',
      })
    } else{
       //跳转我的订单
      wx.navigateTo({
        url: '../order/order',
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