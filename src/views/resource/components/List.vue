<template>
  <div class="resource-list">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="form" label-width="80px" :inline="true">
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select
              v-model="form.categoryId"
              placeholder="请选择资源分类"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in resourceCategories"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="btnList">
          <el-button @click="onSubmit" :disabled="isLoading"
            >查询搜索</el-button
          >
          <el-button @click="onReset" :disabled="isLoading">重置</el-button>
          <el-button @click="addOrEdit(false)" :disabled="isLoading"
            >新增</el-button
          >
          <el-button :disabled="isLoading" @click="jumpToResourceCategory"
            >资源分类</el-button
          >
        </div>
      </div>
      <el-table
        :data="resources"
        style="width: 100%; margin-bottom: 20px"
        v-loading="isLoading"
      >
        <el-table-column type="index" label="编号" min-width="100">
        </el-table-column>
        <el-table-column prop="name" label="资源名称" min-width="180">
        </el-table-column>
        <el-table-column prop="url" min-width="180" label="资源路径">
        </el-table-column>
        <el-table-column prop="description" min-width="180" label="描述">
        </el-table-column>
        <el-table-column min-width="180" prop="createdTime" label="添加时间">
          <template slot-scope="scope">
            {{ scope.row.createdTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column min-width="180" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="addOrEdit(true, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :disabled="isLoading"
        :current-page.sync="form.current"
        :page-sizes="[5, 10, 20]"
        :page-size="form.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
    <create-or-edit
      v-if="dialogVisible.show"
      :isEdit="isEdit"
      :dialogVisible="dialogVisible"
      :resourceCategories="resourceCategories"
      :editObj="editObj"
      :dialogRules="dialogRules"
      @success="onSuccess"
      @cancel="dialogVisible.show = false"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  getResourcePages,
  deleteResources,
  addOrEditResources
} from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'
import CreateOrEdit from './CreateOrEdit.vue'

export default Vue.extend({
  name: 'ResourceList',
  components: { CreateOrEdit },
  data() {
    return {
      resources: [], // 资源列表
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 10, // 每页大小
        categoryId: null // 资源分类
      },
      totalCount: 0,
      resourceCategories: [], // 资源分类列表
      isLoading: true, // 加载状态
      dialogVisible: {
        show: false
      },
      isEdit: false,
      editObj: {},
      dialogRules: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入资源路径', trigger: 'blur' }],
        categoryId: [
          { required: true, message: '请输入资源分类', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.loadResources()
    this.loadResourceCategories()
  },

  methods: {
    async loadResourceCategories() {
      const { data } = await getResourceCategories()
      this.resourceCategories = data.data
    },

    async loadResources() {
      this.isLoading = true // 展示加载中状态
      const { data } = await getResourcePages(this.form)
      this.resources = data.data.records
      this.totalCount = data.data.total
      this.isLoading = false // 关闭加载中状态
    },

    onSubmit() {
      this.form.current = 1 // 筛选查询从第 1 页开始
      this.loadResources()
    },

    handleDelete(item: any) {
      this.$confirm('确定删除该资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteResources(item.id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.loadResources()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    handleSizeChange(val: number) {
      this.form.size = val
      this.form.current = 1 // 每页大小改变重新查询第1页数据
      this.loadResources()
    },

    handleCurrentChange(val: number) {
      this.form.current = val // 修改要查询的页码
      this.loadResources()
    },

    onReset() {
      const form = this.$refs.form as Form
      form.resetFields()
      this.form.current = 1 // 重置回到第1页
      this.loadResources()
    },

    addOrEdit(flag: boolean, row: any) {
      this.isEdit = flag
      this.dialogVisible.show = true
      if (row) {
        this.editObj = JSON.parse(JSON.stringify(row))
      }
    },

    async onSuccess(param: any) {
      await addOrEditResources(param)
      this.$message.success('操作成功')
      this.dialogVisible.show = false // 关闭对话框
      this.loadResources() // 重新加载数据列表
    },

    jumpToResourceCategory() {
      this.$router.push({ name: 'resourceCategory' })
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
