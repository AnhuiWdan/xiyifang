// pages/wash/wash.js
const {
  URL
} = require('../../utils/http');
Page({
  data: {
    showView: false,
    menus: [],
    clothesList: [],
    noMenu: '',
    menuItme: 0,
    Authorization: ''
  },


  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    const that = this;
    const app = getApp();
    this.setData({
      Authorization: app.globalData.Authorization
    })
    wx.request({
      url: `${URL}order/GetClothesType`,
      header: {
        'content-type': 'application/json',
        Authorization: that.data.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res) => {
        if (res.data.Code == 200) {
          if (res.data.Data) {
            that.setData({
              menus: res.data.Data.ParentList,
            });
            wx.request({
              url: `${URL}order/GetChildeType`,
              data: {id: res.data.Data.ParentList[0].Id},
              header: {
                'content-type': 'application/json',
                Authorization: that.data.Authorization
              },
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function(result) {
                if (result.data.Code == 200) {
                  if(result.data.Data.ClothesList.length) {
                    const clothes = result.data.Data.ClothesList;
                    clothes.forEach(value => {
                      value.cartCount = 0
                    });
                    that.setData({
                      clothesList: clothes
                    });
                  }
                  
                }
              }
            })
          } else {
            this.setData({
              noMenu: '暂无数据'
            })
          }
        } else {
          wx.showModal({
            title: res.data.Message,
            showCancel: false
          })
          return false
        }
      },
      fail: () => {},
      complete: () => {
        wx.hideLoading();
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  toggleList: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
    console.log(that.data.showView)
  },
  // 菜单切换
  menuTap: function (event) {
    const index = event.currentTarget.dataset.index;
    const that = this;
    this.setData({
      menuItme: index
    });
    const id = this.data.menus[index].Id;
    wx.request({
      url: `${URL}order/GetChildeType`,
      data: {id: id},
      header: {
        'content-type': 'application/json',
        Authorization: this.data.Authorization
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(result) {
        if (result.data.Code == 200) {
          if(result.data.Data.ClothesList.length) {
            const clothes = result.data.Data.ClothesList;
            clothes.forEach(value => {
              value.cartCount = 0
            });
            that.setData({
              clothesList: clothes
            });
          }
          
        }
      }
    })
  },
  // 单件减 
  minusCartCount: function(event) {
    const index = event.currentTarget.dataset.index;
    const clothes = this.data.clothesList;
    if(clothes[index].cartCount > 0) {
      clothes[index].cartCount -= 1;
      this.setData({
        clothesList: clothes
      })
    }
    return;
  },
  // 单件加
  addCartCount: function(event) {
    const index = event.currentTarget.dataset.index;
    const clothes = this.data.clothesList;
    clothes[index].cartCount += 1
    this.setData({
      clothesList: clothes
    })
    return;
  },
})