<template>
  <van-nav-bar
    :title="title"
    left-text="返回"
    left-arrow
    @click-left="handler"
  />
</template>

<script>
import { useRouter, useRoute } from "vue-router";
export default {
  name: "Nav",
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  setup() {
    const router = useRouter(),
      route = useRoute();
    const handler = () => {
      router.back();
    };
    
    return {
      handler,
    };
  },
};
</script>

<style lang="less" scoped>
/deep/ .van-icon,
/deep/ .van-nav-bar__text {
  color: #000;
}
</style>
