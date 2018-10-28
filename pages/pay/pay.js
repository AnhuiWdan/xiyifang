//Page Object
const {URL}  = require('../../utils/http');
Page({
  data: {
    clothes: [],
    totalPrice: 0
  },
  //options(Object)
  onLoad: function (option) {
    const list = JSON.parse(option.list);
    let totalPrice = 0;
    list.forEach(item => {
      totalPrice += item.Number * item.Price
    });
    this.setData({
      clothes: list,
      totalPrice: totalPrice
    })
  },
  pay: function() {
    const app = getApp();
    wx.showLoading({
      title: '正在支付',
      mask: true
    });
    wx.request({
      url: `${URL}order/SaveOrder`,
      data: {
        StudentRemark: '',
        UserId: '',
        Id: app.globalData.Id,
        clotheslist: this.data.clothes
      },
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        app.globalData.Id = '';
        if (res.data.Code == 200) {
          wx.showToast({
            title: '支付成功',
            icon: 'succes',
            duration: 20000,
            success: function() {
              setTimeout(function () {
                wx.redirectTo({
                  url: '../order/order'
                });
              }, 2000);  
              
            }
          });
         
        } else {
          if(res.data.Message === '身份认证失败。') {
            wx.showToast({
              title: res.data.Message,
              icon: 'none',
              duration: 2500,
              success: function() {
                setTimeout(function () {
                  wx.redirectTo({
                    url: '../login/login'
                  });
                }, 2500);
              }
            });
            
          } else {
            wx.showModal({
              title: res.data.Message,
              showCancel: false
            });
            return false;
          }
        }
      },
      complete: function() {
        app.globalData.Id = '';
      }
    })
  }
});