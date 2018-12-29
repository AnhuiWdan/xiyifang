//Page Object
const {
  URL
} = require('../../utils/http');
Page({
  data: {
    clothes: [],
    totalPrice: 0,
    StudentRemark: '',
    siteNum:-1,
    cabinetList: [{
      name: 'A',
      id: '0006025',
      type: 'default',
      index: '0'
    }, {
      name: 'B',
      id: '0006026',
      type: 'default',
      index: '1'
    }],
    siteNum: 0
  },
  //options(Object)
  onLoad: function (option) {
    let list = [];
    if (option.order) {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      const order = JSON.parse(option.order);
      const app = getApp();
      const that = this;
      app.globalData.IndentCode = order.indentCode;
      wx.request({
        url: `${URL}order/GetOrderDetails`,
        data: {Id: order.id},
        header: {
          'content-type':'application/json',
          Authorization: app.globalData.Authorization
        },
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: (res)=>{
          wx.hideLoading();
          if(res.data.Code === 200) {
            list = res.data.Data.Clotheslist;
            let totalPrice = 0;
            list.forEach(item => {
              totalPrice += item.Number * item.ClothesPrice
            });
            that.setData({
              clothes: list,
              totalPrice: totalPrice,
              StudentRemark: res.data.Data.StudentRemark
            })
          } else {
            wx.showToast({
              title: res.data.Data,
              duration: 2000,
              mask:true,
            })
          }
        }
      });


    } else {
      list = JSON.parse(option.list);
      let totalPrice = 0;
      list.forEach(item => {
        totalPrice += item.Number * item.Price
      });
      this.setData({
        clothes: list,
        totalPrice: totalPrice
      })
    }
    
  },
  input: function(e) {
    this.setData({
      StudentRemark: e.detail.value
    });
  },
  //选择机柜
  selCabinet: function (e) {
    const app = getApp();
    console.log(app.globalData.Authorization)
    var that = this ;
    console.log(e.currentTarget.id)
    var fixNo = e.currentTarget.id;
    wx.request({
      url: `${URL}Order/CabinetNum`,
      data: {
        fixNo: fixNo
      },
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'post',
      success: function (res) {
        if(res.data.Code == 200){
          that.setData({
            siteNum:res.data.Data.num
          })
        }
      },
      error: function (res) {
        console.log(res)
      }
    })
  }

  ,
  //选择机柜
  selCabinet: function (e) {
    const app = getApp();
    var that = this;
    console.log(e)
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index;
    // console.log(app.globalData.Authorization)
    var fixNo = e.currentTarget.id;
    wx.request({
      url: `${URL}Order/CabinetNum`,
      data: {
        fixNo: fixNo
      },
      header: {
        'content-type': 'application/json',
        Authorization: app.globalData.Authorization
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        if (res.data.Code == 200) {
          let dd0 = 'cabinetList[0].type';
          let dd1 = 'cabinetList[1].type';
          if (index == 0) {
            that.setData({
              siteNum: res.data.Data.num,
              [dd0]: 'primary',
              [dd1]: 'default'
            })
          } else if (index == 1) {
            that.setData({
              siteNum: res.data.Data.num,
              [dd0]: 'default',
              [dd1]: 'primary'
            })
          }
        } else {
          var cabinetName;
          if (index == 0) {
            cabinetName = 'A'
          } else if (index == 1) {
            cabinetName = 'B'
          }
          wx.showToast({
            title: cabinetName + '暂无空柜',
            icon: 'none',
            mask: true,
            duration: 2000
          })
        }
      },
      error: function (res) {
        console.log(res)
      }
    })
  },
  pay: function () {
    const app = getApp();
    this.orderPay(
      app.globalData.OpenId, 
      app.globalData.IndentCode, 
      app.globalData.Authorization,
      this.data.StudentRemark,
      this.data.clothes);
  },

  orderPay(openid, IndentCode, Authorization, StudentRemark, list) {
    var that = this;
    wx.request({
      url: `${URL}order/GetPayParments`,
      method: 'POST',
      header: {
        'content-type': 'application/json',
        Authorization: Authorization
      },
      data: {
        IndentCode: IndentCode,
        Openid: openid
      },
      success: function (result) {
        if (result.data.Code == "200") {
          var r = result.data.Data.Data;
          wx.requestPayment({
            'timeStamp': r.timeStamp,
            'nonceStr': r.nonceStr,
            'package': r.prepayId,
            'signType': 'MD5',
            'paySign': r.sign,
            'success': function () {
              wx.showToast({      
                title: '支付成功！',
                icon: "success",
                duration: 2000,
                mask:true,
                success: function (res) {
                  wx.request({
                    url: `${URL}order/SaveOrder`,
                    data: {
                      StudentRemark: StudentRemark,
                      UserId: '',
                      Id: '',
                      IndentCode: IndentCode,
                      clotheslist: list
                    },
                    header: {
                      'content-type': 'application/json',
                      Authorization: Authorization
                    },
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text'
                  });
                  setTimeout(function () {
                    wx.redirectTo({
                      url: '../order/order',
                    })
                  }, 2000)
                }
              })
            },
            'fail': function (result) {
              if(result.errMsg === 'requestPayment:fail cancel'){
                wx.showToast({
                  title: '支付已取消',
                  icon:'none',
                  duration:2000,
                  mask:true
                })
              } else {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 2000,
                  mask: true
                })
              }
              
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: "支付失败！",
            icon: "cancel",
            showCancel: false,
            success: function (res) {
              // if (res.confirm) {
              //   wx.switchTab({
              //     url: '../usehome/usehome?status=2',
              //     success: function (e) {
              //       var page = getCurrentPages().pop();
              //       if (page == undefined || page == null) return;
              //       page.onLoad();
              //     }
              //   })
              // }
            }
          })
        }
      }
    })
    // that.getOpenId(function (openid) {

    // })
  }
});