var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//定义数据模型
var productSchema = new Schema({
  "productId":{type:String},
  "productName":String,
  "productPrice":Number,
  "productImg":String,
  "productNum":Number,
  "checked":String
})
module.exports = mongoose.model('Good',productSchema);  //输出 商品模型
