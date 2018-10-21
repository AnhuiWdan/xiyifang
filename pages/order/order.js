// pages/order/order.js
const header = require('../../utils/header');
const {URL} = require('../../utils/http');
const DATA = {
  page: 1,
  rows: 10,
  Status: -1
}
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
    wx.request({
      url: `${URL}order/GetOrderList`,
      data: DATA,
      header: header,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        console.log(result);
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

})
