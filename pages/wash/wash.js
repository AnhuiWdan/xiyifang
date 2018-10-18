// pages/wash/wash.js
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

  }
 
})