<template>
  <div class="app-container">

    <div class="filter-container" style="margin-bottom:5px">
      <el-form v-model="listQuery" :inline="true">
        <el-form-item label="申请状态">
          <el-select v-model="listQuery.audit" :default-first-option="true">
            <el-option :value="1" label="我提交的"/>
            <el-option :value="0" label="待我审核"/>
          </el-select>
        </el-form-item>
        <el-form-item label="申请状态">
          <el-select v-model="listQuery.execState" :clearable="true">
            <el-option v-for="item in dataExecStateList" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="success" icon="el-icon-search" @click="fetchData">搜索</el-button>
          <el-button class="filter-item" type="primary" icon="el-icon-plus">
            <router-link :to="{ path: '/system/dataExec/add' }">新建</router-link>
          </el-button>
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
      <el-table-column label="应用名称" width="200">
        <template slot-scope="scope">
          {{ scope.row.appShowName }}
        </template>
      </el-table-column>
      <el-table-column label="执行环境" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.profile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据源" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.datasourceId }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="申请类型" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ dataExecTypeName(scope.row.execType) }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="申请状态" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ dataExecStateName(scope.row.execState) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请原因" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.execDesc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="160" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.gmtCreate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <router-link :to="{ path: '/system/dataExec/detail', query: {id: scope.row.id} }">详情</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { profileList, dataExecStateList, dataExecTypeList } from '@/api/system'
import { dataExecList } from '@/api/datasource'

export default {
  data() {
    return {
      listLoading: false,
      list: null,
      listQuery: {
        audit: 1
      },
      profileList: [],
      dataExecStateList: [],
      dataExecTypeList: []
    }
  },
  created() {
    profileList().then(response => {
      this.profileList = response.data
    })
    dataExecStateList().then(response => {
      this.dataExecStateList = response.data
    })
    dataExecTypeList().then(response => {
      this.dataExecTypeList = response.data
    })
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      dataExecList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    profileName(profile) {
      const profileKeyValue = this.profileList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return profileKeyValue[profile]
    },
    dataExecStateName(dataExecState) {
      const dataExecStateKeyValue = this.dataExecStateList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return dataExecStateKeyValue[dataExecState]
    },
    dataExecTypeName(dataExecType) {
      const dataExecTypeKeyValue = this.dataExecTypeList.reduce((acc, cur) => {
        acc[cur.key] = cur.value
        return acc
      }, {})
      return dataExecTypeKeyValue[dataExecType]
    }
  }
}
</script>
