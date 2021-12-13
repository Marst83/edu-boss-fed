/**
 * 资源分类相关请求模块
 */

import request from '@/utils/request'

interface resourceCategoriesObj {
  name: string
  sort: string
}

export const getResourceCategories = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

export const deleteResourceCategories = (id:number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/category/${id}`
  })
}

export const addOrEditResourceCategories = (data:resourceCategoriesObj) => {
  return request({
    method: 'POST',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}
