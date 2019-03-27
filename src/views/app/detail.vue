<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="detail" label-position="left" label-width="85px" style="width: 700px; margin-left:30px; margin-top:10px;">
      <el-form-item label="应用名称">
        <span>{{ detail.showName }}</span>
      </el-form-item>
      <el-form-item label="应用编码">
        <span>{{ detail.appName }}</span>
      </el-form-item>
      <el-form-item label="OWNER">
        <span>{{ detail.displayName }}</span>
      </el-form-item>
      <el-form-item label="应用类型">
        <span>{{ appTypeName(detail.appType) }}</span>
      </el-form-item>
      <el-form-item label="项目地址">
        <span>{{ gitlabUrl + '/' + detail.repGroup + '/' + detail.repName }}</span>
      </el-form-item>
      <el-form-item label="OPS人员">
        <el-tag v-for="item in detail.masterList" :key="item.username" style="width: 90px; margin-left:5px; text-align:center;" v-text="item.username"/>
        <el-button class="el-icon-plus" style="margin-left:5px;" @click="handleAddMaster"/>
      </el-form-item>
      <el-form-item label="研发人员">
        <el-tag v-for="item in detail.developerList" :key="item.username" style="width: 90px; margin-left:5px; text-align:center;" v-text="item.username"/>
        <el-button class="el-icon-plus" style="margin-left:5px;" @click="handleAddDeveloper"/>
      </el-form-item>
      <el-form-item label="测试人员">
        <el-tag v-for="item in detail.testerList" :key="item.username" style="width: 90px; margin-left:5px; text-align:center;" v-text="item.username"/>
        <el-button class="el-icon-plus" style="margin-left:5px;" @click="handleAddTester"/>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="memberDialogFormVisible" title="添加研发人员">
      <el-form :model="member">
        <el-form-item label="研发人员">
          <el-select v-model="member.username" class="filter-item">
            <el-option v-for="item in userList" :key="item.username" :label="item.displayName" :value="item.username"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-button @click="memberDialogFormVisible = false">取消</el-button>
      <el-button @click="addDeveloper">添加</el-button>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { gitlabUrl } from '@/api/system'
import { appGet, appMemberAdd } from '@/api/app'
import { userList } from '@/api/user'

const appTypeMap = [
  { key: 0, value: 'JAVA' },
  { key: 1, value: 'NODE' }
]

const appTypeKeyValue = appTypeMap.reduce((acc, cur) => {
  acc[cur.key] = cur.value
  return acc
}, {})

export default {
  data() {
    return {
      edit: false,
      appName: '',
      detail: {},
      appTypeMap,
      appTypeKeyValue,
      gitlabUrl: '',
      member: {
        username: ''
      },
      userList: [],
      memberDialogFormVisible: false
    }
  },
  created() {
    this.appName = this.$route.query.appName
    gitlabUrl().then(response => {
      this.gitlabUrl = response.data
    })
    this.fetchData()
  },
  methods: {
    checkPermission,
    appTypeName(appType) {
      return appTypeKeyValue[appType]
    },
    fetchData() {
      var params = {
        appName: this.appName
      }
      appGet(params).then(response => {
        this.detail = response.data
      })
    },
    handleAddMaster() {
      this.member = {
        appName: this.appName,
        memberTag: 'project_master'
      }
      userList().then(response => {
        this.userList = response.data
      })
      this.memberDialogFormVisible = true
    },
    handleAddDeveloper() {
      this.member = {
        appName: this.appName,
        memberTag: 'project_developer'
      }
      userList().then(response => {
        this.userList = response.data
      })
      this.memberDialogFormVisible = true
    },
    handleAddTester() {
      this.member = {
        appName: this.appName,
        memberTag: 'project_tester'
      }
      userList().then(response => {
        this.userList = response.data
      })
      this.memberDialogFormVisible = true
    },
    addDeveloper() {
      appMemberAdd(this.member).then(response => {
        this.memberDialogFormVisible = false
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.fetchData()
      })
    }
  }
}
</script>
