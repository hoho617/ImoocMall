<template>
  <div>
    <nav-header></nav-header>
    <div class="accessory-result-page accessory-page">
      <nav-bread>
        <span>Goods</span>
      </nav-bread>
        <div class="container">
          <div class="filter-nav"><span class="sortby">Sort by:</span> <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" v-bind:class="{'sort-up':sortFlag}" @click="sortPrice">Price
              <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg>
            </a> <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterbyPop">Filter by</a></div>
          <div class="accessory-result">
            <div id="filter" class="filter stopPop" v-bind:class="{'filterby-show':filterbyPop}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd @click="filterPrice(-1)"><a href="javascript:void(0)" v-bind:class="{cur:checkedPrice == -1}">All</a></dd>
                <dd v-for="(item,index) in priceFilterList" @click="filterPrice(index)">
                  <a href="javascript:void(0)" v-bind:class="{cur:checkedPrice == index}">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic"><a href="#"><img alt="" v-lazy="'/static/'+item.productImg" lazy="loaded"></a></div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">￥{{item.productPrice}}</div>
                      <div class="btn-area"><a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a></div>
                    </div>
                  </li>
                </ul>
                <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading"></infinite-loading>
              </div>
              <!--<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                &lt;!&ndash;<img src="./../assets/loading-spinning-bubbles.svg">&ndash;&gt;
                加载中...
              </div>-->
              <!--<div infinite-scroll-disabled="busy" infinite-scroll-distance="20" class="view-more-normal"><img-->
                <!--src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZGQ3NDc5Ij4KICA8Y2lyY2xlIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoNDUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjEyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoOTAgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjI1cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgxMzUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjM3NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC41cyIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InJvdGF0ZSgyMjUgMTYgMTYpIiBjeD0iMTYiIGN5PSIzIiByPSIwIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDszOzA7MCIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIGJlZ2luPSIwLjYyNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC43NXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgogIDxjaXJjbGUgdHJhbnNmb3JtPSJyb3RhdGUoMzE1IDE2IDE2KSIgY3g9IjE2IiBjeT0iMyIgcj0iMCI+CiAgICA8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJyIiB2YWx1ZXM9IjA7MzswOzAiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC44NzVzIiBrZXlTcGxpbmVzPSIwLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44OzAuMiAwLjIgMC40IDAuOCIgY2FsY01vZGU9InNwbGluZSIgLz4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHRyYW5zZm9ybT0icm90YXRlKDE4MCAxNiAxNikiIGN4PSIxNiIgY3k9IjMiIHI9IjAiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOzM7MDswIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAuNXMiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC4yIDAuNCAwLjg7MC4yIDAuMiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgo8L3N2Zz4K"-->
                <!--style="display: none;"></div>-->
            </div>
            <modal v-bind:mdShow="mdShow" v-on:closeModal="closeModal">
                <p slot="message">
                  您当前尚未登录！
                </p>
                <div slot="btnGroup">
                  <a href="javascript:;" class="btn btn--m" @click="closeModal">关闭</a>
                </div>
            </modal>
            <modal v-bind:mdShow="mdShowCart" v-on:closeModal="closeModal">
              <p slot="message">
                加入购物车成功!
              </p>
              <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="closeModal">继续购物</a>
                <router-link to="/cart" class="btn btn--m">查看购物车</router-link>
              </div>
            </modal>
            <!--<div>
              <div class="md-modal modal-msg md-modal-transition">
                <div class="md-modal-inner">
                  <div class="md-top">
                    <button class="md-close">Close</button>
                  </div>
                  <div class="md-content">
                    <div class="confirm-tips">
                      <p>
                        <svg class="icon-status-ok">
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                        </svg>
                        <span>加入购物车成!</span></p>
                    </div>
                    <div class="btn-wrap">
                      <div><a href="javascript:;" class="btn btn&#45;&#45;m">继续购物</a> <a href="javascript:;"
                                                                                 class="btn btn&#45;&#45;m btn&#45;&#45;red">查看购物车</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div> &lt;!&ndash;&ndash;&gt;</div>
            <div>
              <div class="md-modal modal-msg md-modal-transition">
                <div class="md-modal-inner">
                  <div class="md-top">
                    <button class="md-close">Close</button>
                  </div>
                  <div class="md-content">
                    <div class="confirm-tips"><p>
                      您当前尚未登录！
                    </p></div>
                    <div class="btn-wrap">
                      <div><a href="javascript:;" class="btn btn&#45;&#45;m">关闭</a></div>
                    </div>
                  </div>
                </div>
              </div> &lt;!&ndash;&ndash;&gt;</div>-->
            <div class="md-overlay" v-show="filterbyPop" @click="closePop"></div>
          </div>
      </div>
    </div>
    <nav-footer></nav-footer>
  </div>
