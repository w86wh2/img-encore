<template>
  <div id="app">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>图片管理</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="createModule">新增模块</el-button>
      </div>
      <el-tabs tab-position="left">
        <el-tab-pane :label="item.text" v-for="(item,key) in fileList" :key="key">
          <div class="img_container">
            <el-upload
              class="avatar-uploader"
              name="file"
              action="/api/upload"
              :data="{path: item.name}"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-change="onChange.bind(this, item.name)"
              :auto-upload="false"
              >
              <i class="el-icon-plus avatar-uploader-icon"></i>

            </el-upload>
            <div class="block" v-for="(ite, key) in item.imgItem" :key="key">
              <el-image :src="ite.url" @click="copy(ite.url)" style="width: 100px; height: 100px" fit="cover">
              </el-image>
              <div class="demonstration">{{ite.size}}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      title="创建模块"
      :visible.sync="dialog"
      width="50%"
      >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="模块文件夹" prop="module">
          <el-input v-model="ruleForm.module"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="图片裁切"
      :visible.sync="dialog1"
      :append-to-body="true"
      width="750px"
    >
      <div class="vue-cropper_container">
        <div class="vue-cropper_item">
          <vueCropper
            ref="cropper"
            :img="cropImg"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :fixed-box="option.fixedBox"
            :center-box="true"
            :fixed="option.fixed"
            :fixed-number="option.fixedNumber"
            @realTime="realTime"
          />
        </div>
        <div class="vue-cropper_item item">
          <el-alert
            title="预览效果"
            type="success"
            :closable="false"
          />
          <div style="margin-top: 10px" v-html="preImg.html" />
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="upLoad">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import axios from 'axios'
export default {
  name: 'app',
  data() {
    return {
        fileList: [],
        dialog: false,
        dialog1: false,
        loading: false,
        cropImg: '',
        preImg: {},
        fileName: '',
        name: '',
        ruleForm: {
          name: '',
          module: ''
        },
        rules: {
          name: [  { required: true, message: '请输入模块名称', trigger: 'blur' }],
          module: [ { required: true, message: '请输入文件夹名称', trigger: 'blur' }]
        },
        option: {
        img: '', // 裁剪图片的地址  (默认：空)
        size: 1, // 裁剪生成图片的质量  (默认:1)
        full: true, // 是否输出原图比例的截图 选true生成的图片会非常大  (默认:false)
        outputType: 'png', // 裁剪生成图片的格式  (默认:jpg)
        canMove: true, // 上传图片是否可以移动  (默认:true)
        original: false, // 上传图片按照原始比例渲染  (默认:false)
        canMoveBox: true, // 截图框能否拖动  (默认:true)
        autoCrop: true, // 是否默认生成截图框  (默认:false)
        // autoCropWidth: 300, // 默认生成截图框宽度  (默认:80%)
        // autoCropHeight: 300, // 默认生成截图框高度  (默认:80%)
        fixedBox: false, // 固定截图框大小 不允许改变  (默认:false)
        fixed: false, // 是否开启截图框宽高固定比例  (默认:true)
        fixedNumber: [1, 1] // 截图框比例  (默认:[1:1])
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    realTime(data) {
      // eslint-disable-next-line no-return-assign
      this.preImg = data
    },
    onChange(name, file) {
      this.fileName = file.name
      this.name = name
      this.cropImg = URL.createObjectURL(file.raw)
      this.dialog1 = true
    },
    upLoad() {
      this.loading = true
      this.$refs.cropper.getCropBlob((data) => {
        // const img = window.URL.createObjectURL(data)
        const formData = new FormData()
        formData.append('file', data, this.fileName)
        formData.append('path', this.name)
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
        axios.post('/api/upload', formData, config).then(res => {
          this.getList()
          this.$message.success(res.data)
          this.loading = false
          this.dialog1 = false
        }).catch(err => {
          // eslint-disable-next-line no-console
          console.log(err)
          this.loading1 = false
        })
      })
    },
    copyText(text, callback){ // text: 要复制的内容， callback: 回调
        var tag = document.createElement('input');
        tag.setAttribute('id', 'cp_hgz_input');
        tag.value = text;
        document.getElementsByTagName('body')[0].appendChild(tag);
        document.getElementById('cp_hgz_input').select();
        document.execCommand('copy');
        document.getElementById('cp_hgz_input').remove();
        if(callback) {callback(text)}
    },
    copy(text) {
      this.copyText(text, () => {
        this.$message.success('copy  成功')
      })
    },
    getList() {
      axios.get( '/api/fileList').then(res=> {
        // eslint-disable-next-line no-console
        console.log(res)
        this.fileList = res.data
      })
    },
    handleAvatarSuccess() {
      // eslint-disable-next-line no-console
      this.getList()
    },
    createModule() {
      this.resetForm()
      this.dialog = true
    },
    submitForm() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            axios.post( '/api/addModule', {...this.ruleForm}).then(res=> {
              // eslint-disable-next-line no-console
              if (res.data === '添加成功') {
                this.dialog = false
                this.$message.success(res.data)
                this.getList()
              } else {
                this.$message.error(res.data)
              }
              
            })
          } else {
            return false;
          }
        });
      },
      resetForm() {
        if (this.$refs.ruleForm)
        this.$refs.ruleForm.resetFields();
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.el-card__body {
    padding: 2px !important;
}
.vue-cropper_container {
  width: 610px;
  display: flex;
  height: 320px;
}
.vue-cropper_item {
  width: 300px !important;

}
.vue-cropper_item.item {
  padding: 10px;
}
.img_container {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
}
.img_container .block {
  margin: 10px;
}
.demonstration {
  font-size: 12px;
  text-align: center;
  color: #666
}
.avatar-uploader {
  width: 100px;
  height: 100px;
  margin: 10px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    line-height: 100px !important;
    text-align: center;
  }
</style>
