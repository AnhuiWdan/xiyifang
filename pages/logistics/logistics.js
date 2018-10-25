// 物流
Page({
    data: {
        logistics: [],
        id: '',
        Authorization: ''
    },
    //options(Object)
    onLoad: function(option){
        wx.showLoading({
          title: '加载中...',
          mask: true,
        });
        const id = option.id;
        const app = getApp();
        const that = this;
        this.setData({
          Id: option.id,
          Authorization: app.globalData.Authorization
        });
        wx.request({
          url: `${URL}api/order/GetLogistics`,
          data: {Id: id},
          header: {
            'content-type':'application/json',
            Authorization: app.globalData.Authorization
          },
          method: 'GET',
          dataType: 'json',
          responseType: 'text',
          success: (res)=>{
            wx.hideLoading();
            if(res.data.Code === 200) {
                console.log(res.data.Data)
                that.setData({
                    logistics: res.data.Data
                })
            } else {
              wx.showToast({
                title: res.data.Data,
                duration: 2000,
              })
            }
          }
        });
      }
});