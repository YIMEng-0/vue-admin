<template>
  <div class="app-container">
    讲师添加
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right"
                         min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--
          数据类型一定要和取出的json中的一致，则没法使用
          因此，这个 value 使用动态倦定的值，保证其数据类型是 number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像：TODO -->
      <el-form-item label="讲师头像">
        <!-- 头像缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload"
                   @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
          v-show：是否显示上传组件
          :key：类似于id，唯一标识，可以做区分
          :url：上传到后端的 url 地址 ，也就是 controller 里面的地址
          @close：关闭上传组件
          @crop-upload-success：上传成功后的
        -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduoss/fileoss'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary"
                   @click="saveOrUpdate">保存
        </el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import teacherApi from "@/api/edu/teacher";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";

export default {
  components: {ImageCropper, PanThumb },
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      // 上传弹窗的组件是不是显示
      imagecropperShow: false,
      // 上传弹窗的组件的唯一标识
      imagecropperKey: 0,
      BASE_API:process.env.BASE_API, // 获取dev.env.js
      saveBtnDisabled: false
    }
  },
  created() { // 在页面渲染之前就会执行
    // 表示得到路由中的信息，路由中存在 id 数值进行回显
    this.init()
  },
  watch: {
    $route(to, from) { // 路由发生变化，这个方法就会执行
      console.log('watch $route')
      this.init()
    }
  },
  methods: {
    // 关闭上传弹窗的方法
    close() {
      this.imagecropperShow = false

      // 上传组件的初始化
      this.imagecropperKey = this.imagecropperKey + 1
    },

    // 上传成功之后的方法
    cropSuccess(data) {
      this.imagecropperShow = false
      // 将上传成功的图片地址赋值给讲师的头像，保存到数据库，后面从数据库中取出来按照这个地址存取
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey + 1
    },
    init() {
      // 根据路径中是不是存在 id 做出来判断，存在 id 的话，说明用户想要更新数据，这个时候从数据库获取数据，进行前端的回显
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.getInfo(id)
      } else { // 没有 id 清空表单即可 // 只会执行一次 多次的路由跳转到达同一个页面， create 方法只会执行一次
        this.teacher = {}
      }
    },
    getInfo(id) {
      teacherApi.getTeacherInfo(id)
        .then(response => {
          this.teacher = response.data.teacher
        })
    },
    saveOrUpdate() {
      // 判断是修改还是添加操作
      if (this.teacher.id) {
        this.updateTeacher()
      } else {
        this.saveTeacher()
      }
    },
    // 添加讲师的方法
    saveTeacher() {
      teacherApi.addTeacher(this.teacher)
        .then(response => {
          // 提示成功
          this.$message({
            type: 'success',
            message: '添加成功!'
          });

          // 回到列表页面
          // 从一个地方到达另外一个地方
          this.$router.push({path: '/edu/table'})
        })
    },
    // 修改讲师的方法
    updateTeacher() {
      teacherApi.updateTeacherInfo(this.teacher)
        .then(response => {
          // 提示成功
          this.$message({
            type: 'success',
            message: '修改成功!'
          });

          // 回到列表页面
          // 从一个地方到达另外一个地方
          this.$router.push({path: '/edu/table'})
        })
    }
  }
}
</script>
