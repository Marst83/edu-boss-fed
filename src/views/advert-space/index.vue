<template>
  <div class="advert-space">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :inline="true">
          <el-button
            v-loading="loading"
            @click="$router.push({ path: '/addAdvertiseSpace' })"
            >添加广告位</el-button
          >
        </el-form>
      </div>
      <el-table
        :data="spaceList"
        style="width: 100%"
        v-loading="loading"
        border
      >
        <el-table-column prop="spaceKey" label="spaceKey" align="center" />
        <el-table-column prop="name" label="广告名称" align="center" />
        <el-table-column prop="createdTime" label="创建时间" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | dateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="更新时间" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.updateTime | dateFormat }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getAllSpaces } from '@/services/advert-space'

export default Vue.extend({
  name: 'AdvertSpaceIndex',
  data() {
    return {
      adList: [], // 广告列表
      form: {
        currentPage: 1,
        pageSize: 20
      }, // 查询条件
      totalCount: 0,
      loading: false,
      dialogVisible: {
        show: false
      },
      roleId: 0, // 编辑角色的 ID
      isEdit: false,
      roles: [],
      spaceList: []
    }
  },

  created() {
    this.loadAdPage()
  },

  methods: {
    async loadAdPage() {
      this.loading = true
      const { data } = await getAllSpaces()
      this.spaceList = data.content
      this.loading = false
    },

    edit(row: any) {
      const editObj = JSON.parse(JSON.stringify(row))
      this.$router.push({
        name: 'addAdvertiseSpace',
        params: {
          editObj,
          isEdit: '1'
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
