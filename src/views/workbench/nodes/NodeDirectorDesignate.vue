<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2>主任最终指定</h2>
      <div class="header-actions">
        <!-- Removed Dispute Resolution Tag -->
      </div>
    </div>

    <div class="designate-container">
      <!-- Top: Conflict Context -->
      <div class="context-section animate-fade-in-up">
        <el-alert
          type="warning"
          :closable="false"
          show-icon
          class="mb-4"
        >
          <template #title>
            <span class="alert-title">需要主任介入指定</span>
          </template>
          <template #default>
            <div class="alert-desc">
              由于双方当事人对首席仲裁员的排序结果不一致（首选不同），且未能在规定时间内达成补充协议。根据仲裁规则，需由主任在推荐名单或名册外指定一名首席仲裁员。
            </div>
          </template>
        </el-alert>

        <div class="parties-card glass-card">
          <div class="party-item">
            <span class="label">申请人：</span>
            <span class="value">广州市天河区高新科技发展有限公司</span>
          </div>
          <div class="divider-vertical"></div>
          <div class="party-item">
            <span class="label">被申请人：</span>
            <span class="value">深圳市南山区创新投资合伙企业（有限合伙）</span>
          </div>
        </div>
      </div>

      <div class="main-content-grid">
        <!-- Left: Candidate Analysis -->
        <div class="candidates-column animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="section-label">
            <el-icon><Histogram /></el-icon> 推荐名单人选分析
          </div>
          
          <!-- Option to pick from outside (Moved here) -->
          <div class="external-option-top">
            <el-button class="external-btn white-text-btn" :type="isExternal ? 'primary' : 'default'" @click="openExternalDialog">
              <el-icon><Search /></el-icon> 从名册外其他仲裁员中指定
            </el-button>
          </div>

          <div class="candidate-cards">
            <div 
              v-for="candidate in candidates" 
              :key="candidate.id"
              class="candidate-card"
              :class="{ 'selected': selectedId === candidate.id }"
              @click="handleSelect(candidate)"
            >
              <div class="card-header-row">
                <div class="avatar-box">
                  {{ candidate.name.charAt(0) }}
                </div>
                <div class="info-box">
                  <div class="name">{{ candidate.name }}</div>
                  <div class="tags">
                    <span v-for="tag in candidate.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              
              <div class="card-stats">
                <div class="stat-item">
                  <div class="label">办案数</div>
                  <div class="value">{{ candidate.cases }}</div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <div class="label">平均结案</div>
                  <div class="value">{{ candidate.avgDays }}天</div>
                </div>
              </div>

              <div class="selection-indicator" v-if="selectedId === candidate.id">
                <el-icon><Check /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Designation Action -->
        <div class="action-column animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="designate-card">
            <div class="card-title">指定决定书</div>
            
            <div class="empty-placeholder" v-if="!selectedCandidate">
              <el-icon :size="48" color="#dcdfe6"><Stamp /></el-icon>
              <p>请在左侧选择一名仲裁员<br>或指定名册外人选</p>
            </div>

            <div v-else class="selected-preview">
              <div class="preview-avatar">
                <el-avatar :size="80" shape="square" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              </div>
              <div class="preview-name">{{ selectedCandidate.name }}</div>
              <div class="preview-role">拟任首席仲裁员</div>
              
              <!-- Detailed Info Grid -->
              <div class="preview-details-grid">
                 <div class="detail-item">
                   <span class="label">学历</span>
                   <span class="val">{{ selectedCandidate.education || '博士' }}</span>
                 </div>
                 <div class="detail-item">
                   <span class="label">性别</span>
                   <span class="val">{{ selectedCandidate.gender || '男' }}</span>
                 </div>
                 <div class="detail-item">
                   <span class="label">办案</span>
                   <span class="val">{{ selectedCandidate.cases }}件</span>
                 </div>
                 <div class="detail-item">
                   <span class="label">所在地</span>
                   <span class="val">广州</span>
                 </div>
                 <div class="detail-item full">
                   <span class="label">擅长领域</span>
                   <span class="val">{{ selectedCandidate.tags.join('、') }}</span>
                 </div>
                 <div class="detail-item full">
                   <span class="label">职业背景</span>
                   <span class="val">{{ selectedCandidate.career || '资深律师 / 仲裁员' }}</span>
                 </div>
              </div>

              <el-form layout="vertical" class="reason-form">
                <el-form-item label="指定理由说明">
                  <el-input 
                    type="textarea" 
                    :rows="4" 
                    placeholder="请输入指定理由（可选，内部归档用）..."
                    v-model="reason"
                  />
                </el-form-item>
              </el-form>

              <div class="confirm-action">
                <el-button type="primary" size="large" class="confirm-btn white-text-btn" @click="handleConfirm">
                  确认指定并签发
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Histogram, Check, Search, Stamp } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useArbitration } from '../composables/useArbitration'

