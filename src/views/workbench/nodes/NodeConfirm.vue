<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">主任确认最终人选</span>
          <el-tag type="info">待处理</el-tag>
        </div>
      </template>

      <div class="confirm-box">
        <!-- Candidate Profile Card -->
        <div class="candidate-card">
          <div class="card-left">
            <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </div>
          <div class="card-right">
            <div class="name-row">
              <span class="name">李四</span>
              <el-tag effect="dark" type="primary" size="small">拟定首席</el-tag>
            </div>
            <div class="tags-row">
              <el-tag size="small" effect="plain">双方首选</el-tag>
              <el-tag size="small" effect="plain" type="success">系统推荐</el-tag>
            </div>
            <div class="desc-row">
              法学教授，博士生导师。擅长公司法、合同纠纷、国际贸易仲裁。
            </div>
          </div>
        </div>

        <el-divider content-position="center">确认意见</el-divider>

        <div class="form-section">
          <el-form label-position="top">
            <el-form-item label="签署意见">
              <el-input 
                type="textarea" 
                rows="4" 
                placeholder="同意该仲裁员作为本案首席仲裁员。" 
                v-model="opinion"
              />
            </el-form-item>
            <el-form-item>
              <div class="action-buttons">
                <el-button type="primary" size="large" class="w-full">
                  <el-icon class="mr-2"><Check /></el-icon> 确认人选
                </el-button>
                <el-button size="large" class="w-full">
                  <el-icon class="mr-2"><RefreshLeft /></el-icon> 退回重选
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Check, RefreshLeft } from '@element-plus/icons-vue'
defineProps(['nodeData'])

const opinion = ref('同意该仲裁员作为本案首席仲裁员。')
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
.confirm-box {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 0;
}
.candidate-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: white;
  border: 1px solid var(--arb-border-color);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--arb-shadow);
  margin-bottom: 32px;
}
.card-left {
  flex-shrink: 0;
}
.card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.name {
  font-size: 24px;
  font-weight: 700;
  color: var(--arb-text-primary);
  font-family: var(--arb-font-serif);
}
.tags-row {
  display: flex;
  gap: 8px;
}
.desc-row {
  color: var(--arb-text-secondary);
  font-size: 14px;
  line-height: 1.5;
  margin-top: 4px;
}
.action-buttons {
  display: flex;
  gap: 16px;
  width: 100%;
}
.w-full {
  flex: 1;
}
.mr-2 {
  margin-right: 8px;
}
</style>