</template>

<!--从后台接口实现升序和分页-->
<script>
  import NavHeader from '@/components/NavHeader'
  import NavBread from '@/components/NavBread'
  import NavFooter from '@/components/NavFooter';
  import Modal from '@/components/Modal';
  // 引入请求数据插件
  import axios from 'axios'

  import {mapMutations} from 'vuex';
  import './../assets/css/base.css'
  import './../assets/css/product.css'
  export default {
    name: "GoodsList",
    data(){
      return {
        goodsList:[],
        priceFilterList:[
          {
            startPrice:'0.00',
            endPrice:'100.00'
          },
          {
            startPrice:'100.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },
          {
            startPrice:'1000.00',
            endPrice:'3000.00'
          }
        ],
        sortFlag:true, //按价格排序参数--默认为升序
        page:1, //当前页数
        pageSize:9, //每页多少条
        busy:true, //滚动加载默认为禁止
        loading:false,
        checkedPrice:-1,
        filterbyPop:false, //小屏幕价格区间是否显示
        mdShow:false,
        mdShowCart:false
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread,
      Modal

    },
    mounted(){
      this.getGoodsList()
    },
    methods:{
      ...mapMutations(['updateCartCount']),
      getGoodsList(flag,$state){
        let params = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag ? 1:-1,
          priceLevel:this.checkedPrice
        };
        this.$axios.get('/goods/list',{
          params:params
        }).then((response)=>{
          console.log(response.data.result.list);
          let res = response.data;
          if(res.status == '0'){
            if(flag){
              this.goodsList = this.goodsList.concat(res.result.list);
              if(res.result.count && res.result.count==this.pageSize){
                $state.loaded();
              }else {
                $state.complete();
              }
            }else {
              this.goodsList = res.result.list;
            }
          }else {
            this.goodsList = [];
          }

        })
      },
      sortPrice(){
        this.sortFlag = !this.sortFlag;
        this.page = 1;
        this.getGoodsList();
        this.$nextTick(() => {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
        });
      },
      infiniteHandler($state){
          this.page++;
          this.getGoodsList(true,$state);
      },
      filterPrice(index){
        this.page = 1;
        this.checkedPrice = index;
        this.filterbyPop = false;
        this.getGoodsList();
      },
      addCart(productId){
        this.$axios.post("/goods/addCart",{
          productId:productId
        }).then((res)=>{
          var res = res.data;
          if(res.status == '0'){
            this.mdShowCart = true;
            this.updateCartCount(1);
          }else {
            this.mdShow = true;
          }
        });
      },
      showFilterbyPop(){
        this.filterbyPop = true;
      },
      closePop(){
        this.filterbyPop = false;
      },
      closeModal(){
        this.mdShow = false;
        this.mdShowCart = false;
      }
    }
  }
</script>


<!--前端实现价格区间筛选-->
<!--<script>
  import NavHeader from '@/components/NavHeader'
  import NavBread from '@/components/NavBread'
  import NavFooter from '@/components/NavFooter'
  // 引入请求数据插件
  import axios from 'axios'
  import './../assets/css/base.css'
 import './../assets/css/product.css'
  export default {
    name: "GoodsList",
    data(){
      return {
        goodsList:[],
        priceFilterList:[
          {
            startPrice:'0.00',
            endPrice:'100.00'
          },
          {
            startPrice:'100.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },
          {
            startPrice:'1000.00',
            endPrice:'3000.00'
          }
        ],
        checkedPrice:-1,
        filterbyPop:false //小屏幕价格区间是否显示
      }
    },
    components: {
      NavHeader,
      NavFooter,
      NavBread

    },
    mounted(){
      this.getGoodsList(-1)
    },
    methods:{
      getGoodsList(index){
        axios.get('/goods').then(res=>{
          console.log(res.data.result.list);
          if(index != -1){
            //实现筛选
            let minPrice = parseInt(this.priceFilterList[index].startPrice);
            let maxPrice = parseInt(this.priceFilterList[index].endPrice);
            let result = res.data.result.list;
            let goodsList = result.filter((item,index)=>{
              if(parseInt(item.productPrice) > minPrice && parseInt(item.productPrice) < maxPrice) {
                return item;
              }
            })
            this.goodsList =goodsList;
          }else {
            this.goodsList = res.data.result.list;
          }

        })
      },
      filterPrice(index){
        console.log(index);
        this.checkedPrice = index;
        this.filterbyPop = false;
        this.getGoodsList(index);
      },
      showFilterbyPop(){
        this.filterbyPop = true;
      },
      closePop(){
        this.filterbyPop = false;
      }
    }
  }
</script>-->

<style scoped>

</style>
