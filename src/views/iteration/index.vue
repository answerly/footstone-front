<template>
  <div class="app-container">

    <div class="filter-container" style="margin-bottom:20px">
      <el-form ref="dataForm" :rules="rules" :model="listQuery" >
        <el-form-item label="应用" prop="appName">
          <el-select v-model="listQuery.appName" class="filter-item">
            <el-option v-for="item in appList" :key="item.appName" :label="item.showName" :value="item.appName"/>
          </el-select>
          <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button v-if="checkPermission(['datasource_add'])" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">新建</el-button>
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
      <el-table-column label="迭代名称" width="160">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="应用名称" width="240" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.appShowName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分支名称" width="240" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.branchName }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="迭代阶段" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="操作" width="108" align="center">
        <template>
          <el-button size="mini" type="success">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogFormVisible" title="新建迭代">
      <el-form ref="addDataForm" :rules="addRules" :model="addition" label-position="left" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="应用名称" prop="appName">
          <el-select v-model="addition.appName" class="filter-item" placeholder="请选择应用">
            <el-option v-for="item in appList" :key="item.appName" :label="item.showName" :value="item.appName"/>
          </el-select>
        </el-form-item>
        <el-form-item label="迭代名称" prop="name">
          <el-input v-model="addition.name"/>
        </el-form-item>
        <el-form-item label="分支名称" prop="branchName">
          <el-input v-model="addition.branchName"/>
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
import { formatDate } from '@/utils/date'
import { appList } from '@/api/app'
import { iterationList, iterationAdd } from '@/api/iteration'
import checkPermission from '@/utils/permission' // 权限判断函数

export default {
  data() {
    return {
      listLoading: false,
      list: null,
      listQuery: {
        appName: null
      },
      appList: [],
      rules: {
        appName: [{ required: true, message: '请选择应用', trigger: 'change' }]
      },
      dialogFormVisible: false,
      addition: {
        appName: null,
        name: null,
        branchName: null
      },
      addRules: {
        appName: [{ required: true, message: '请选择应用', trigger: 'change' }],
        name: [{ required: true, message: '请选择迭代名称', trigger: 'change' }],
        branchName: [{ required: true, message: '请输入分支名称', trigger: 'change' }]
      }
    }
  },
  created() {
    appList().then(response => {
      this.appList = response.data
    })
  },
  methods: {
    checkPermission,
    fetchData() {
      this.listLoading = true
      iterationList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleFilter() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.fetchData()
        }
      })
    },
    handleCreate() {
      this.dialogFormVisible = true
      this.addition = {
        appName: this.listQuery.appName,
        branchName: 'feature/' + formatDate(new Date(), 'yyyyMMdd') + '-'
      }
    },
    createData() {
      this.$refs['addDataForm'].validate((valid) => {
        if (valid) {
          iterationAdd(this.addition).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.dialogFormVisible = false
            this.fetchData()
          })
        }
      })
    }
  }
}
</script>
