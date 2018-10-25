//Page Object
Page({
  data: {
    clothes: [],
    totalPrice: 0
  },
  //options(Object)
  onLoad: function (option) {
    const list = JSON.parse(option.list);
    let totalPrice = 0;
    list.forEach(item => {
      totalPrice += item.cartCount * item.Price
    });
    this.setData({
      clothes: list,
      totalPrice: totalPrice
    })
  }
});