const { setActiveNode } = useArbitration()

const selectedId = ref(null)
const selectedCandidate = ref(null)
const isExternal = ref(false)
const reason = ref('')

const candidates = reactive([
  { id: 'A001', name: '郭建国', tags: ['金融', '股权'], rankApp: 2, rankRes: 4, cases: 45, avgDays: 120, education: '博士', gender: '男' },
  { id: 'A002', name: '陈雅芳', tags: ['公司法', '合同'], rankApp: 1, rankRes: 5, cases: 32, avgDays: 115, education: '硕士', gender: '女' },
  { id: 'A003', name: '林志远', tags: ['民商事', '建设'], rankApp: 3, rankRes: 3, cases: 56, avgDays: 130, education: '博士', gender: '男' },
  { id: 'A004', name: '梁伟诚', tags: ['国际贸易', '投资'], rankApp: 4, rankRes: 2, cases: 28, avgDays: 110, education: '博士', gender: '男' },
  { id: 'A005', name: '叶晓琳', tags: ['知产', '技术'], rankApp: 5, rankRes: 1, cases: 39, avgDays: 125, education: '硕士', gender: '女' },
])

const handleSelect = (candidate) => {
  selectedId.value = candidate.id
  selectedCandidate.value = candidate
  isExternal.value = false
}

const openExternalDialog = () => {
  ElMessage.info('演示版：暂未开放名册外查询，请从推荐名单中选择。')
}

const handleConfirm = () => {
  if (!selectedCandidate.value) return
  
  ElMessageBox.confirm(
    `确定指定 ${selectedCandidate.value.name} 为本案首席仲裁员吗？此操作不可撤销。`,
    '最终指定确认',
    {
      confirmButtonText: '确定指定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('指定成功，已生成组庭通知书')
    setTimeout(() => {
      setActiveNode(12) // Go to Finish
    }, 1000)
  })
}
</script>

<style scoped>
.node-workspace {
  padding: 24px;
  background: var(--arb-bg-gray);
  min-height: 100%;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.workspace-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.designate-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.context-section {
  background: white;
  border-radius: 12px;
  padding: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.03);
}

.alert-title {
  font-weight: 700;
  font-size: 14px;
}

.alert-desc {
  font-size: 13px;
  line-height: 1.6;
  margin-top: 8px;
}

.parties-card {
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.party-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.party-item .label {
  color: #64748b;
  font-weight: 500;
}

.party-item .value {
  color: #1e293b;
  font-weight: 600;
}

.divider-vertical {
  width: 1px;
  height: 16px;
  background: #cbd5e1;
  margin: 0 24px;
}

.main-content-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

.candidates-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.external-option-top {
  margin-bottom: 8px;
}

.external-btn {
  width: 100%;
  justify-content: flex-start;
}

.candidate-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.candidate-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.candidate-card:hover {
  background: #f8fafc;
  transform: translateX(4px);
}

.candidate-card.selected {
  border-color: var(--arb-primary);
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.card-header-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar-box {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.info-box {
  flex: 1;
}

.name {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.tags {
  display: flex;
  gap: 4px;
}

.tag {
  font-size: 10px;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  color: #64748b;
}

.rank-badges {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.rank-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
}

.rank-badge.app { background: #3b82f6; }
.rank-badge.res { background: #ec4899; }

.card-stats {
  display: flex;
  background: rgba(255,255,255,0.5);
  border-radius: 8px;
  padding: 8px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-item .label {
  font-size: 10px;
  color: #94a3b8;
}

.stat-item .value {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.stat-divider {
  width: 1px;
  background: #e2e8f0;
}

.selection-indicator {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--arb-primary);
  color: white;
  padding: 4px 8px;
  border-bottom-left-radius: 8px;
  font-size: 12px;
}

/* Designate Card */
.designate-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  min-height: 500px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 32px;
  text-align: center;
  font-family: var(--arb-font-serif);
}

.empty-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  text-align: center;
}

.selected-preview {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-avatar {
  margin-bottom: 16px;
}

.preview-name {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.preview-role {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 32px;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 20px;
}

.preview-details-grid {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item.full {
  grid-column: span 2;
}

.detail-item .label {
  font-size: 12px;
  color: #94a3b8;
}

.detail-item .val {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.reason-form {
  width: 100%;
  margin-bottom: 24px;
}

.confirm-action {
  width: 100%;
}

.confirm-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.white-text-btn {
  color: #fff !important;
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out backwards;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>