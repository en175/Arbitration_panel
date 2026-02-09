<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">当事人提交选定/提名</span>
          <el-tag type="success" effect="dark">已完成</el-tag>
        </div>
      </template>
      
      <div class="selection-grid">
        <!-- 申请人 -->
        <div class="party-box applicant">
          <div class="box-header">
            <h4>申请人选定</h4>
            <el-tag size="small">已提交</el-tag>
          </div>
          <el-form label-position="top">
            <el-form-item label="选定边裁">
              <el-input model-value="王仲裁员 (A003)" disabled>
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="提交时间">
              <span class="text-secondary">2024-02-03 09:15</span>
            </el-form-item>
          </el-form>
        </div>

        <!-- 被申请人 -->
        <div class="party-box respondent">
          <div class="box-header">
            <h4>被申请人选定</h4>
            <el-tag size="small">已提交</el-tag>
          </div>
          <el-form label-position="top">
            <el-form-item label="选定边裁">
              <el-input model-value="赵仲裁员 (A004)" disabled>
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item label="提交时间">
              <span class="text-secondary">2024-02-03 08:45</span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'
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
.selection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.party-box {
  background: var(--arb-surface-dim);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--arb-border);
}
.box-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
.text-secondary {
  color: #666;
  font-size: 13px;
}
</style>