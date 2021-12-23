export function adSpaceFormat(data: number, list: Array<any>) {
  let result = ''
  list.forEach(item => {
    if (item.id === data) {
      result = item.name
    }
  })
  return result
}
