import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";
import api from "@/api";
import store from "@/store";
import { Toast } from "vant";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
// 如果跳转到页面是(个人中心,编辑个人信息, 收藏)做拦截
router.beforeEach(async (to, from, next) => {
  let arr = ["/person", "/updateperson", "store"];
  if (arr.includes(to.path)) {
    // 校验是否登录
    let isLogin = store.state.isLogin;
    if (isLogin) {
      next(); //已登录,不做拦截
      return;
    }
    if (isLogin === false) {
      Toast("小主，请您先登录哦~");
      next("/login"); //未登录,先跳转到登录页,进行登录
      return;
    }
    if (isLogin === null) {
      //如果为null 跳转登录页  同时调取接口校验是否登录 通过commi同步vuex管理的状态
      try {
        let { code, data } = await api.checkLogin();
        if (+code !== 0) {
          Toast("小主，请您先登录哦~");
          next("/login");
          return;
        }
        store.commit("changeIsLogin", true);
        store.commit("changeInfo", data);
        next();
      } catch (error) {}
      return;
    }
  }

  next();
});

export default router;
