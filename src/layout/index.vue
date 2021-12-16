<template>
  <el-container>
    <el-aside width="200px" class="sidebar">
      <div class="aside">
        <el-menu
          default-active="4"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
          @select="handleMenuSelect"
        >
          <div v-for="(menu, index) in menuList" :key="index">
            <el-submenu :index="menu.path" v-if="menu.child">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ menu.name }}</span>
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
      <el-header>
        <app-header :breadcrumbList="breadcrumbList" />
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
    handChange() {
      this.$emit('hand-change', this.breadcrumbList)
    }
  },
  watch: {
    $route() {
      this.handChange()
    }
  },
  computed: {
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
  max-height: 100vh;
  background-color: #f8f9fb;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.aside {
  .el-menu {
    min-height: 100vh;
  }
}
</style>
