<template>
  <div class="users">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <span>筛选搜索</span> -->
        <el-form ref="form" :model="form" :inline="true">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="注册时间" prop="createTime">
            <el-date-picker
              v-model="form.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" :disabled="loading"
              >查询搜索</el-button
            >
            <el-button :disabled="loading" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="userInfoList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="用户ID" />
        <el-table-column label="头像">
          <template slot-scope="scope">
            <el-avatar
              :size="35"
              :src="
                scope.row.portrait ||
                'http://www.lgstatic.com/thumbnail_100x100/i/image2/M01/5E/65/CgotOVszSAOANi0LAAAse2IVWAE693.jpg'
              "
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <i
              :class="[
                'status',
                scope.row.status === 'ENABLE' ? 'status-success' : 'status-fail'
              ]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="注册时间">
          <template slot-scope="scope">
            {{ scope.row.createdTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="forbidUser(scope.row.id)"
                >禁用</el-button
              >
              <el-button
                size="mini"
                type="text"
                @click="distributionRole(scope.row.id)"
                >分配角色</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="loading"
        :current-page.sync="form.currentPage"
        :page-sizes="[5, 10, 20]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
    <el-dialog title="分配角色" :visible.sync="dialogVisible.show" width="30%">
      <el-select v-model="roleIdList" multiple placeholder="请选择">
        <el-option
          v-for="item in roles"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible.show = false">取 消</el-button>
        <el-button type="primary" @click="handleAllocRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getUserPages, forbidUser } from '@/services//user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/services/role'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'UserIndex',
  data() {
    return {
      userInfoList: [], // 用户管理列表
      form: {
        currentPage: 1,
        pageSize: 20,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        createTime: ''
      }, // 查询条件
      totalCount: 0,
      loading: false,
      dialogVisible: {
        show: false
      },
      roleId: 0, // 编辑角色的 ID
      isEdit: false,
      roles: [],
      roleIdList: []
    }
  },

  created() {
    this.loadUserPages()
  },

  methods: {
    async loadUserPages() {
      this.loading = true
      const { data } = await getUserPages(this.form)
      this.userInfoList = data.data.records
      this.totalCount = data.data.total
      this.loading = false
    },

    onSubmit() {
      if (this.form.createTime && this.form.createTime.length > 0) {
        this.form.startCreateTime = this.form.createTime[0]
        this.form.endCreateTime = this.form.createTime[1]
      }
      this.loadUserPages()
    },

    async forbidUser(id: number) {
      try {
        await forbidUser({ userId: id })
        this.$message.success('禁用成功')
      } catch (error) {
        console.log(error)
      }
    },

    onReset() {
      const form = this.$refs.form as Form
      form.resetFields()
      this.form = {
        currentPage: 1,
        pageSize: 20,
        phone: '',
        startCreateTime: '',
        endCreateTime: '',
        createTime: ''
      }
      this.loadUserPages()
    },

    handleSizeChange(val: number) {
      this.form.pageSize = val
      this.form.currentPage = 1 // 每页大小改变重新查询第1页数据
      this.loadUserPages()
    },

    handleCurrentChange(val: number) {
      this.form.currentPage = val // 修改要查询的页码
      this.loadUserPages()
    },

    async distributionRole(id: number) {
      this.roleId = id
      const { data } = await getAllRoles()
      this.roles = data.data

      const {
        data: { data: userRoles }
      } = await getUserRoles(this.roleId)
      this.roleIdList = userRoles.map((item: any) => item.id)

      // 展示对话框
      this.dialogVisible.show = true
    },

    async handleAllocRole() {
      await allocateUserRoles({
        userId: this.roleId,
        roleIdList: this.roleIdList
      })
      this.$message.success('操作成功')
      this.dialogVisible.show = false
    }
  }
})
</script>

<style lang="scss" scoped>
.status {
  display: inline-block;
  cursor: pointer;
  width: 0.875rem;
  height: 0.875rem;
  vertical-align: middle;
  border-radius: 50%;
}
.status-success {
  background: #51cf66;
}
.status-fail {
  background: #fb1804;
}
</style>
