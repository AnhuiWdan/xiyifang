//Page Object
Page({
    data: {
        clothes: [],
        height: 0
    },
    //options(Object)
    onLoad: function(options){
      const that = this;
      wx.getSystemInfo({
        success(res) {
          console.log(res.pixelRatio)
          console.log(res.windowWidth)
          console.log(res.windowHeight)
          that.setData({
            height: 260 * res.pixelRatio
          })
          if(res.pixelRatio === 2) {
            if(res.windowWidth <= 340 ) {
              that.setData({
                height: 230 * 2
              })
            } else if(res.windowWidth <= 390) {
              that.setData({
                height: 265*2
              })
            } else if(res.windowWidth <= 780) {
              that.setData({
                height: 200*2
              })
            }
          } else if(res.pixelRatio === 3) {
            if(res.windowWidth <= 360){
              that.setData({
                height: 170 * 3
              })
            } else if (res.windowWidth <= 385) {
              that.setData({
                height: 257 * 3
              })
            } else if(res.windowWidth <= 420) {
              that.setData({
                height: 191*3
              })
            }
          } else {
            that.setData({
              height: 160*res.pixelRatio
            })
          }
        }
      })
    }
});