var express = require('express');
var router = express.Router(); //拿到express路由
var mongoose = require('mongoose');
var Goods = require('../models/goods');
// 链接mongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/demo');
mongoose.connection.on('connected',function () {
  console.log('MongoDB connected success.')
})
mongoose.connection.on('error',function () {
  console.log('MongoDB connected fail.')
})
mongoose.connection.on('disconnected',function () {
  console.log('MongoDB connected disconnectd.')
})


// 查询商品列表
/***router.get获取前端传来的参数用 req.param()*/
router.get('/list',function (req, res, next) {
  /***实现排序和分页***/
  let sort = req.param('sort');  //取到前端传来的排序参数
  let page = parseInt(req.param('page')); //第几页--字符串类型
  let pageSize = parseInt(req.param('pageSize')); //每页几条数据
  let skip = (page-1)*pageSize;

  let params = {}; //筛选的条件

  //价格区间
  let priceLevel = req.param('priceLevel');
  let priceGt,priceLte;

  if(priceLevel != '-1'){
    switch (priceLevel){
      case '0':priceGt = 0;priceLte = 100;break;
      case '1':priceGt = 100;priceLte = 500;break;
      case '2':priceGt = 500;priceLte = 1000;break;
      case '3':priceGt = 1000;priceLte = 3000;break;
    }
    params = {
      productPrice:{ //定义查询条件
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize); //skip--跳过多少条  limit--限制多少条
  goodsModel.sort({'productPrice':sort});  //对价格进行排序
  goodsModel.exec(function (err, doc) {  //输出筛选的内容
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
  /***输出所有的数据库内容***/
  /*Goods.find({},function (err, doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })*/

})


var User = require('../models/users');
//加入购物车 即往用户信息表中的购物车插入商品数据
/***post获取前端传来的参数用 req.body.****/
router.post('/addCart',function (req, res, next) {
  // 1.先获取用户的id，找到对应的用户
  var userId = '1000001';
  var productId = req.body.productId;
  User.findOne({userId:userId},function (err, userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else {
      if(userDoc){ //如果找到相应的用户
        console.log(userDoc);
        // 2.判断用户信息中是否存在该商品信息
        var goodsItem = '';
        userDoc.cartList.forEach((item)=>{
          if(item.productId == productId){ //如果存在该商品
            console.log('item.productId == productId，数量加1');
            goodsItem = item;
            item.productNum ++; //商品数量加1
          }
        })

        if(goodsItem){
          console.log('商品信息已存在,直接数量加1');
          userDoc.save(function (err2,doc) {
            if(err2){
              res.json({
                status:"1",
                msg:err2.message
              })
            }else {
              res.json({
                status:"0",
                msg:'',
                result:'suc'
              })
            }
          })
        }else {
          console.log('商品信息不存在，直接往模型中添加数据');
          // 3.根据商品id在商品模型中找到 该商品信息
          Goods.findOne({productId:productId},function (err1,goodsDoc) {
            if(err1){
              res.json({
                status:"1",
                msg:err1.message
              })
            }else {
              if(goodsDoc){
                console.log('goodsDoc',goodsDoc);
                // 3.查询到的信息需要添加两个属性 productNum和checked 再插入到user模型下的cartList下
                goodsDoc.productNum = 1;
                goodsDoc.checked = 1; //默认未选中
                userDoc.cartList.push(goodsDoc); //往User插入数据
                userDoc.save(function (err2,doc) {
                  if(err2){
                    res.json({
                      status:"1",
                      msg:err2.message
                    })
                  }else {
                    res.json({
                      status:"0",
                      msg:'',
                      result:'suc'
                    })
                  }
                })
              }


            }
          })
        }


      }
    }
  })


})



module.exports = router;
