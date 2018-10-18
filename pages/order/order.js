// pages/order/order.js
Page({

  /*** 页面的初始数据*/
  data: {
    arr:[
      {
        num:'xxxxx',
        state:'未完成',
        time:'2018-10-11',
        operation:'扫一扫'
      },
      {
        num: 'xxxxx',
        state: '未完成',
        time: '2018-10-11',
        operation: '物流'
      },
      {
        num: 'xxxxx',
        state: '派单中',
        time: '2018-10-11',
        operation: '派单中'
      }
    ]
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {

  },

})