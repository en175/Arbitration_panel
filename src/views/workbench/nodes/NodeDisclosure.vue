<template>
  <div class="node-content">
    <div class="node-card glass-card">
      <div class="card-header-wrapper">
        <div class="card-header">
          <span class="title">边裁披露与接受</span>
          <el-tag type="success" effect="dark" size="large" round>已完成</el-tag>
        </div>
        <div class="header-divider"></div>
      </div>

      <div class="arbitrator-cards">
        <el-row :gutter="32">
          <el-col :span="12" v-for="(arb, index) in arbitrators" :key="arb.name">
            <div class="arb-card" :class="{ 'applicant-side': index === 0, 'respondent-side': index === 1 }">
              <div class="arb-header">
                <div class="avatar-wrapper">
                  <el-avatar :size="64" icon="UserFilled" class="custom-avatar" />
                </div>
                <div class="arb-info">
                  <div class="name">{{ arb.name }}</div>
                  <div class="role-badge">{{ arb.role }}</div>
                </div>
                <div class="status-badge">
                  <el-icon><CircleCheckFilled /></el-icon>
                  <span>已接受</span>
                </div>
              </div>
              
              <div class="card-divider"></div>
              
              <div class="disclosure-section">
                <div class="section-title">
                  <el-icon><InfoFilled /></el-icon>
                  <span>披露声明</span>
                </div>
                <div class="disclosure-box">
                  <p class="disclosure-text">{{ arb.disclosure }}</p>
                </div>
                
                <div class="file-action" @click="handlePreview(arb)">
                  <div class="file-icon">
                    <el-icon><Document /></el-icon>
                  </div>
                  <span class="file-name">{{ arb.file }}</span>
                  <el-button type="primary" size="small" plain class="preview-btn">点击预览</el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 文件预览弹窗 -->
    <el-dialog
      v-model="previewVisible"
      title="文件预览"
      width="800px"
      align-center
      class="preview-dialog"
    >
      <div class="preview-content">
        <div class="preview-placeholder">
          <el-icon :size="64" class="preview-icon"><Document /></el-icon>
          <h3>{{ currentFile.file }}</h3>
          <p>此处为文件预览区域 (PDF/Image)</p>
          <p class="mock-text">
            本人 {{ currentFile.name }}，作为本案仲裁员，现郑重声明：
            <br>
            1. 本人独立、公正地履行仲裁员职责。
            <br>
            2. 本人与本案当事人无任何利害关系。
            <br>
            {{ currentFile.disclosure }}
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { UserFilled, Document, CircleCheckFilled, InfoFilled } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'

defineProps(['nodeData'])

const previewVisible = ref(false)
const currentFile = ref({})

const arbitrators = reactive([
  { 
    name: '林志远', 
    role: '申请人选定', 
    disclosure: '本人确认与本案当事人无任何利害关系，亦无其他可能影响公正仲裁的情形。',
    file: '接受书与披露声明_林.pdf'
  },
  { 
    name: '梁伟诚', 
    role: '被申请人选定', 
    disclosure: '本人曾于3年前代理过申请人子公司的其他案件，现已结案，不影响本案公正性。',
    file: '接受书与披露声明_梁.pdf'
  }
])

const handlePreview = (arb) => {
  currentFile.value = arb
  previewVisible.value = true
}
</script>

<style scoped>
.node-content {
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
}
.node-card {
  padding: 40px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.5) 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}
.card-header-wrapper {
  margin-bottom: 40px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.header-divider {
  height: 2px;
  background: linear-gradient(90deg, var(--arb-primary) 0%, transparent 100%);
  opacity: 0.3;
}
.title {
  font-size: 26px;
  font-weight: 700;
  color: var(--arb-text-primary);
  font-family: var(--arb-font-serif);
}

.arb-card {
  border-radius: 16px;
  padding: 32px;
  background: #fff;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.applicant-side {
  background: linear-gradient(145deg, #fff9f9 0%, #fff 100%);
  border-top: 4px solid #f56c6c;
}

.respondent-side {
  background: linear-gradient(145deg, #f0f7ff 0%, #fff 100%);
  border-top: 4px solid #409eff;
}

.arb-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.arb-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
}

.custom-avatar {
  background: var(--arb-gradient-primary);
  font-size: 24px;
}

.arb-info .name {
  font-weight: 700;
  font-size: 22px;
  color: var(--arb-text-main);
  margin-bottom: 8px;
}

.role-badge {
  display: inline-block;
  font-size: 14px;
  color: var(--arb-text-secondary);
  background: rgba(0,0,0,0.04);
  padding: 4px 12px;
  border-radius: 20px;
}

.status-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #67c23a;
  font-weight: 600;
  font-size: 16px;
  background: #f0f9eb;
  padding: 8px 16px;
  border-radius: 20px;
}

.card-divider {
  height: 1px;
  background: rgba(0,0,0,0.06);
  margin: 0 -32px 24px -32px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--arb-text-main);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.disclosure-box {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.disclosure-text {
  font-size: 16px;
  color: var(--arb-text-secondary);
  line-height: 1.8;
  margin: 0;
}

.file-action {
  display: flex;
  align-items: center;
  gap: 16px;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--arb-border);
}

.file-action:hover {
  border-color: var(--arb-primary);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.file-icon {
  width: 40px;
  height: 40px;
  background: #ecf5ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--arb-primary);
}

.file-name {
  font-size: 16px;
  font-weight: 500;
  flex: 1;
}

.preview-btn {
  font-size: 15px;
}

/* 预览弹窗样式 */
.preview-content {
  background: #f5f7fa;
  padding: 40px;
  border-radius: 8px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  text-align: center;
  color: var(--arb-text-secondary);
}

.preview-icon {
  margin-bottom: 16px;
  color: var(--arb-text-tertiary);
}

.mock-text {
  margin-top: 32px;
  text-align: left;
  background: white;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  border-radius: 8px;
  font-family: var(--arb-font-serif);
  line-height: 2;
  width: 100%;
  max-width: 600px;
}
</style>