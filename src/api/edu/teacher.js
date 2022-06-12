import request from '@/utils/request'

export default {
  // current 当前页
  // limit 每一页中携带数据的条目数量
  // teacherQuery 查询条件
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      // url: '/edu/edu/pageTeacherCondition/' + current + '/' + limit,
      url: `/edu/teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post', // 和后端请求的接口需要对应一致的方法

      // 条件对象
      // 把对象转换成为 json 传递到后端
      data: teacherQuery
    })
  },
  deleteTeacherId(id) {
    return request({
      // url: '/edu/edu/pageTeacherCondition/' + current + '/' + limit,
      url: `/edu/teacher//${id}`,
      method: 'delete' // 和后端请求的接口需要对应一致的方法
    })
  },
  addTeacher(teacher) {
    return request({
      // url: '/edu/edu/pageTeacherCondition/' + current + '/' + limit,
      url: `/edu/teacher/addTeacher`,
      method: 'post', // 和后端请求的接口需要对应一致的方法
      data:teacher    // 将 teacher 对象封装，传递到后端中
    })
  },
  getTeacherInfo(id) {
    return request({
      url: `/edu/teacher/getTeacher/${id}`,
      method: 'get', // 和后端请求的接口需要对应一致的方法
    })
  },
  updateTeacherInfo(teacher) {
    return request({
      url: `/edu/teacher/updateTeacher/`,
      method: 'post', // 和后端请求的接口需要对应一致的方法
      data:teacher // 向后端传递的数据，也就是需要修改的地方的数据
    })
  }
}
