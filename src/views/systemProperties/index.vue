<template>
  <div class="app-container">

    <div class="filter-container" style="margin-bottom:20px">
      <el-form ref="dataForm" :rules="rules" :model="listQuery">
        <el-form-item label="环境变量" prop="profile">
          <el-select v-model="listQuery.profile" lass="filter-item" >
            <el-option v-for="item in profileList" :key="item.key" :label="item.value" :value="item.key" placeholder="环境变量"/>
          </el-select>
          <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button v-if="checkPermission(['sys_props_add'])" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新建</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="名称" width="400">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column label="已发布" width="628" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="新建属性">
      <el-form ref="addDataForm" :rules="addRules" :model="addition" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="应用环境" prop="profile">
          <el-select v-model="addition.profile" class="filter-item" placeholder="Please select">
            <el-option v-for="item in profileList" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="属性名称" prop="key">
          <el-input v-model="addition.key"/>
        </el-form-item>
        <el-form-item label="属性值" prop="value">
          <el-input v-model="addition.value"/>
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
import { profileList } from '@/api/system'
import { systemPropertiesList, systemPropertiesAdd } from '@/api/properties'
import checkPermission from '@/utils/permission' // 权限判断函数

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
        profile: null
      },
      stateMap,
      stateKeyValue,
      profileList: [],
      rules: {
        profile: [{ required: true, message: '请选择环境', trigger: 'change' }]
      },
      dialogFormVisible: false,
      addition: {
        profile: null,
        key: null,
        value: null
      },
      addRules: {
        profile: [{ required: true, message: '请选择环境', trigger: 'change' }],
        key: [{ required: true, message: '请输入属性名称', trigger: 'change' }],
        value: [{ required: true, message: '请输入属性值', trigger: 'change' }]
      }
    }
  },
  created() {
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
          systemPropertiesList(this.listQuery).then(response => {
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
        profile: this.listQuery.profile
      }
      this.dialogFormVisible = true
    },
    createData() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          systemPropertiesAdd(this.addition).then(response => {
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
