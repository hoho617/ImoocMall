var express = require('express');

var router = express.Router(); //拿到express路由

var User = require('../models/users')

require('../util/util')
router.get('/',function (req, res, next) {
  res.send('hello user')
})

//登录接口
router.post('/login',function (req, res, next) {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }

  User.findOne(param,function (err, doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else {
      if(doc){
        console.log(doc);
        res.cookie('userId',doc.userId,{
          path:'/',
          maxAge:1000*60*60
        })
        res.cookie('userName',doc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
        res.json({
          status:"0",
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }
    }
  })
})



//登出接口
router.post('/logout',function (req, res, next) {
  res.cookie("userId"," ",{
    path:'/',
    maxAge:-1
  })
  res.json({
    status:"0",
    msg:'',
    result:'logout'
  })
})



//校验是否登录
router.get('/checkLogin',function (req, res, next) {
  if(req.cookies.userId){ //已经登陆过了
    res.json({
      status:"0",
      msg:'',
      result:{
        userName:req.cookies.userName
      }
    })
  }else {
    res.json({
      status:"1",
      msg:'未登录',
      result:{
        userName:''
      }
    })
  }
})




// 购物车列表接口--根据用户ID去查询
router.get("/cartList",function (req,res,next) {
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function (err, doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(doc){
        res.json({
          status:"0",
          msg:'',
          result:{
            count:doc.lenth,
            list:doc.cartList
          }
        })
      }
    }
  })
})

//购物车删除商品接口
/***自己写的***/
//1.根据userId找到相关用户
router.post('/cartDelFilter',function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.findOne({userId:userId},function (err, userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(userDoc){ //2.如果找到该用户 则遍历旗下的cartList数组 筛选出productId不等于 要删除的productId 的选项
       let cartList = userDoc.cartList.filter((item,index)=>{
          if(item.productId != productId){
            return item;
          }
        })
        userDoc.cartList = cartList;
        console.log('cartList',cartList);
        userDoc.save(function (err,doc) { //3.保存
          if(err){
            res.json({
              status:"1",
              msg:err.message,
              result:''
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
})

/***node的update方法***/
router.post('/cartDel',function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  User.update({ //第一个参数为查询条件 第二个$pull 是要删除的条件
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },function (err, doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(doc){
        res.json({
          status:"0",
          msg:'',
          result:'suc'
        })
      }
    }
  })
})

//修改购物车属性
router.post('/cartEdit',function (req, res, next) {
  let userId = req.cookies.userId;
  let productId = req.body.productId;
  let productNum = req.body.productNum;
  let checked = req.body.checked;

  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function (err, doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      res.json({
        status:"0",
        msg:'',
        result:'修改成功'
      })
    }
  })
})


//全选接口
router.post('/cartCheckAll',function (req, res, next) {
  let userId = req.cookies.userId;
  let checkAllFlag = req.body.checkAllFlag ? '0':'1';
  User.findOne({"userId":userId},function (err, userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(userDoc){
        userDoc.cartList.forEach((item)=>{
          item.checked = checkAllFlag;
        })
        userDoc.save(function (err, doc) {
          if(err){
            res.json({
              status:"1",
              msg:err.message,
              result:''
            })
          }else {
            if(doc){
              res.json({
                status:"0",
                msg:'',
                result:'切换全选成功'
              })
            }
          }
        })
      }
    }
  })
})


//查询地址列表接口
router.get("/addressList",function (req, res, next) {
  let userId = req.cookies.userId;
  User.findOne({"userId":userId},function (err,doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(doc){
        res.json({
          status:"0",
          msg:'',
          result:{
            count:doc.addressList.length,
            list:doc.addressList
          }
        })
      }
    }
  })
})

//设置为默认地址接口
router.post('/setDefaultAdd',function (req, res, next) {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:"10002",
      msg:'参数不完整',
      result:''
    })
  }else {
    User.findOne({"userId":userId},function (err, userDoc) {
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:''
        })
      }else {
        if(userDoc){
          let addressList = userDoc.addressList;
          addressList.forEach((item)=>{
            if(item.addressId == addressId){
              item.isDefault = true;
            }else {
              item.isDefault = false;
            }
          })
          userDoc.save(function (err, doc) {
            if(err){
              res.json({
                status:"1",
                msg:err.message,
                result:''
              })
            }else {
              res.json({
                status:"0",
                msg:'',
                result:'设置默认地址成功'
              })
            }
          })
        }
      }
    })
  }

})


