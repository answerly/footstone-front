<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="dataExec" label-position="left" label-width="85px" style="width: 700px; margin-left:30px; margin-top:10px;">
      <el-form-item label="应用名称">
        <template slot="">{{ dataExec.appShowName }}</template>
      </el-form-item>
      <el-form-item label="执行环境">
        <template>{{ profileName(dataExec.profile) }}</template>
      </el-form-item>
      <el-form-item label="数据源ID">
        <template>{{ dataExec.datasourceId }}</template>
      </el-form-item>
      <el-form-item label="申请类型">
        <template>{{ dataExecTypeName(dataExec.execType) }}</template>
      </el-form-item>
      <el-form-item label="影响行数">
        <template>{{ dataExec.execNum }}</template>
      </el-form-item>
      <el-form-item label="申请人">
        <template>{{ dataExec.createDisplayName }}</template>
      </el-form-item>
      <el-form-item label="审批人">
        <template>{{ dataExec.execDisplayName }}</template>
      </el-form-item>
      <el-form-item label="申请原因">
        <template>{{ dataExec.execDesc }}</template>
      </el-form-item>
      <el-form-item label="申请状态">
        <template>{{ dataExecStateName(dataExec.execState) }}</template>
      </el-form-item>
      <el-form-item label="执行脚本">
        <el-input v-model="dataExec.execScript" :disabled="true" type="textarea"/>
      </el-form-item>
      <el-form-item label="执行结果">
        <el-input v-model="execResultData.message" :disabled="true" type="textarea"/>
      </el-form-item>
    </el-form>
    <div slot="footer" style="margin-left:30px; margin-top:20px;">
      <el-button type="primary">
        <router-link :to="{ path: '/system/dataExec' }">返回</router-link>
      </el-button>
      <el-button v-if="execResultData.code === 1" type="primary" @click="dialogFormVisible = true">结果</el-button>
      <el-button v-if="dataExec.execState === 0" type="success" @click="passAudit">通过</el-button>
      <el-button v-if="dataExec.execState === 0" type="warning" @click="rejectAudit">驳回</el-button>
      <el-button v-if="dataExec.execState === 1" type="primary" @click="executeData">执行</el-button>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" title="查询结果" width="80%">
      <el-table v-if="execResultData.code === 1" :data="execResultData.queryDataList" height="400px" border fit highlight-current-row>
        <el-table-column v-for="item in execResultData.queryHeaders" :key="item" :label="item" width="120px">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row[item]" effect="light">
              <el-button type="text">{{ scope.row[item] }}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { dataExecGet, dataExecPass, dataExecReject, dataExecExecute } from '@/api/datasource'
import { profileList, dataExecTypeList, dataExecStateList } from '@/api/system'
import JsonEditor from '@/components/JsonEditor'

export default {
  components: { JsonEditor },
  data() {
    return {
      id: null,
      dataExec: {},
      execResultData: {},
      appList: [],
      profileList: [],
      dataExecTypeList: [],
      dataExecStateList: [],
      dialogFormVisible: false
    }
  },
  created() {
    this.id = this.$route.query.id
    profileList().then(response => {
      this.profileList = response.data
    })
    dataExecTypeList().then(response => {
      this.dataExecTypeList = response.data
    })
    dataExecStateList().then(response => {
      this.dataExecStateList = response.data
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      var params = {
        id: this.id
      }
      dataExecGet(params).then(response => {
        this.dataExec = response.data
        this.execResultData = response.data.execResultData
      })
    },
    profileName(profile) {
      const profileKeyValue = this.profileList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return profileKeyValue[profile]
    },
    dataExecTypeName(dataExecType) {
      const dataExecTypeKeyValue = this.dataExecTypeList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return dataExecTypeKeyValue[dataExecType]
    },
    dataExecStateName(dataExecState) {
      const dataExecStateKeyValue = this.dataExecStateList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return dataExecStateKeyValue[dataExecState]
    },
    passAudit() {
      var data = {
        id: this.id
      }
      dataExecPass(data).then(response => {
        this.$message({
          type: 'success',
          message: '审核通过'
        })
        this.fetchData()
      })
    },
    rejectAudit() {
      var data = {
        id: this.id
      }
      dataExecReject(data).then(response => {
        this.$message({
          type: 'success',
          message: '审核拒绝'
        })
        this.fetchData()
      })
    },
    executeData() {
      var data = {
        id: this.id
      }
      dataExecExecute(data).then(response => {
        this.$message({
          type: 'success',
          message: '执行成功'
        })
        this.fetchData()
      })
    }
  }
}
</script>
