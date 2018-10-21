// pages/wash/wash.js\

const header = require("../../utils/header");
const {URL} = require("../../utils/http");
const DATA = {
  "UserId":"762F7AD0-D070-4425-8FB7-E8E78C183C82",
  "StudentRemark":"备注信息",
  "clotheslist":
  [
      {
          "ClothesId":"440797B9-B149-4E39-8FF9-A7430302AE62",
          "Number":1
      },
      {
          "ClothesId":"67246EED-94F2-4D21-97C6-C8E2B93A7126",
          "Number":2
      }
  ]
};

Page({

  /*** 页面的初始数据*/
  data: {
    arr1:[],
    arr1Index:0,
    prompt1:'选择衣服种类',
    price:'',
    count: 0
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var reqTask = wx.request({
      url: `${URL}order/GetClothesType`,
      header: header,
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: (res)=>{
        this.setData({
          arr1: res.data.Data
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
  picker1Change:function(e){
    this.setData({
      arr1Index:e.detail.value
    })
   
    // this.setData({
    //   prompt1: this.data.arr1[this.data.arr1Index].dd1
    // })

  },
  picker2Change: function (e) {
    this.setData({
      arr2Index: e.detail.value
    })
    this.setData({
      prompt2: this.data.arr2[this.data.arr2Index].dd2
    })

  },
  minus: function() {
    if(this.data.count>0) {
      let count = this.data.count;
      this.setData({
        count: --count
      })
    }
  },
  add: function() {
    let count = this.data.count;
    count++;
    const price = this.data.arr1[this.data.arr1Index].Price
    this.setData({
      count: count,
      price: price*count
    });

  },
  pay: function() {
    wx.request({
      url: `${URL}order/SaveOrder`,
      header: header,
      method: 'POST',
      data: DATA,
      dataType: 'json',
      responseType: 'text',
      success: (result)=>{
        wx.showModal({
          title: '下单成功！',
          showCancel:false
        });
        wx.redirectTo({
          url: '../order/order'
        });
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
 
})