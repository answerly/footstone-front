<template>
  <div class="app-container">

    <div class="filter-container" style="margin-bottom:20px">
      <el-form ref="dataForm" :model="listQuery" inline="true">
        <el-form-item label="应用">
          <el-select v-model="listQuery.appName" class="filter-item">
            <el-option v-for="item in appList" :key="item.appName" :label="item.showName" :value="item.appName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="环境">
          <el-select v-model="listQuery.profile" lass="filter-item">
            <el-option v-for="item in profileList" :key="item.key" :label="item.value" :value="item.key" placeholder="环境变量"/>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-if="checkPermission(['datasource_add'])" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新建</el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="编码" width="150">
        <template slot-scope="scope">
          {{ scope.row.dataSourceId }}
        </template>
      </el-table-column>
      <el-table-column label="应用名称" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appShowName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名称" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="应用环境" width="90" align="center">
        <template slot-scope="scope">
          <span>{{ profileName(scope.row.profile) }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="驱动类型" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.driverClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="默认" width="60" align="center">
        <template slot-scope="scope">
          <span>{{ defaultFlagKeyValue[scope.row.defaultFlag] }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="更新时间" width="155" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtModified }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="103" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.url" placement="bottom">
            <el-button size="mini" type="success">查看连接</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="新建数据源">
      <el-form ref="addDataForm" :rules="addRules" :model="addition" label-position="left" label-width="100px" style="width: 400px; margin-left:50px">
        <el-form-item label="应用名称" prop="appName">
          <el-select v-model="addition.appName" class="filter-item" placeholder="Please select">
            <el-option v-for="item in appList" :key="item.appName" :label="item.showName" :value="item.appName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="应用环境" prop="profile">
          <el-select v-model="addition.profile" class="filter-item" placeholder="Please select">
            <el-option v-for="item in profileList" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="数据源驱动" prop="driverClassName">
          <el-select v-model="addition.driverClassName">
            <el-option key="com.mysql.jdbc.Driver" value="com.mysql.jdbc.Driver"/>
          </el-select>
        </el-form-item>
        <el-form-item label="是否默认" prop="defaultFlag">
          <el-select v-model="addition.defaultFlag">
            <el-option v-for="item in defaultFlag" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="数据源连接" prop="url">
          <el-input v-model="addition.url" placeholder="jdbc:mysql://${HOST}:${PORT}/${DB}"/>
        </el-form-item>
        <el-form-item label="数据源编码" prop="dataSourceId">
          <el-input v-model="addition.dataSourceId"/>
        </el-form-item>
        <el-form-item label="数据源用户" prop="username">
          <el-input v-model="addition.username"/>
        </el-form-item>
        <el-form-item label="数据源密码" prop="password">
          <el-input v-model="addition.password" type="password" show-password clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { appList } from '@/api/app'
import { profileList } from '@/api/system'
import { datasourceList, datasourceAdd } from '@/api/datasource'
import checkPermission from '@/utils/permission' // 权限判断函数

const defaultFlag = [
  { key: 0, value: '是' },
  { key: 1, value: '否' }
]

const defaultFlagKeyValue = defaultFlag.reduce((acc, cur) => {
  acc[cur.key] = cur.value
  return acc
}, {})

export default {
  data() {
    return {
      defaultFlag,
      defaultFlagKeyValue,
      listLoading: false,
      list: null,
      listQuery: {
        appName: null,
        profile: null
      },
      appList: [],
      profileList: [],
      rules: {
        appName: [{ required: true, message: '请选择应用', trigger: 'change' }],
        profile: [{ required: true, message: '请选择环境', trigger: 'change' }]
      },
      dialogFormVisible: false,
      addition: {
        appName: null,
        profile: null,
        url: null,
        dataSourceId: null,
        username: null,
        password: null,
        driverClassName: null,
        defaultFlag: null
      },
      addRules: {
        appName: [{ required: true, message: '请选择应用', trigger: 'change' }],
        profile: [{ required: true, message: '请选择环境', trigger: 'change' }],
        url: [{ required: true, message: '请输入数据源连接', trigger: 'change' }],
        dataSourceId: [{ required: true, message: '请输入数据源编码', trigger: 'change' }],
        username: [{ required: true, message: '请输入数据源用户', trigger: 'change' }],
        password: [{ required: true, message: '请输入数据源密码', trigger: 'change' }],
        driverClassName: [{ required: true, message: '请输入数据源驱动', trigger: 'change' }],
        defaultFlag: [{ required: true, message: '请选择是否默认', trigger: 'change' }]
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
    this.fetchData()
  },
  methods: {
    checkPermission,
    fetchData() {
      this.listLoading = true
      datasourceList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.fetchData()
    },
    profileName(profile) {
      const profileKeyValue = this.profileList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return profileKeyValue[profile]
    },
    handleCreate() {
      this.addition = {
        appName: this.listQuery.appName,
        profile: this.listQuery.profile,
        driverClassName: 'com.mysql.jdbc.Driver',
        defaultFlag: 1
      }
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          datasourceAdd(this.addition).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.fetchData()
            this.dialogFormVisible = false
          })
        }
      })
    }
  }
}
</script>
