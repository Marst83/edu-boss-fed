import request from '@/utils/request'

export const getAdList = () => {
  return request({
    method: 'GET',
    url: '/front/ad/getAdList'
  })
}

export const updateStatus = (id:number, status: number) => {
  return request({
    method: 'GET',
    url: '/front/ad/updateStatus',
    params: {
      id,
      status
    }
  })
}
