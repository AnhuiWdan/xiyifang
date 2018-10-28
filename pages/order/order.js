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
      return;
    }
    this.setData({
      phoneNum: app.globalData.phoneNum,
      Authorization: app.globalData.Authorization
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: this.data.formData,
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        wx.hideLoading();
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
      complete: () => {wx.hideLoading()}
    });
  },

  // 支付
  pay: function (event) {
    const app = getApp();
    wx.showLoading({
      title: '正在支付...',
      mask: true
    });
    const that = this;
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
         // that.onLoad();
          wx.showModal({
            title: '支付成功！',
            showCancel: false
          });
          that.data.formData.page = 1;
          wx.request({
            url: `${URL}order/GetOrderList`,
            data: that.data.formData,
            header: {
              'content-type': 'application/json',
              Authorization: that.data.Authorization
            },
            method: 'POST',
            dataType: 'json',
            responseType: 'text',
            success: (result) => {
              if (result.data.Code == 200) {
                that.setData({
                  rows: result.data.Data.rows,
                })
              } else {
                wx.showModal({
                  title: result.data.Message,
                  showCancel: false
                })
                return false;
              }
            }
          });
          
        }
      },
      complete: function() {
        wx.hideLoading();
      }
    })
  },
  // 扫一扫
  scan: function (event) {
    const app = getApp();
    const that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认开箱？',
      success(result) {
        if(result.confirm) {
          wx.scanCode({
            success: (res) => {
              wx.request({
                url: `${URL}order/Flicking`,
                data: {
                  IndentCode: event.currentTarget.dataset.indentcode,
                  WechatPage: 'order',
                  WechatFormId: app.globalData.formId,
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
                    that.onLoad();
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
            fail: (rej) => {},
            complete: ()=>{}
          })
        } else if(result.cancel) {
          return;
        }
      }
    })
    
  },
  openDetail: function(event) {
    console.log(event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index
    const Id = this.data.rows[index].Id;
    wx.navigateTo({
      url: '../detail/detail?id='+ Id,
    });
  },
  openLogistics: function(event) {
    console.log(event.currentTarget.dataset.index);
    const index = event.currentTarget.dataset.index
    const Id = this.data.rows[index].Id;
    wx.navigateTo({
      url: '../logistics/logistics?id='+Id
    })
  },
  toWash: function(event) {
    wx.navigateTo({
      url: '../wash/wash?id=' + event.currentTarget.dataset.id
    });
  },
  // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    this.data.formData.page = 1;
    wx.request({
      url: `${URL}order/GetOrderList`,
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
      complete: function() {
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
      url: `${URL}order/GetOrderList`,
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
        // 隐藏加载框
        wx.hideLoading();
        for (var i = 0; i < res.data.Data.rows.length; i++) {
          rows.push(res.data.Data.rows[i]);
        }
        if(res.data.Data.rows.length === 0) {
          wx.showToast({
            title: '已经到底了',
            duration: 1500,
            mask: true
          })
        }
        // 设置数据
        that.setData({
          rows: rows
        })
        
      }
    })
 
  }
})