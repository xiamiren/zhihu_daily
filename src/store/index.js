import { createStore, createLogger } from 'vuex';
import api from '../api';
const env = process.env.NODE_ENV;

const store = createStore({
  state: {
    isLogin: null,
    info: null,
    storeList: null
  },
  mutations: {
    changeIsLogin(state, bool) {
      state.isLogin = bool;
    },
    changeInfo(state, payload) {
      state.info = payload
    },
    changeStoreList(state, payload) {
      state.store = payload;
    },
    removeStoreList(state, id) {
      if(state.storeList !== null) return;
      state.storeList = state.storeList.filter(item => {
        return +item.id !== +id;
      })
    }
  },
  actions: {
    async changeAsyncIsLogin({commit}){
      let bool = false;
      let { code } = await api.checkLogin();
      if( +code === 0) bool = true;
      commit('changeIsLogin', bool)
    },
    async changeAsyncInfo({commit}) {
      let { code, data } = await api.userInfo();
      if (+code == 0) {
        commit('changeInfo', data)
      }
    },
    async changeStoreListAsync({commit}) {
      let { code, data } = await api.storeList();
      if (+code == 0) data = [];
      commit('changeStoreList', data);
    }
  },
  plugins: env === 'production' ? [] : [createLogger()]
})

export default store;