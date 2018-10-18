// pages/change/change.js
Page({

  /*** 页面的初始数据*/
  data: {
    oldPsd:'',
    newPsd1:'',
    newPsd2:''
  },

  /*** 生命周期函数--监听页面加载*/
  onLoad: function (options) {
  
  },
  //获取
  inputOld: function (e) {
    this.setData({
      oldPsd:e.detail.value
    })
  },
  inputNew1: function (e) {
    this.setData({
      newPsd1: e.detail.value
    })
  },
  inputNew2: function (e) {
    this.setData({
      newPsd2: e.detail.value
    })
  },
  submitClick: function () {
    console.log('ceshi');
    var old = this.data.oldPsd;
    var new1 = this.data.newPsd1;
    var new2 = this.data.newPsd2;
    if (old == '' || new1 == '' || new2 == '' ) {
      wx.showModal({
        title: '密码不能为空！',
        showCancel: false
      })
      return false
    }else if (new2 != new1) {
      wx.showModal({
        title: '新密码不一致！',
        showCancel: false
      })
      return false
    }else{
      //需要判断密码是否符合规则，后期可调整
      wx.showToast({
        title: '修改成功',
        icon: 'succes',
        duration:1500,
      })
      setTimeout(function(){
        wx.navigateTo({
          url: '../index/index',
        })
      }, 1500)

    }
  },
  
})