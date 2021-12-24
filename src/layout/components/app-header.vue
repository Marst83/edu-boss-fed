<template>
  <div class="header">
    <div class="leftHeader">
      <el-button class="hamburger" type="text" @click="handleCollapse">
        <i :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" />
      </el-button>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="home" @click.native="breadcrumbToHome"
          >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbList"
          :key="index"
          >{{ item.name }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>

    <el-dropdown>
      <span class="el-dropdown-link">
        <el-avatar
          shape="square"
          :size="40"
          :src="userInfo.portrait || require('@/assets/default-avatar.png')"
        ></el-avatar>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="handleLogout"
          >退出</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserInfo } from '@/services/user'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'AppHeader',
  props: {
    breadcrumbList: {
      type: Array
    }
  },
  data() {
    return {
      userInfo: {} // 当前登录用户信息
    }
  },
  created() {
    this.loadUserInfo()
  },
  computed: {
    ...mapState(['isCollapse'])
  },
  methods: {
    async loadUserInfo() {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },

    handleLogout() {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 确认执行
          this.$store.commit('setUser', null)
          this.$router.push({
            name: 'login'
          })
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          // 取消执行
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    },
    breadcrumbToHome() {
      debugger
      if (this.$route.name === 'home') return
      this.$router.push({ name: 'home' })
      this.$emit('handChange', true)
    },
    handleCollapse() {
      this.$store.commit('setIsCollapse', !this.isCollapse)
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
  .home {
    cursor: pointer;
  }
  .leftHeader {
    display: flex;
    i {
      cursor: pointer;
      padding-right: 10px;
      width: 26px;
    }
    .hamburger {
      margin-right: 10px;
      padding: 15px;
      font-size: 20px;
      border: 0;
      border-radius: 0;
    }
    .hamburger:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .el-breadcrumb {
    line-height: 3.5;
  }
  .el-button--text:focus,
  .el-button--text:hover {
    color: #66798c;
    border-color: transparent;
    background-color: transparent;
  }
}
</style>
