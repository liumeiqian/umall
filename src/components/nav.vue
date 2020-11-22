<template>
  <div>
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#F39C12"
      router
    >
      <el-menu-item index="/home">
        <i class="el-icon-menu"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-submenu
        :index="item.id.toString()"
        v-for="item in getUserInfo.menus"
        :key="item.id"
      >
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </template>

        <el-menu-item
          :index="menu.url"
          v-for="menu in item.children"
          :key="menu.id"
        >
          <span slot="title">{{ menu.title }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { getMenuList } from "../utils/axios";

export default {
  data() {
    return {
      defaultActive: "/home",
      // menuList: [],
      // menus: [],
    };
  },
  mounted() {
    // 组件一加载就会触发
    // console.log(this.$route.path);
    this.defaultActive = this.$route.path;
    this.menus = JSON.parse(sessionStorage.getItem("userInfo")).menus;
  },
  computed: {
    // ...mapGetters({
    //   menuList: "menu/getMenuList",
    // }),
    ...mapGetters(["getUserInfo"]),
  },
  methods: {
    // ...mapActions({
    //   getMenuList: "menu/getMenuListAction",
    // }),
  },
};
</script>

<style lang="stylus" scoped></style>