//删除地址接口 update 下的 $pull 一步一步来userId->addressList->addressId
router.post("/delAddress",function (req, res, next){
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  User.update({"userId":userId},{
    $pull:{
      "addressList":{
        "addressId":addressId
      }
    }
  },function (err, doc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(doc){
        res.json({
          status:"0",
          msg:'',
          result:'删除成功'
        })

      }
    }
  })
})


//生成订单接口
router.post('/payMent',function (req, res, next) {
  let userId = req.cookies.userId,
    orderTotal = req.body.orderTotal,
    addressId = req.body.addressId;
  /**1.先找到相应的用户***/
  User.findOne({"userId":userId},function (err, userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(userDoc){
        /**2.根据addressId查找到addressList下的选中的地址 根据checked=0 查到cartList下的商品信息***/
        let addressInfo = {},goodsList = [];
        userDoc.addressList.forEach((item)=>{
          if(item.addressId == addressId){
            addressInfo = item;
          }
        })
        goodsList = userDoc.cartList.filter((item)=>{
          return item.checked == '0';
        })
        console.log('addressInfo',addressInfo);


        /***3.定义订单信息对象 将其添加到orderList下**/
        let platform = '622';
        let r1 = Math.floor(Math.random()*10);
        let r2 = Math.floor(Math.random()*10);
        let sysDate = new Date().Format("yyyyMMddhhmmss");
        let createDate = new Date().Format("yyyy-MM-dd hh:mm:ss");

        let orderId = platform+r1+sysDate+r2;
        let order = {
          orderId:orderId,
          address:addressInfo,
          goodsList:goodsList,
          orderTotal:orderTotal,
          createDate:createDate,
          orderStatus:'1'
        }
        userDoc.orderList.push(order);

        userDoc.save(function (err1, doc) {
          if(err){
           res.json({
             status:'1',
             msg:err.message,
             result:''
           })
          }else {
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId:order.orderId,
                orderTotal:order.orderTotal
              }
            })
          }
        })
      }
    }
  })
})


//获取订单详情接口
router.get('/orderDetail',function (req, res, next) {
  let userId = req.cookies.userId,
    orderId = req.param('orderId');
  User.findOne({"userId":userId},function (err, userDoc) {
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else {
      if(userDoc){
        let orderList = userDoc.orderList;
        if(orderList.length > 0){
          let orderTotal = 0;
          userDoc.orderList.forEach((item)=>{
            if(item.orderId == orderId){
              orderTotal = item.orderTotal;
            }
          })

          if(orderTotal > 0){
            res.json({
              status:"0",
              msg:'',
              result:{
                orderId:orderId,
                orderTotal:orderTotal
              }
            })
          }else {
            res.json({
              status:"0002",
              msg:'无此订单',
              result:''
            })
          }
        }else {
          res.json({
            status:"0001",
            msg:'暂未创建订单',
            result:''
          })
        }

      }
    }
  })
})


//获取购物车数量
router.get('/cartCount',function (req, res, next) {
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    User.findOne({"userId":userId},function (err,doc) {
      if(err){
        res.json({
          status:"1",
          msg:err.message,
          result:''
        })
      }else {
        if(doc){
          let cartCount = 0;
          doc.cartList.forEach((item)=>{
            cartCount += parseInt(item.productNum);
          })

          res.json({
            status:"0",
            msg:'',
            result:{
              cartCount:cartCount
            }
          })
        }
      }
    })
  }
})
module.exports = router;
