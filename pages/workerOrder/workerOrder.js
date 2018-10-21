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
  pay: function(val) {
    console.log(val);
    wx.request({
      url: `${URL}order/GetPay`,
      data: {Id: val},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.Code === 200) {
          wx.showModal({
            title: '支付成功！',
            showCancel:false
          });
        }
      }
    })
  },
  scan: function (event) {
    const app = getApp();
    wx.scanCode({
      success: (res) => {
        console.log(event.currentTarget.dataset.indentcode);
        console.log(res.result.Ark);
        wx.request({
          url: `${URL}order/Flicking`,
          data: {
            "IndentCode": event.currentTarget.dataset.indentcode,
            ...res.result
          },
          header: {
            'content-type': 'application/json',
            Authorization: app.globalData.Authorization
          },
          method: 'POST',
          dataType: 'json',
          responseType: 'text',
          success: (res) => {
            if (res.data.Code === 200) {
              wx.showModal({
                title: '开箱成功！',
                showCancel: false
              });
            } else {
              wx.showModal({
                title: res.data.Message,
                showCancel: false
              })
              return false
            }
          }
        })
      },
      fail: (rej) => {
        console.log(rej);
      }
    })
  }
})
