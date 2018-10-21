// pages/order/order.js
const {URL} = require('../../utils/http');
const DATA = {
  page: 1,
  rows: 10,
  Status: -1
}
Page({

  /*** 页面的初始数据*/
  data: {
    rows: [],
    Authorization: '',
    phoneNum: ''
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    const app = getApp();
    const that = this;
    if(!app.globalData.Authorization) {wx.redirectTo({
      url: '../index/index'
    });}
    this.setData({
      phoneNum: app.globalData.phoneNum
    })
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: DATA,
      header: {
        'content-type':'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        if(res.data.Code == 200){
          console.log(res.data.Data);
          that.setData({
            rows: res.data.Data.rows
          })
        } else {
          wx.showModal({
            title: res.data.Message,
            showCancel: false
          })
          return false;
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
})
