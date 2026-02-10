<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2 class="gradient-text">组庭方式确认</h2>
    </div>

    <div class="workspace-content">
      <div class="form-card glass-card">
        <el-form :model="formData" label-position="top">
          <el-form-item>
            <template #label>
              <span class="arb-form-label">请选择组庭方式</span>
            </template>
            <div class="selection-cards">
              <div 
                class="option-card"
                :class="{ active: formData.mode === 'chief' }"
                @click="formData.mode = 'chief'"
              >
                <div class="icon-wrapper">
                  <el-icon :size="32" class="option-icon"><UserFilled /></el-icon>
                </div>
                <div class="card-title">共同选定首席</div>
                <div class="card-desc">双方共同选定一名首席仲裁员，与各自选定的边裁组成合议庭。</div>
                <div class="check-mark" v-if="formData.mode === 'chief'">
                  <el-icon><Select /></el-icon>
                </div>
                <div class="active-glow" v-if="formData.mode === 'chief'"></div>
              </div>

              <div 
                class="option-card"
                :class="{ active: formData.mode === 'recommend' }"
                @click="formData.mode = 'recommend'"
              >
                <div class="icon-wrapper">
                  <el-icon :size="32" class="option-icon"><List /></el-icon>
                </div>
                <div class="card-title">推荐名单选定</div>
                <div class="card-desc">由仲裁委提供推荐名单，双方进行排序，根据排序结果确定首席。</div>
                <div class="check-mark" v-if="formData.mode === 'recommend'">
                  <el-icon><Select /></el-icon>
                </div>
                <div class="active-glow" v-if="formData.mode === 'recommend'"></div>
              </div>
            </div>
          </el-form-item>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <el-button type="primary" class="submit-btn" @click="handleSubmit">
              确认提交
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Select, UserFilled, List } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const formData = ref({
  mode: 'recommend',
  remark: ''
})

const handleSubmit = () => {
  ElMessage.success('组庭方式确认成功，进入下一步')
}
</script>

<style scoped>
.node-workspace {
  max-width: 900px;
  margin: 0 auto;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.workspace-header h2 {
  font-family: var(--arb-font-serif);
  margin: 0;
  font-size: 24px;
}

.gradient-text {
  background: var(--arb-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-card {
  padding: 40px;
}

.selection-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

.option-card {
  border: 1px solid var(--arb-border);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.option-card:hover {
  border-color: var(--arb-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  background: rgba(255, 255, 255, 0.7);
}

.option-card.active {
  border-color: transparent;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6));
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.active-glow {
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: var(--arb-gradient-primary);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.icon-wrapper {
  margin-bottom: 16px;
  color: var(--arb-text-secondary);
  transition: color 0.3s;
}

.option-card.active .icon-wrapper {
  color: var(--arb-primary);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--arb-text-main);
  margin-bottom: 8px;
}

.card-desc {
  font-size: 14px;
  color: var(--arb-text-secondary);
  line-height: 1.6;
}

.check-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: var(--arb-gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
}

.form-actions {
  margin-top: 40px;
  text-align: right;
}

:deep(.glass-input .el-textarea__inner) {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border-color: var(--arb-border);
}

:deep(.glass-input .el-textarea__inner:focus) {
  background: rgba(255, 255, 255, 0.8);
  border-color: var(--arb-primary);
}
</style>
