<template>
  <div class="app-container">

    <div class="filter-container" style="margin-bottom:20px">
      <el-form ref="dataForm" :rules="rules" :model="listQuery" inline="true">
        <el-form-item label="应用" prop="appName">
          <el-select v-model="listQuery.appName" class="filter-item">
            <el-option v-for="item in appList" :key="item.appName" :label="item.showName" :value="item.appName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="profile">
          <el-select v-model="listQuery.profile" lass="filter-item">
            <el-option v-for="item in profileList" :key="item.key" :label="item.value" :value="item.key" placeholder="环境变量"/>
          </el-select>
        </el-form-item>
        <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
        <el-button v-if="checkPermission(['props_add'])" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新建</el-button>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="名称" width="255">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column label="已发布" width="232" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编辑中" width="232" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit">
            <el-input v-model="scope.row.editValue" class="edit-input" size="small"/>
          </template>
          <span v-if="!scope.row.edit">{{ scope.row.editValue }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="80" align="center">
        <template slot-scope="scope">
          <span>{{ stateName(scope.row.state) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.edit && scope.row.state != 2">
            <el-button class="cancel-btn" size="small" icon="el-icon-circle-check-outline" type="warning" @click="confirmEdit(scope.row)">提交</el-button>
            <el-button class="cancel-btn" size="small" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">取消</el-button>
          </template>
          <template v-if="!scope.row.edit && scope.row.state != 2">
            <el-button v-if="checkPermission(['props_publish'])" type="success" size="mini" @click="publish(scope.row)">发布</el-button>
            <el-button v-if="checkPermission(['props_edit'])" type="primary" size="mini" @click="scope.row.edit = true">编辑</el-button>
            <el-button v-if="checkPermission(['props_offline'])" type="danger" size="mini" @click="offline(scope.row)">下线</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="新建属性">
      <el-form ref="addDataForm" :rules="addRules" :model="addition" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
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
        <el-form-item label="属性名称" prop="key">
          <el-input v-model="addition.key"/>
        </el-form-item>
        <el-form-item label="属性值" prop="editValue">
          <el-input v-model="addition.editValue"/>
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
import checkPermission from '@/utils/permission' // 权限判断函数
import { appList } from '@/api/app'
import { profileList } from '@/api/system'
import { propertiesList, propertiesAdd, propertiesEdit, propertiesPublish, propertiesOffline } from '@/api/properties'

const stateMap = [
  { key: 0, value: '未发布' },
  { key: 1, value: '已发布' },
  { key: 2, value: '已下线' }
]

const stateKeyValue = stateMap.reduce((acc, cur) => {
  acc[cur.key] = cur.value
  return acc
}, {})

export default {
  data() {
    return {
      listLoading: false,
      list: null,
      listQuery: {
        appName: null,
        profile: null
      },
      stateMap,
      stateKeyValue,
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
        key: null,
        editValue: null
      },
      addRules: {
        appName: [{ required: true, message: '请选择应用', trigger: 'change' }],
        profile: [{ required: true, message: '请选择环境', trigger: 'change' }],
        key: [{ required: true, message: '请输入属性名称', trigger: 'change' }],
        editValue: [{ required: true, message: '请输入属性值', trigger: 'change' }]
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
  },
  methods: {
    checkPermission,
    fetchData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          propertiesList(this.listQuery).then(response => {
            this.list = response.data
            this.listLoading = false
          })
        }
      })
    },
    handleFilter() {
      this.fetchData()
    },
    stateName(state) {
      return stateKeyValue[state]
    },
    handleCreate() {
      this.addition = {
        appName: this.listQuery.appName,
        profile: this.listQuery.profile
      }
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          propertiesAdd(this.addition).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.fetchData()
            this.dialogFormVisible = false
          })
        }
      })
    },
    publish(row) {
      propertiesPublish(row).then(response => {
        this.$message({
          type: 'success',
          message: '发布成功'
        })
        this.fetchData()
      })
    },
    offline(row) {
      propertiesOffline(row).then(response => {
        this.$message({
          type: 'success',
          message: '下线成功'
        })
        this.fetchData()
      })
    },
    cancelEdit(row) {
      this.fetchData()
    },
    confirmEdit(row) {
      if (row.editValue) {
        propertiesEdit(row).then(response => {
          this.$message({
            type: 'success',
            message: '更新成功'
          })
          this.fetchData()
        })
      }
    }
  }
}
</script>
