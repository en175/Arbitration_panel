<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">边裁披露与接受</span>
          <el-tag type="success" effect="dark">已完成</el-tag>
        </div>
      </template>

      <div class="arbitrator-cards">
        <el-row :gutter="24">
          <el-col :span="12" v-for="arb in arbitrators" :key="arb.name">
            <div class="arb-card">
              <div class="arb-header">
                <el-avatar :size="48" icon="UserFilled" />
                <div class="arb-info">
                  <div class="name">{{ arb.name }}</div>
                  <div class="role">{{ arb.role }}</div>
                </div>
                <el-tag type="success" class="status-tag">已接受</el-tag>
              </div>
              <el-divider />
              <div class="disclosure-section">
                <div class="section-title">披露声明</div>
                <p class="disclosure-text">{{ arb.disclosure }}</p>
                <div class="file-link">
                  <el-icon><Document /></el-icon> 
                  <span>{{ arb.file }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { UserFilled, Document } from '@element-plus/icons-vue'
import { reactive } from 'vue'

defineProps(['nodeData'])

const arbitrators = reactive([
  { 
    name: '王仲裁员', 
    role: '申请人选定', 
    disclosure: '本人确认与本案当事人无任何利害关系，亦无其他可能影响公正仲裁的情形。',
    file: '接受书与披露声明_王.pdf'
  },
  { 
    name: '赵仲裁员', 
    role: '被申请人选定', 
    disclosure: '本人曾于3年前代理过申请人子公司的其他案件，现已结案，不影响本案公正性。',
    file: '接受书与披露声明_赵.pdf'
  }
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
.arb-card {
  border: 1px solid var(--arb-border);
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}
.arb-header {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}
.status-tag {
  position: absolute;
  right: 0;
  top: 0;
}
.arb-info .name {
  font-weight: 600;
  font-size: 16px;
}
.arb-info .role {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}
.disclosure-section {
  margin-top: 16px;
}
.section-title {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
.disclosure-text {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  background: var(--arb-surface-dim);
  padding: 12px;
  border-radius: 4px;
}
.file-link {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  color: var(--arb-primary);
  font-size: 13px;
  cursor: pointer;
}
</style>