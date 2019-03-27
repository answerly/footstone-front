<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="dataExec" label-position="left" label-width="85px" style="width: 700px; margin-left:30px; margin-top:10px;">
      <el-form-item label="应用名称" prop="appName">
        <el-select v-model="dataExec.appName" @change="fetchDataSource">
          <el-option v-for="item in appList" :key="item.appName" :label="item.showName" :value="item.appName"/>
        </el-select>
      </el-form-item>
      <el-form-item label="执行环境" prop="profile">
        <el-select v-model="dataExec.profile" @change="fetchDataSource">
          <el-option v-for="item in profileList" :key="item.key" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="数据源ID" prop="datasourceId">
        <el-select v-model="dataExec.datasourceId">
          <el-option v-for="item in datasourceList" :key="item.id" :label="item.dataSourceId" :value="item.dataSourceId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="申请类型" prop="execType">
        <el-select v-model="dataExec.execType">
          <el-option v-for="item in dataExecTypeList" :key="item.key" :label="item.value" :value="item.key"/>
        </el-select>
      </el-form-item>
      <el-form-item label="影响行数" prop="execNum">
        <el-input-number v-model="dataExec.execNum" />
      </el-form-item>
      <el-form-item label="申请原因" prop="execDesc">
        <el-input v-model="dataExec.execDesc" type="textarea"/>
      </el-form-item>
      <el-form-item label="执行脚本" prop="execScript">
        <el-input v-model="dataExec.execScript" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" style="margin-left:30px; margin-top:20px;">
      <el-button type="primary" @click="handleCreate">提交</el-button>
      <el-button>
        <router-link :to="{ path: '/system/dataExec' }">返回</router-link>
      </el-button>
    </div>
  </div>
</template>

<script>
import { appList } from '@/api/app'
import { datasourceList, dataExecCommit } from '@/api/datasource'
import { profileList, dataExecTypeList } from '@/api/system'

export default {
  data() {
    return {
      edit: true,
      dataExec: {},
      appList: [],
      profileList: [],
      datasourceList: [],
      dataExecTypeList: [],
      rules: {
        appName: [{ required: true, message: '请选择应用名称', trigger: 'change' }],
        profile: [{ required: true, message: '请选择执行环境', trigger: 'change' }],
        datasourceId: [{ required: true, message: '请选择数据源ID', trigger: 'change' }],
        execType: [{ required: true, message: '请选择申请类型', trigger: 'change' }],
        execNum: [{ required: true, message: '请输入影响行数', trigger: 'change' }],
        execDesc: [{ required: true, message: '请输入申请原因', trigger: 'change' }],
        execScript: [{ required: true, message: '请输入执行脚本', trigger: 'change' }]
      }
    }
  },
  created() {
    appList().then(response => {
      this.appList = response.data
    })
    profileList().then(response => {
      this.profileList = response.data
    })
    dataExecTypeList().then(response => {
      this.dataExecTypeList = response.data
    })
  },
  methods: {
    fetchDataSource() {
      if (this.dataExec.appName && this.dataExec.profile) {
        var params = {
          appName: this.dataExec.appName,
          profile: this.dataExec.profile
        }
        datasourceList(params).then(response => {
          this.datasourceList = response.data
        })
      } else {
        this.datasourceList = []
      }
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          dataExecCommit(this.dataExec).then(response => {
            this.$message({
              type: 'success',
              message: '申请成功'
            })
            this.$router.push({
              path: '/system/dataExec'
            })
          })
        }
      })
    }
  }
}
</script>
