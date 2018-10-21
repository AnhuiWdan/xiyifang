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
    arr1:[
      {
        dd1:1
      },
      {
        dd1: 2
      },
      {
        dd1: 3
      }
    ],
    arr2: [
      {
        dd2: 1
      },
      {
        dd2: 2
      },
      {
        dd2: 3
      }
    ],
    arr1Index:0,
    prompt1:'选择衣服种类',
    arr2Index:0,
    prompt2:'选择衣服类型',
    price:'',
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var reqTask = wx.request({
      url: `${URL}order/GetClothesType`,
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
  picker1Change:function(e){
    this.setData({
      arr1Index:e.detail.value
    })
   
    this.setData({
      prompt1: this.data.arr1[this.data.arr1Index].dd1
    })

  },
  picker2Change: function (e) {
    this.setData({
      arr2Index: e.detail.value
    })
    this.setData({
      prompt2: this.data.arr2[this.data.arr2Index].dd2
    })

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
        })
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
 
})