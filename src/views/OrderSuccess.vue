<template>
    <div>
      <nav-header></nav-header>
      <nav-bread>
        <span>Order Success</span>
      </nav-bread>
      <div class="container">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>check out</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
          <ul>
            <li class="cur"><span>Confirm</span> address</li>
            <li class="cur"><span>View your</span> order</li>
            <li class="cur"><span>Make</span> payment</li>
            <li class="cur"><span>Order</span> confirmation</li>
          </ul>
        </div>

        <div class="order-create">
          <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
          <div class="order-create-main">
            <h3>Congratulations! <br>Your order is under processing!</h3>
            <p>
              <span>Order ID：{{orderId}}</span>
              <span>Order total：{{orderTotal | currency}}</span>
            </p>
            <div class="order-create-btn-wrap">
              <div class="btn-l-wrap">
                <router-link to="/cart" class="btn btn--m">CART List</router-link>
              </div>
              <div class="btn-r-wrap">
                <router-link to="/cart" class="btn btn--m">Goods List</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <nav-footer></nav-footer>
    </div>
</template>

<script>
  import NavHeader from '@/components/NavHeader'
  import NavBread from '@/components/NavBread'
  import NavFooter from '@/components/NavFooter';
  import Modal from '@/components/Modal';
  // 引入请求数据插件
  import axios from 'axios'

  //引入过滤器函数
  import {currency} from "../util/currency";
    export default {
        name: "OrderSuccess",
        data(){
          return {
            orderId:'',
            orderTotal:0
          }
        },
        components:{
          NavHeader,
          NavBread,
          NavFooter,
          Modal
        },
        mounted(){
          this.getOrderDetail();
        },
        methods:{
          getOrderDetail(){
            let orderId = this.$route.query.orderId;
            this.orderId = orderId;
            axios.get('/users/orderDetail',{
              params:{
                orderId:orderId
              }
            }).then((response)=>{
              let res = response.data;
              if(res.status == "0"){
                console.log(res.result);
                this.orderTotal = res.result.orderTotal;
              }
            })
          }
        }

    }
</script>

<style scoped>

</style>
