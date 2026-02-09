<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">主任生成并发送名单</span>
          <el-tag type="success" effect="dark">已完成</el-tag>
        </div>
      </template>

      <div class="list-section">
        <div class="section-header">
          <span class="sub-title">推荐名单（5人）</span>
          <span class="send-info">发送时间：2024-02-05 09:30</span>
        </div>
        
        <el-table :data="recommendList" stripe style="width: 100%">
          <el-table-column prop="id" label="编号" width="80" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="specialty" label="专业领域" />
          <el-table-column prop="source" label="来源" width="120">
            <template #default>
              <el-tag type="info" size="small">系统推荐</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="action-bar">
          <el-button type="primary" disabled plain>已发送至当事人</el-button>
          <el-button link>查看发送回执</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
defineProps(['nodeData'])

const recommendList = reactive([
  { id: 'A001', name: '张三', specialty: '金融、股权转让' },
  { id: 'A002', name: '李四', specialty: '公司法、合同法' },
  { id: 'A003', name: '王五', specialty: '民商事争议解决' },
  { id: 'A004', name: '赵六', specialty: '国际贸易、投资' },
  { id: 'A005', name: '孙七', specialty: '知识产权、技术合同' }
])
</script>

<style scoped>
.node-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--arb-text-primary);
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.sub-title {
  font-weight: 600;
}
.send-info {
  color: #999;
  font-size: 12px;
}
.action-bar {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>