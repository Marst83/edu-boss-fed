import dayjs from 'dayjs'
import Vue from 'vue'

function dateFormat(value:string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs(value).format(format)
}

Vue.filter('dateFormat', dateFormat)
