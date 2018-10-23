// pages/order/order.js
const {
  URL
} = require('../../utils/http');

Page({

  /*** 页面的初始数据*/
  data: {
    rows: [],
    row: [],
    Authorization: '',
    phoneNum: '',
    detail: false,
    logistics: false,
    formData: {
      page: 1,
      rows: 10,
      Status: -1
    }
  },
  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    const app = getApp();
    const that = this;
    if (!app.globalData.Authorization) {
      wx.redirectTo({
        url: '../index/index'
      });
    }
    this.setData({
      phoneNum: app.globalData.phoneNum,
      Authorization: app.globalData.Authorization
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: `${URL}order/GetWorkOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (res.data.Code == 200) {
          that.setData({
            rows: res.data.Data.rows,
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
      complete: () => {
        wx.hideLoading()
      }
    });
  },
  pay: function (val) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const that = this;
    wx.request({
      url: `${URL}order/GetPay`,
      data: {
        Id: val
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
          that.onLoad();
        }
      },
      fail: function () {},
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  scan: function (event) {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const app = getApp();
    const that = this;
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
      fail: () => {
      },
      complete: function () {
        wx.hideLoading();
        that.onLoad();
      }
    })
  },
  openDetail: function (event) {
    const index = event.currentTarget.dataset.index
    const row = this.data.rows[index];
    this.setData({
      row: row,
      detail: true
    })
  },
  openLogistics: function (event) {
    const index = event.currentTarget.dataset.index
    const row = this.data.rows[index];
    this.setData({
      row: row,
      logistics: true
    })
  },
  detailTap: function () {
    this.setData({
      detail: false,
      row: {}
    });
  },
  logisticsTap: function () {
    this.setData({
      logistics: false,
      row: {}
    })
  },
  toWash: function () {
    wx.navigateTo({
      url: '../wash/wash'
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    this.data.formData.page = 1;
    wx.request({
      url: `${URL}order/GetWorkOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: this.data.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.setData({
          rows: res.data.Data.rows,
        });
        wx.showToast({
          title: '已经是最新的了',
          icon:'success',
          duration: 1500,
          mask:true
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      complete: function () {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
      mask: true
    })
    // 页数+1
    this.data.formData.page += 1;
    wx.request({
      url: `${URL}order/GetWorkOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: this.data.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // 回调函数
        var rows = that.data.rows;

        for (var i = 0; i < res.data.Data.rows.length; i++) {
          rows.push(res.data.Data.rows[i]);
        }
        if (res.data.Data.rows.length === 0) {
          wx.showToast({
            title: '已经到底了',
            duration: 3000,
            mask: true,
          });
        }
        // 设置数据
        that.setData({
          rows: rows
        })
        // 隐藏加载框
        wx.hideLoading();
      },
      complete: function () {
        wx.hideLoading()
      }
    })

  }
})