<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2>组庭方式确认</h2>
      <div class="status-alert">
        <el-tag type="warning">待您处理</el-tag>
      </div>
    </div>

    <div class="workspace-content">
      <div class="form-card">
        <el-form :model="formData" label-position="top">
          <el-form-item label="请选择组庭方式">
            <div class="selection-cards">
              <div 
                class="option-card"
                :class="{ active: formData.mode === 'chief' }"
                @click="formData.mode = 'chief'"
              >
                <div class="icon">
                  <el-icon :size="32"><UserFilled /></el-icon>
                </div>
                <div class="card-title">共同选定首席</div>
                <div class="card-desc">双方共同选定一名首席仲裁员，与各自选定的边裁组成合议庭。</div>
                <div class="check-mark" v-if="formData.mode === 'chief'"><el-icon><Select /></el-icon></div>
              </div>

              <div 
                class="option-card"
                :class="{ active: formData.mode === 'recommend' }"
                @click="formData.mode = 'recommend'"
              >
                <div class="icon">
                  <el-icon :size="32"><List /></el-icon>
                </div>
                <div class="card-title">推荐名单选定</div>
                <div class="card-desc">由仲裁委提供推荐名单，双方进行排序，根据排序结果确定首席。</div>
                <div class="check-mark" v-if="formData.mode === 'recommend'"><el-icon><Select /></el-icon></div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="备注说明">
            <el-input v-model="formData.remark" type="textarea" rows="3" placeholder="如有特殊需求请在此说明" />
          </el-form-item>

          <div class="form-actions">
            <el-button type="primary" size="large" @click="submit">确认选择</el-button>
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

const submit = () => {
  ElMessage.success('组庭方式确认成功，进入下一步')
}
</script>

<style scoped>
.node-workspace {
  max-width: 800px;
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
  color: var(--arb-primary);
  margin: 0;
}

.form-card {
  background: white;
  padding: 32px;
  border-radius: var(--arb-radius-lg);
  border: 1px solid var(--arb-border);
  box-shadow: var(--arb-shadow);
}

.selection-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 8px;
}

.option-card {
  border: 2px solid var(--arb-border);
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.option-card:hover {
  border-color: var(--arb-primary-light);
  background: var(--arb-bg);
}

.option-card.active {
  border-color: var(--arb-gold);
  background: var(--arb-gold-bg);
}

.icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--arb-text-main);
  margin-bottom: 8px;
}

.card-desc {
  font-size: 13px;
  color: var(--arb-text-secondary);
  line-height: 1.5;
}

.check-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  color: var(--arb-gold);
  font-weight: bold;
}

.form-actions {
  margin-top: 32px;
  text-align: right;
}
</style>
