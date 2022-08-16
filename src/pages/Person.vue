<template>
  <Nav />
  <div class="base-info" v-if="info">
    <img :src="info.pic" alt="" @click="$router.push('/updateperson')"/>
    <p>{{info.name}}</p>
  </div>
  <van-cell-group>
    <van-cell title="我的收藏" is-link url="#/store" />
    <van-cell title="退出登录" @click="signout" />
  </van-cell-group>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { onBeforeMount, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { Toast } from "vant";

export default {
  components: { Nav },
  name: "Person",
  setup() {
    const store = useStore();
    const router = useRouter();
    const signout = () => {
      Toast("小主，您已经安全退出~");
      localStorage.removeItem("token");
      store.commit("changeIsLogin", null);
      store.commit("changeInfo", null);
      store.commit('changeStoreList', null);
      router.replace("/login");
    };
    // 计算属性vuex中的用户的所有信息
    let info = computed(() => {
      let { isLogin, info} = store.state;
      if(isLogin && info) {
        return info;
      }
      return null;
    })

    // 渲染之前获得用户的 isLogin / info，并存储到vuex中
    onBeforeMount(() => {
      let {isLogin, info} = store.state;
      if(isLogin === null) {
        store.dispatch('changeAsyncIsLogin')
      }
      if(info === null) {
        store.dispatch('changeAsyncInfo')
      }
    })

    return {
      signout,
      info
    };
  },
};
</script>

<style lang="less" scoped>
.base-info {
  box-sizing: border-box;
  margin: 20px 0;

  img {
    display: block;
    margin: 0 auto;
    width: 86px;
    height: 86px;
    border-radius: 50%;
  }

  p {
    line-height: 50px;
    font-size: 18px;
    text-align: center;
  }
}
</style>
