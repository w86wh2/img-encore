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
              >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="block" v-for="(ite, key) in item.imgItem" :key="key">
              <el-image :src="`http://img.encore.work/${item.name}/${ite.url}`" @click="copy(`http://img.encore.work/${item.name}/${ite.url}`)" style="width: 100px; height: 100px" fit="cover">
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
        ruleForm: {
          name: '',
          module: ''
        },
        rules: {
          name: [  { required: true, message: '请输入模块名称', trigger: 'blur' }],
          module: [ { required: true, message: '请输入文件夹名称', trigger: 'blur' }]
        }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
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
