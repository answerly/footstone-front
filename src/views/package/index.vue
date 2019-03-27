<template>
  <div class="app-container">

    <div class="filter-container" style="margin-bottom:20px">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新建</el-button>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" title="应用发包">
      <el-form ref="dataForm" :rules="rules" :model="addition" label-position="left" label-width="50px" style="width: 600px;" inline="true">
        <el-form-item label="应用" prop="appName">
          <el-select v-model="addition.appName" class="filter-item" placeholder="Please select" @change="handleAppChange" >
            <el-option v-for="item in appList" :key="item.appName" :label="item.appName" :value="item.appName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="迭代" prop="iterationId">
          <el-select v-model="addition.iterationId" class="filter-item" placeholder="Please select" @change="handleIterationChange">
            <el-option v-for="item in iterationList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-table
        :data="moduleList"
        border
        fit
        highlight-current-row>
        <el-table-column label="localtion" width="339">
          <template slot-scope="scope">
            {{ scope.row.groupId }}:{{ scope.row.artifactId }}
          </template>
        </el-table-column>
        <el-table-column label="version" width="140">
          <template slot-scope="scope">
            {{ scope.row.version }}
          </template>
        </el-table-column>
        <el-table-column label="packaging" width="120">
          <template slot-scope="scope">
            {{ scope.row.packaging }}
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">发布</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { appList } from '@/api/app'
import { iterationList } from '@/api/iteration'
import { moduleList, moduleDeploy } from '@/api/deploy'

export default {
  data() {
    return {
      addition: {
        appName: '',
        iterationId: ''
      },
      appList: [],
      iterationList: [],
      moduleList: [],
      rules: {
        appName: [{ required: true, message: '请输入应用', trigger: 'change' }],
        iterationId: [{ required: true, message: '请选择迭代', trigger: 'change' }]
      },
      dialogFormVisible: false
    }
  },
  created() {
    appList().then(response => {
      this.appList = response.data
    })
  },
  methods: {
    handleCreate() {
      this.addition = {}
      this.iterationList = []
      this.moduleList = []
      this.dialogFormVisible = true
    },
    handleAppChange() {
      var params = {
        appName: this.addition.appName
      }
      this.addition = {
        appName: this.addition.appName,
        iterationId: ''
      }
      iterationList(params).then(response => {
        this.iterationList = response.data
      })
    },
    handleIterationChange() {
      var params = {
        iterationId: this.addition.iterationId
      }
      moduleList(params).then(response => {
        this.moduleList = response.data
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          var data = {
            id: this.addition.iterationId
          }
          moduleDeploy(data).then(response => {
            this.$message({
              type: 'success',
              message: '构建成功'
            })
            this.dialogFormVisible = false
          })
        }
      })
    }
  }
}
</script>
