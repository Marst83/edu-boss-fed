import request from '@/utils/request'

export const getAllSpaces = () => {
  return request({
    method: 'GET',
    url: '/front/ad/space/getAllSpaces'
  })
}

export const saveOrUpdate = (data: any) => {
  return request({
    method: 'POST',
    url: '/front/ad/space/saveOrUpdate',
    data
  })
}
