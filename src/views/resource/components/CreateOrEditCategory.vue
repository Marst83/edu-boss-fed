<template>
  <div>
    <el-form label-width="80px" class="resourceDialog">
      <el-form-item prop="name" label="名称:">
        <el-input v-model="form.name" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item prop="sort" label="排序:">
        <el-input v-model="form.sort" style="width: 250px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="onSubmit">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CreateOrEditRole',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editObj: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        name: '',
        sort: '0'
      }
    }
  },

  created() {
    // 如果是编辑操作，则根据角色 ID 加载展示角色信息
    if (this.isEdit) {
      this.loadRole()
    }
  },

  methods: {
    loadRole() {
      this.form = this.editObj
    },

    onSubmit() {
      this.$emit('success', this.form)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
