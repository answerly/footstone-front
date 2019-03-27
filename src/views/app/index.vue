<template>
  <div class="app-container">

    <div class="filter-container" style="margin-bottom:20px">
      <el-input v-model="listQuery.appName" style="width: 300px;" class="filter-item" />
      <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="checkPermission(['app_add'])" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新建</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="应用名称" width="180">
        <template slot-scope="scope">
          {{ scope.row.showName }}
        </template>
      </el-table-column>
      <el-table-column label="应用编码" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OWNER" width="120" align="center">
        <template slot-scope="scope">
          {{ scope.row.displayName }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="应用类型" width="108" align="center">
        <template slot-scope="scope">
          <span>{{ appTypeName(scope.row.appType) }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="仓库名称" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.repName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button type="text">
            <router-link :to="{ path: '/app/detail', query: { appName: scope.row.appName } }" >详情</router-link>
          </el-button>
          <el-button type="text" @click="showInstances(scope.row)">实例</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="新建应用">
      <el-form ref="dataForm" :rules="rules" :model="addition" label-position="left" label-width="85px" style="width: 400px; margin-left:50px;">
        <el-form-item label="应用名称" prop="showName">
          <el-input v-model="addition.showName"/>
        </el-form-item>
        <el-form-item label="应用编码" prop="appName">
          <el-input v-model="addition.appName"/>
        </el-form-item>
        <el-form-item label="OWNER" prop="username">
          <el-select v-model="addition.username" class="filter-item" placeholder="请选择" style="width:315px">
            <el-option v-for="item in userList" :key="item.username" :label="item.displayName" :value="item.username"/>
          </el-select>
        </el-form-item>
        <el-form-item label="应用类型" prop="appType">
          <el-select v-model="addition.appType" class="filter-item" placeholder="请选择" style="width:315px">
            <el-option v-for="item in appTypeMap" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="repGroup">
          <el-input :value="gitlabUrl" disabled="true"/>
          <el-select v-model="addition.repGroup" class="filter-item" placeholder="请选择" style="width:315px">
            <el-option v-for="item in groupList" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="repName">
          <el-input v-model="addition.repName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">提交</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="instanceDialogFormVisible" title="实例应用">
      <el-table
        :data="instanceList"
        border
        fit
        highlight-current-row>
        <el-table-column label="地址" width="200">
          <template slot-scope="scope">
            {{ scope.row.host }}
          </template>
        </el-table-column>
        <el-table-column label="端口" width="200">
          <template slot-scope="scope">
            {{ scope.row.port }}
          </template>
        </el-table-column>
        <el-table-column label="环境" width="198">
          <template slot-scope="scope">
            {{ profileName(scope.row.profile) }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import { userList } from '@/api/user'
import { profileList, groupList, gitlabUrl } from '@/api/system'
import { appList, appAdd, instanceList } from '@/api/app'
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
      list: null,
      listQuery: {
        appName: null
      },
      listLoading: true,
      addition: {
        appName: '',
        showName: '',
        appType: '',
        username: '',
        namespace: '',
        projectName: ''
      },
      appTypeMap,
      appTypeKeyValue,
      rules: {
        appName: [{ required: true, message: '请输入应用编码', trigger: 'change' }],
        showName: [{ required: true, message: '请输入应用名称', trigger: 'change' }],
        appType: [{ required: true, message: '请选择应用类型', trigger: 'change' }],
        username: [{ required: true, message: '请选择OWNER', trigger: 'change' }],
        repGroup: [{ required: true, message: '请选择仓库组', trigger: 'change' }],
        repName: [{ required: true, message: '请输入仓库名称', trigger: 'change' }]
      },
      gitlabUrl: '',
      userList: [],
      profileList: [],
      groupList: [],
      dialogFormVisible: false,
      instanceDialogFormVisible: false,
      instanceList: []
    }
  },
  created() {
    this.fetchData()
    profileList().then(response => {
      this.profileList = response.data
    })
    gitlabUrl().then(response => {
      this.gitlabUrl = response.data
    })
    groupList().then(response => {
      this.groupList = response.data
    })
  },
  methods: {
    checkPermission,
    fetchData() {
      this.listLoading = true
      appList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.fetchData()
    },
    appTypeName(appType) {
      return appTypeKeyValue[appType]
    },
    profileName(profile) {
      const profileKeyValue = this.profileList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return profileKeyValue[profile]
    },
    handleCreate() {
      this.resetAddition()
      userList().then(response => {
        this.userList = response.data
      })
      this.dialogFormVisible = true
    },
    resetAddition() {
      this.addition = {}
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          appAdd(this.addition).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.dialogFormVisible = false
            this.fetchData()
          })
        }
      })
    },
    showInstances(row) {
      instanceList({ appName: row.appName }).then(response => {
        this.instanceList = response.data
        this.instanceDialogFormVisible = true
      })
    }
  }
}
</script>
