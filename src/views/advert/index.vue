<template>
  <div class="advert">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :inline="true">
          <el-button
            v-loading="loading"
            @click="$router.push({ name: 'addAdvertise' })"
            >添加广告</el-button
          >
        </el-form>
      </div>
      <el-table :data="adList" style="width: 100%" v-loading="loading" border>
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="name" label="广告名称" align="center" />
        <el-table-column
          prop="spaceId"
          label="广告位置"
          align="center"
          :formatter="adSpaceFormat"
        />
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.img" style="height: 80px" />
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="时间" align="center">
          <template slot-scope="scope">
            <div>开始时间：{{ scope.row.startTimeFormatString }}</div>
            <div>到期时间：{{ scope.row.endTimeFormatString }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="上线/下线" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)"
            />
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
import { getAdList, updateStatus } from '@/services/advert'
import { getAllSpaces } from '@/services/advert-space'
import { adSpaceFormat } from '@/utils/format'

export default Vue.extend({
  name: 'AdvertIndex',
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
      const arr = await Promise.all([getAdList(), getAllSpaces()])
      const adList = arr[0].data.content
      this.spaceList = arr[1].data.content
      adList.forEach((item: any) => {
        item.isStatusLoading = false
      })
      this.adList = adList
      this.loading = false
    },

    adSpaceFormat(row: any) {
      return adSpaceFormat(row.spaceId, this.spaceList)
    },

    handleSizeChange(val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1 // 每页大小改变重新查询第1页数据
      this.loadAdPage()
    },

    handleCurrentChange(val: number) {
      this.form.currentPage = val // 修改要查询的页码
      this.loadAdPage()
    },

    async onStateChange(row: any) {
      const statusTemp = row.status === 0 ? 1 : 0
      row.isStatusLoading = true
      this.$confirm('是否要修改上线/下线状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await updateStatus(row.id, row.status)
          this.$message.success('操作成功')
        })
        .catch(() => {
          row.status = statusTemp
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
      row.isStatusLoading = false
    },

    edit(row: any) {
      const editObj = JSON.parse(JSON.stringify(row))
      const spaceList = JSON.parse(JSON.stringify(this.spaceList))
      this.$router.push({
        name: 'addAdvertise',
        params: {
          editObj,
          isEdit: '1',
          spaceList
        }
      })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
