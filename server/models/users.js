var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[
    {
      "productId":String,
      "productName":String,
      "productPrice":Number,
      "productImg":String,
      "checked":String,
      "productNum":String
    }
  ],
  "addressList":[
    {
      "addressId" : String,
      "userName" : String,
      "isDefault" : Boolean,
      "streetName" : String,
      "postCode" : Number,
      "tel" : Number
    }
  ]
})

module.exports = mongoose.model('User',userSchema)
