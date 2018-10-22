// pages/order/order.js
const {
  URL
} = require('../../utils/http');
const DATA = {
  page: 1,
  rows: 10,
  Status: -1
}
Page({

  /*** 页面的初始数据*/
  data: {
    rows: [],
    row: {},
    Authorization: '',
    phoneNum: '',
    detail: false,
    logistics: false
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    const app = getApp();
    const that = this;
    if (!app.globalData.Authorization) {
      wx.redirectTo({
        url: '../index/index'
      });
      return;
    }
    this.setData({
      phoneNum: app.globalData.phoneNum
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: DATA,
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (res.data.Code == 200) {
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
      fail: () => {},
      complete: () => {wx.hideLoading()}
    });
  },
  pay: function (event) {
    const app = getApp();
    wx.showLoading({
      title: '正在支付...',
      mask: true
    })
    wx.request({
      url: `${URL}order/GetPay`,
      data: {
        id: event.currentTarget.dataset.id
      },
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.Code === 200) {
          wx.showModal({
            title: '支付成功！',
            showCancel: false
          });
          this.setData({
            rows: [],
            Authorization: app.globalData.Authorization,
            phoneNum: app.globalData.phoneNum
          })
          this.onLoad();
        }
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  scan: function (event) {
    const app = getApp();
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    wx.scanCode({
      success: (res) => {
        wx.request({
          url: `${URL}order/Flicking`,
          data: {
            "IndentCode": event.currentTarget.dataset.indentcode,
            ...JSON.parse(res.result)
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
      },
      complete: ()=>{wx.hideLoading()}
    })
  },
  openDetail: function(event) {
    console.log(event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index
    const row = this.data.rows[index];
    this.setData({
      row: row
    })
  },
  openLogistics: function(event) {
    console.log(event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index
    const row = this.data.rows[index];
    this.setData({
      row: row
    })
  },
  detailTap: function() {
    this.setData({
      detail: false,
      row: {}
    });
  },
  logisticsTap: function() {
    this.setData({
      logistics: false,
      row: {}
    })
  },
  toWash: function() {
    wx.navigateTo({
      url: '../wash/wash'
    });
  }
})