<template>
  <div class="node-content">
    <div class="node-card glass-card">
      <div class="card-header-wrapper">
        <div class="card-header">
          <div class="header-left">
            <span class="title">秘书材料核对</span>
            <span class="subtitle">请核对当事人提交的组庭材料</span>
          </div>
          <div class="header-right">
             <el-tag v-if="!allChecked" type="warning" effect="dark" size="large" round class="status-tag">
               <el-icon class="is-loading"><Loading /></el-icon> 核对中
             </el-tag>
             <el-tag v-else type="success" effect="dark" size="large" round class="status-tag">
               <el-icon><CircleCheckFilled /></el-icon> 已完成
             </el-tag>
          </div>
        </div>
      </div>

      <!-- 核对卡片网格 -->
      <div class="checklist-grid">
        <div 
          v-for="(item, index) in checklist" 
          :key="index"
          class="check-card"
          :class="{ 'is-checked': item.status, 'is-active': currentFocus === index }"
          @click="toggleItem(index)"
        >
          <div class="check-status-line"></div>
          <div class="check-content">
            <div class="check-header">
              <span class="check-title">{{ item.item }}</span>
              <div class="status-toggle">
                <el-switch
                  v-model="item.status"
                  inline-prompt
                  size="large"
                  active-text="通过"
                  inactive-text="待核"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; transform: scale(1.2);"
                  @click.stop
                />
              </div>
            </div>
            
            <div class="check-detail">
              <div class="detail-row">
                 <span class="label">关联文件:</span>
                 <el-link type="primary" :underline="false" @click.stop="previewFile(item)">
                   <el-icon class="el-icon--left"><Document /></el-icon>
                   {{ item.file }}
                 </el-link>
              </div>
              <div class="remark-input">
                <el-input 
                  v-model="item.remark" 
                  placeholder="请输入核对备注..." 
                  size="small"
                  @click.stop
                >
                  <template #prefix><el-icon><EditPen /></el-icon></template>
                </el-input>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 结论与操作 -->
      <div class="footer-action">
        <div class="action-buttons" style="margin-left: auto;">
           <el-button type="primary" size="large" class="submit-btn" :disabled="!allChecked">
             提交核对结果 <el-icon class="el-icon--right"><Upload /></el-icon>
           </el-button>
        </div>
      </div>
    </div>

    <!-- 文件预览弹窗 -->
    <el-dialog v-model="filePreviewVisible" title="文件预览" width="800px" align-center>
      <div class="file-preview-content">
        <div class="preview-header">
          <el-icon size="40" color="#409eff"><Document /></el-icon>
          <h3>{{ currentFile.name }}</h3>
        </div>
        <div class="preview-body">
          <el-skeleton :rows="5" animated />
          <div class="mock-content">
            <p>这里是文件 {{ currentFile.name }} 的预览内容...</p>
            <p>（真实环境中此处将显示PDF或图片预览）</p>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { CircleCheckFilled, WarningFilled, List, Select, CloseBold, EditPen, Stamp, ArrowRight, Loading, Timer, Edit, Upload, Document } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineProps(['nodeData'])

const currentFocus = ref(0)
const filePreviewVisible = ref(false)
const currentFile = ref({ name: '' })

const checklist = reactive([
  { item: '当事人身份证明材料', status: true, remark: '已核验原件', file: '营业执照.pdf' },
  { item: '授权委托书及代理人手续', status: true, remark: '符合要求', file: '授权委托书.pdf' },
  { item: '选定仲裁员资格核查', status: false, remark: '', file: '仲裁员名册数据库' },
  { item: '证据材料', status: false, remark: '', file: '证据清单.pdf' }
])

const allChecked = computed(() => checklist.every(item => item.status))
const pendingCount = computed(() => checklist.filter(item => !item.status).length)
const progressPercentage = computed(() => Math.round((checklist.filter(item => item.status).length / checklist.length) * 100))
const hasRisk = computed(() => false) // 模拟逻辑

const progressStatus = computed(() => {
  return allChecked.value ? 'success' : 'warning'
})

const formatProgress = (percentage) => {
  return percentage === 100 ? '完成' : `${percentage}%`
}

const toggleItem = (index) => {
  currentFocus.value = index
}

const handleSaveDraft = () => {
  ElMessage.success('进度已保存')
}

const previewFile = (item) => {
  currentFile.value = { name: item.file }
  filePreviewVisible.value = true
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
  background: white;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--arb-text-primary);
  font-family: var(--arb-font-serif);
}

.subtitle {
  font-size: 14px;
  color: var(--arb-text-secondary);
}

.header-progress {
  margin-bottom: 32px;
}

/* Header Progress */
.header-progress {
  margin-bottom: 32px;
}

/* Checklist Grid */
.checklist-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.check-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  display: flex;
  transition: all 0.3s;
  border: 2px solid transparent;
  cursor: pointer;
}

.check-card:hover {
  box-shadow: 0 12px 32px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.check-card.is-active {
  border-color: var(--arb-primary);
  background: #fdfdfe;
}

.check-status-line {
  width: 6px;
  background: #e4e7ed;
  transition: background 0.3s;
}

.check-card.is-checked .check-status-line {
  background: #67c23a;
}

.check-content {
  flex: 1;
  padding: 24px;
}

.check-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.check-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--arb-text-main);
}

.check-detail {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  font-size: 14px;
  color: var(--arb-text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.remark-input :deep(.el-input__wrapper) {
  background-color: #f5f7fa;
  box-shadow: none !important;
}

.remark-input :deep(.el-input__inner) {
  font-size: 13px;
}

/* Footer */
.footer-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 32px;
  border-top: 1px solid #f0f2f5;
}

.conclusion-box {
  display: flex;
  align-items: center;
  gap: 20px;
}

.conclusion-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f0f9eb;
  color: #67c23a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.text-warning {
  color: #e6a23c;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.submit-btn {
  padding: 0 40px;
  height: 50px;
  font-size: 16px;
  border-radius: 25px;
  background: var(--arb-gradient-primary);
  border: none;
}

.submit-btn:disabled {
  background: #a0cfff;
  opacity: 0.6;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.file-preview-content {
  padding: 20px;
  text-align: center;
}

.preview-header {
  margin-bottom: 30px;
}

.mock-content {
  margin-top: 30px;
  color: #909399;
  padding: 40px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px dashed #dcdfe6;
}
</style>
