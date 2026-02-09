<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">组庭完成通知</span>
          <el-tag type="info">待处理</el-tag>
        </div>
      </template>

      <div class="finish-state">
        <el-result
          icon="success"
          title="组庭已完成"
          sub-title="所有流程已审批通过，组庭通知书已生成。"
        >
          <template #extra>
            <div class="final-tribunal-card">
              <div class="card-title">仲裁庭组成人员</div>
              <div class="members-grid">
                <div class="member-item">
                  <el-avatar class="mb-2" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                  <span class="role">边裁(申)</span>
                  <span class="name">王五</span>
                </div>
                <div class="member-item chief">
                  <div class="crown-icon">👑</div>
                  <el-avatar :size="64" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                  <span class="role">首席仲裁员</span>
                  <span class="name">李四</span>
                </div>
                <div class="member-item">
                  <el-avatar class="mb-2" src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
                  <span class="role">边裁(被)</span>
                  <span class="name">赵六</span>
                </div>
              </div>
            </div>

            <div class="doc-list">
              <div class="doc-item">
                <el-icon><Document /></el-icon>
                <span>组庭通知书.pdf</span>
                <el-button link type="primary">预览</el-button>
              </div>
              <div class="doc-item">
                <el-icon><Document /></el-icon>
                <span>仲裁庭组成人员名单.pdf</span>
                <el-button link type="primary">预览</el-button>
              </div>
            </div>
            <div class="actions">
              <el-button type="primary" size="large" class="send-btn">
                <el-icon class="mr-2"><Promotion /></el-icon> 一键发送通知
              </el-button>
              <el-button size="large">打印归档</el-button>
            </div>
          </template>
        </el-result>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { Document, Promotion } from '@element-plus/icons-vue'
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
.finish-state {
  padding: 0 40px 40px;
}
.final-tribunal-card {
  background: white;
  border: 1px solid var(--arb-border-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: var(--arb-shadow-sm);
}
.card-title {
  text-align: center;
  font-weight: 600;
  color: var(--arb-text-secondary);
  margin-bottom: 20px;
  font-size: 14px;
}
.members-grid {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 24px;
}
.member-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.member-item.chief {
  transform: translateY(-10px);
}
.role {
  font-size: 12px;
  color: var(--arb-text-secondary);
  margin-top: 8px;
  margin-bottom: 4px;
}
.name {
  font-weight: 600;
  color: var(--arb-text-primary);
}
.crown-icon {
  position: absolute;
  top: -24px;
  font-size: 20px;
}
.doc-list {
  background: var(--arb-surface-dim);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 32px;
  text-align: left;
  width: 400px;
  margin-left: auto;
  margin-right: auto;
  border: 1px dashed var(--arb-border-color);
}
.doc-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.doc-item:last-child {
  margin-bottom: 0;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
.send-btn {
  padding-left: 32px;
  padding-right: 32px;
}
.mr-2 {
  margin-right: 8px;
}
.mb-2 {
  margin-bottom: 8px;
}
</style>
