<template>
  <div class="app-container">
    讲师列表
    <!--  条件查询在表的顶部-->
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查
        询
      </el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中......"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80"/>

      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level === 1 ? '高级讲师' : '首席讲师' }}
        </template>
      </el-table-column>

      <el-table-column prop="intro" label="资历"/>

      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete"

                     @click="removeDataById(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>


<script>
// 引用 teacher.js 文件
import teacher from "@/api/edu/teacher";
import axios from "axios";

export default {
  // 写核心代码
  data() { // 定义变量以及初始值
    return {
      list: null, // 查询之后，接口返回集合
      page: 1,    // 当前页
      limit: 6,  // 每页记录数
      total: 0, // total number
      teacherQuery: {} // 条件封装对象
    }
  },
  created() { // 页面渲染之前执行 methods 放置执行结束之前执行
    // 下面的方法 methods 只是写了，在这里需要调用才能执行
    // created 调用 methods 里面的方法
    this.getList()
  },
  methods: { // 创建具体的方法，调用 teacher.js 定义的方法
    /**
     * 下面方法整体的执行逻辑：
     *    调用 api 里面的方法，并且将需要传递到后端的参数先传递到 api 中
     *    api 将参数封装好成一个访问路径，
     *    然后拿着访问路径访问后端的方法，
     *    如果可以拿到后端返回的数据，说明执行成功了，
     *    如果拿不到后端的数据，那么就是执行失败了
     */
    getList(page = 1) { // put three paras in follow method
      this.page = page

      teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then(response => { // request success
          // response the data from behind
          console.log(response)
          this.list = response.data.rows
          this.total = response.data.total
          console.log(this.list)
          console.log(this.total)
        })
        .catch(error => { // request fail
          console.log(error)
        })
    },
    resetData() { // 清空的方法
      // 表单中的所有数据清空
      this.teacherQuery = {}

      // 查询所有讲师数据
      this.getList()
    },
    removeDataById(id) { // 删除讲师的方法，根据讲师的 id 将其删除

      this.$confirm('此操作将永久删除讲师记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 确认方法

        teacher.deleteTeacherId(id)
          .then(response => {
            // 删除成功，提示删除成功的会话框
            this.$message({
              type: 'success',
              message: '删除成功!' // 逻辑删除在底层的数据库中，只是 is_deleted 字段从 0 变成了 1 ；
            });

            // 回到列表页面
            this.getList()
          })
      })
    }
  }
}
</script>
