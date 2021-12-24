<template>
  <el-container>
    <el-aside class="sidebar">
      <div class="aside">
        <el-menu
          class="el-menu-vertical-demo"
          default-active="4"
          background-color="#f8f9fb"
          router
          @select="handleMenuSelect"
          :collapse="isCollapse"
        >
          <span
            @click="logoClick"
            aria-current="page"
            class="logo router-link-exact-active router-link-active"
            title="回到首页"
            ><img :src="require('@/assets/logo.png')" alt="LagouEdu" />
            <h1 v-if="!isCollapse">Edu Boss</h1></span
          >
          <div v-for="(menu, index) in menuList" :key="index">
            <el-submenu :index="menu.path" v-if="menu.child">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span v-if="!isCollapse">{{ menu.name }}</span>
              </template>
              <el-menu-item
                :index="item.path"
                v-for="item in menu.child"
                :key="item.path"
              >
                <i class="el-icon-setting"></i>
                <span slot="title">{{ item.name }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="menu.path" v-if="!menu.child">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ menu.name }}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </div>
    </el-aside>
    <el-container>
      <el-header class="navbar">
        <app-header :breadcrumbList="breadcrumbList" @handChange="handChange" />
      </el-header>
      <el-main>
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import AppHeader from './components/app-header.vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'LayoutIndex',
  components: {
    AppHeader
  },
  data() {
    return {
      menuList: [
        {
          path: '权限管理',
          name: '权限管理',
          className: 'el-icon-location',
          child: [
            {
              path: '/role',
              className: 'el-icon-setting',
              name: '角色管理'
            },
            {
              path: '/menu',
              className: 'el-icon-setting',
              name: '菜单管理'
            },
            {
              path: 'resource',
              className: 'el-icon-setting',
              name: '资源管理'
            }
          ]
        },
        {
          path: '/course',
          className: 'el-icon-menu',
          name: '课程管理'
        },
        {
          path: '/user',
          className: 'el-icon-document',
          name: '用户管理'
        },
        {
          path: '广告管理',
          name: '广告管理',
          className: 'el-icon-location',
          child: [
            {
              path: '/advert',
              className: 'el-icon-setting',
              name: '广告列表'
            },
            {
              path: '/advert-space',
              className: 'el-icon-setting',
              name: '广告位列表'
            }
          ]
        }
      ],
      indexBreadcrumbs: [''],
      breadcrumb: []
    }
  },
  methods: {
    handleMenuSelect(index: string, indexPath: Array<string>) {
      this.indexBreadcrumbs = indexPath
    },
    handChange(flag: boolean) {
      if (flag) {
        this.indexBreadcrumbs = ['/course']
      }
      this.$emit('hand-change', this.breadcrumbList)
    },
    logoClick() {
      if (this.$route.name === 'home') return
      this.$router.push({ name: 'home' })
      this.indexBreadcrumbs = ['/course']
    }
  },
  watch: {
    $route() {
      this.handChange(false)
    }
  },
  computed: {
    ...mapState(['isCollapse']),
    breadcrumbList() {
      const breadcrumb: any = []
      let menuList = JSON.parse(JSON.stringify(this.menuList))
      this.indexBreadcrumbs.forEach((indexBreadcrumb) => {
        menuList.forEach((item: any) => {
          if (indexBreadcrumb === item.path) {
            breadcrumb.push(item)
            if (item.child) {
              menuList = item.child
            }
          }
        })
      })
      return breadcrumb
    }
  }
})
</script>

<style lang="scss" scoped>
.el-container {
  min-height: 100vh;
  // min-width: 980px;
}

.el-aside {
  background: #d3dce6;
}

.el-header {
  background: #fff;
}

.el-main {
  background: #e9eef3;
}
.sidebar {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: auto !important;
  max-height: 100vh;
  background-color: #f8f9fb;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.sidebar .logo {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  text-align: center;
  color: #495057;
  cursor: pointer;
}
.sidebar .logo:hover {
  color: #343a40;
  background-color: rgba(0, 0, 0, 0.05);
}
.sidebar .logo img {
  margin: 10px;
  width: 30px;
}
.navbar {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 0 !important;
  background-color: #f8f9fb;
}
.el-menu-vertical-demo {
  border-right: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
