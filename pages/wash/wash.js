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
    arr2:[],
    count:'1'
    
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
   wx.request({
     url: 'https://xwxapi.itknow.cn/api/order/GetClothesType',
     header:header,
     method:'post',
     data:DATA,
     dataType:'json',
     responseType: 'text',
     success: (res) => {
       this.setData({
         arr1: res.data.Data.ParentList,
         arr2: res.data.Data.ClothesList
       })
       console.log(this.data.arr1)
       console.log(this.data.arr2)
     }
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