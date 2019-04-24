import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store  = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateNickName(state,name){
      state.nickName = name;
    },
    updateCartCount(state,cartCount){
      state.cartCount += parseInt(cartCount);
    },
    initCartCount(state,cartCount){
      state.cartCount = parseInt(cartCount);
    }
  }
})

export default store;
