<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">组庭启动</span>
          <el-tag type="success" effect="dark">已完成</el-tag>
        </div>
      </template>
      
      <div class="info-section">
        <el-descriptions title="案件基本信息" :column="2" border>
          <el-descriptions-item label="案号">穗仲案字[2024]第12345号</el-descriptions-item>
          <el-descriptions-item label="案由">股权转让纠纷</el-descriptions-item>
          <el-descriptions-item label="标的额">¥ 5,000,000.00</el-descriptions-item>
          <el-descriptions-item label="适用程序">普通程序</el-descriptions-item>
          <el-descriptions-item label="拟定庭型">三人合议庭</el-descriptions-item>
          <el-descriptions-item label="经办秘书">张秘书</el-descriptions-item>
        </el-descriptions>

        <div class="action-log">
          <h4>处理记录</h4>
          <el-timeline>
            <el-timeline-item timestamp="2024-02-01 10:00" type="primary">
              秘书确认案件要素无误，发起组庭流程
            </el-timeline-item>
            <el-timeline-item timestamp="2024-02-01 09:30">
              系统自动立案
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
defineProps(['nodeData'])
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
.info-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.action-log {
  margin-top: 12px;
}
</style>