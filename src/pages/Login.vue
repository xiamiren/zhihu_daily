<template>
  <Nav />
  <van-form ref="formBox" @submit="submit">
    <van-cell-group inset>
      <!-- 手机号 -->
      <van-field
        v-model="phone"
        center
        label="手机号"
        label-width="50px"
        name="phone"
        :rules="[
          { required: true, message: '手机号为必填项' },
          { pattern: regPhone, message: '手机号格式不对哦~' },
        ]"
      >
        <template #button>
          <van-button
            size="small"
            :type="enable ? 'primary' : ''"
            @click="sendcode"
            class="form-btn"
            :disabled="!enable"
          >
            {{ enable ? "发送验证码" : time }}
          </van-button>
        </template>
      </van-field>
      <!-- 验证码 -->
      <van-field
        v-model="code"
        label="验证码"
        label-width="50px"
        :rules="[
          { required: true, message: '验证码为必填项' },
          { pattern: regCode, message: '验证码必须是六位数字哦' },
        ]"
      />
    </van-cell-group>

    <!-- 登录/注册按钮 -->
    <div style="margin: 20px 40px">
      <van-button round block type="primary" native-type="submit">
        立即登录/注册
      </van-button>
    </div>
  </van-form>
</template>

<script>
import Nav from "@/components/Nav.vue";
import { reactive, toRefs, ref } from "vue";
import api from "../api/index";
import { Toast } from "vant";
import { useStore} from 'vuex';
import{useRouter, useRoute} from 'vue-router'
export default {
  components: { Nav },
  name: "Login",
  setup() {
    const store = useStore(),
     router = useRouter(),
     route = useRoute();

    let state = reactive({
      phone: "",
      code: "",
      enable: true,
      time: "60s",
    });
    let formBox = ref(null);
    // 发送验证码
    const sendcode = async () => {
      try {
        // 校验手机号
        await formBox.value.validate("phone");
        // 发送请求
        let { code } = await api.phoneCode(state.phone);
        if (+code !== 0) {
          Toast("当前网络繁忙，请稍后再试！");
          return;
        }
        // 开启倒计时
        state.enable = false;
        state.time = `10s`;
        let n = 10;
        let timer = setInterval(() => {
          n--;
          if (n === 0) {
            clearInterval(timer);
            state.enable = true;
            return;
          }
          state.time = `${n}s`;
        }, 1000);
      } catch (error) {}
    };
    // 表单提交
    const submit = async () => {
      // 登录
      let { code, token } = await api.login(state.phone, state.code);
      // 通过code，验证是否登录成功
      if(+code !== 0) {
        Toast('小主很遗憾，当前登录失败了!');
        formBox.value.resetValidation();
        state.code = '';
        return;
      }
      // 存储token信息
      localStorage.setItem('token', token);
      // 存储是否登录的状态
      store.commit('changeIsLogin', true);
      // 存储获取到的登录的信息
      store.dispatch('changeAsyncInfo')
      // 清除vuex中已有的storelist的信息
      store.commit('changeStoreList', null);
      Toast('小主真棒，当前登录成功了!');
      let from = route.query.from;
      // route中如果有from跳转到from，没有from跳转到个人中心
      if(from) {
        router.replace(`/${from}`);
        return;
      }
      router.replace(`/person`);
    };

    return {
      ...toRefs(state),
      formBox,
      regPhone: /^1\d{10}/,
      regCode: /\d{6}/,
      sendcode,
      submit,
    };
  },
};
</script>

<style lang="less" scoped>
.van-form {
  margin-top: 30px;

  .form-btn {
    width: 78px;
  }
}
</style>
