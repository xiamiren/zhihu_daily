<template>
  <van-skeleton title :row="5" v-if="newsInfo === null" />
  <div class="content" v-else v-html="newsInfo.body"></div>

  <div class="nav-box">
    <van-icon name="arrow-left" @click="handle" />
    <van-icon name="comment-o" :badge="comments" />
    <van-icon name="good-job-o" :badge="popularity" />
    <van-icon
      name="star-o"
      :color="isStore ? '#1989fa' : '#000'"
      @click="storeHandle"
    />
    <van-icon name="share-o" color="#ccc" />
  </div>
</template>

<script>
import api from '@/api'
import { useRouter, useRoute } from 'vue-router'
import {
  reactive,
  toRefs,
  onBeforeMount,
  onBeforeUnmount,
  onUpdated,
  computed
} from 'vue'
import { useStore } from 'vuex'
import { Toast } from 'vant'

export default {
  name: 'Detail',
  setup() {
    const router = new useRouter(),
      route = useRoute(),
      store = useStore()

    let state = reactive({
      comments: 0, //评论数
      popularity: 0, //点赞数
      newsInfo: null //新闻信息
    })
    let isLogin = computed(() => {
      return store.state.isLogin
    })
    let storeList = computed(() => {
      return store.state.storeList || []
    })
    let isStore = computed(() => {
      let { isLogin, storeList } = store.state
      if (isLogin) {
        // 判断是否登录，并检查收藏列表中是否有该项
        if (!Array.isArray(storeList)) storeList = []
        return storeList.some(item => {
          return +item.news.id === +route.params.id
        })
      }
    })
    const storeHandle = async () => {
      // 是否登录
      if (!store.state.isLogin) {
        Toast('小主请先登录')
        router.push({
          path: '/login',
          query: {
            from: `detail/${route.params.id}`
          }
        })
        return
      }
      // 如果已经收藏，则移除收藏 ？
      if (isStore.value) return
      /* 发送收藏请求 */
      let { code } = await api.store(route.params.id)
      if (+code !== 0) {
        Toast('小主，很遗憾，收藏失败')
        return
      }
      Toast('小主很棒，收藏成功了~')
      // 更新vuex中的storeList的数据
      store.dispatch('changeStoreListAsync')
    }

    onBeforeMount(async () => {
      if (store.state.isLogin === null) {
        await store.dispatch('changeAsyncIsLogin')
      }
      if (store.state.isLogin) {
        if (store.state.info === null) store.dispatch('changeAsyncInfo')
        if (store.state.storeList === null) {
          store.dispatch('changeStoreListAsync')
        }
      }
    })

    onBeforeMount(async () => {
      let id = route.params.id
      let result = await api.queryNewsInfo(id) //获取的当前id的信息
      // 页面的内容信息
      state.newsInfo = result
      // 动态创建css
      let link = document.createElement('link')
      link.id = 'link'
      link.rel = 'stylesheet'
      link.href = state.newsInfo.css[0]
      document.head.appendChild(link)
      let { popularity, comments } = await api.queryNewsStory(id)
      state.comments = comments //评论数
      state.popularity = popularity //点赞数
    })

    onUpdated(() => {
      let imgPlaceHolder = document.querySelector('.img-place-holder')
      if (imgPlaceHolder) {
        if (imgPlaceHolder.innerHTML.trim() === '') {
          imgPlaceHolder.innerHTML += `<img src="${state.newsInfo.image}" />`
          imgPlaceHolder.innerHTML += `<div class="mask">
            <h2 class="title">
              ${state.newsInfo.title}
            </h2>
          </div>`
        }
      }
    })

    onBeforeUnmount(() => {
      // 移除css，防止与其他页面的样式发生冲突
      let link = document.getElementById('link')
      if (!link) return
      document.head.removeChild(link)
    })

    const handle = function() {
      router.back()
    }
    return {
      handle,
      ...toRefs(state),
      isLogin,
      storeList,
      isStore,
      storeHandle
    }
  }
}
</script>

<style lang="less" scoped>
  .van-skeleton {
    padding: 30px 15px;
  }

  .content {
    background-color: #fff;
    padding-bottom: 50px;
    margin-top: 0;
    // 在scoped直接使用less,scss修改vant样式是无效的,需要添加deep来设置样式,即影响子元素
    /deep/ .img-place-holder {
      position: relative;
      height: 375px;
      overflow: hidden;

      img {
        display: block;
        margin: 0;
        width: 100%;
        height: 100%;
      }

      .mask {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 200px;
        background: -webkit-linear-gradient(
          bottom,
          rgba(0, 0, 0, 0.3),
          rgba(0, 0, 0, 0)
        );

        .title {
          position: absolute;
          bottom: 20px;
          left: 10px;
          padding: 0 20px;
          font-size: 20px;
          color: #fff;
        }
      }
    }
  }

  .nav-box {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;
    width: 100%;
    height: 50px;
    background-color: #f4f4f4;

    .van-icon:nth-child(1) {
      position: relative;

      &::after {
        position: absolute;
        top: -10%;
        right: -15px;
        content: '';
        width: 1px;
        height: 120%;
        background: #d5d5d5;
      }
    }

    /deep/ .van-badge {
      background: transparent;
      border: none;
      color: #000;
      right: -5px;
    }
  }
</style>
