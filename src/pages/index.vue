<template>
  <div>
    <el-container>
      <el-header>
        <div class="title" v-if="username">
          <h2>{{ username }}</h2>
          <el-button type="danger" @click="logout">退出</el-button>
        </div>
        <h2 class="title">XXX大型后台管理项目</h2>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 导航菜单 -->
          <v-nav></v-nav>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vNav from "@/components/nav";

export default {
  data() {
    return {
      username: "",
    };
  },
  components: {
    vNav,
  },
  mounted() {
    // console.log(JSON.parse(sessionStorage.getItem('userInfo')).username);
    this.username = JSON.parse(sessionStorage.getItem("userInfo")).username;
  },
  methods: {
    logout(){
      sessionStorage.removeItem('userInfo');
      this.$message.success('已成功退出')
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';

.title {
  display: inline-block;
  margin: 0 20px 0 0;
}
h2 {
  display inline-block
  margin-right 20px
}
.el-header {
  width: 100vw;
  height: 10vh;
  background-color: #fff;
  background-color: $thirdBgColor;
  line-height: 8vh;
}

.el-aside {
  height: 92vh;
  background-color: #545c64;
}
</style>