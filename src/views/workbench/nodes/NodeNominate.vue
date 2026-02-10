<template>
  <div class="node-content">
    <div class="node-card glass-card">
      <div class="card-header-wrapper">
        <div class="card-header">
          <span class="title">当事人提交选定</span>
          <el-tag type="warning" effect="dark" round>进行中</el-tag>
        </div>
        <div class="header-divider"></div>
      </div>
      
      <div class="selection-grid">
        <!-- 申请人 (已提交) -->
        <div class="party-box applicant">
          <div class="box-header">
            <div class="header-left">
              <div class="icon-circle applicant-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="header-text">
                <div class="role-label">申请人</div>
                <h4 class="box-title">{{ state.caseInfo.members.applicant }}</h4>
              </div>
            </div>
            <el-tag size="small" effect="dark" type="danger" class="status-tag">已提交</el-tag>
          </div>
          <div class="box-content">
            <div class="info-label">选定边裁</div>
            
            <!-- 仲裁员卡片 -->
            <div class="arbitrator-card">
              <div class="card-bg-decor"></div>
              <div class="arb-avatar">
                林
              </div>
              <div class="arb-info">
                <div class="arb-name-row">
                  <span class="arb-name">林志远</span>
                  <span class="arb-id">A003</span>
                </div>
                <div class="arb-meta">
                  <span class="meta-item">男</span>
                  <span class="meta-dot">·</span>
                  <span class="meta-item">博士</span>
                </div>
                <div class="arb-tags">
                  <span class="tag">建设工程</span>
                  <span class="tag">民商事</span>
                </div>
              </div>
              <div class="arb-check">
                <el-icon><Select /></el-icon>
              </div>
            </div>

            <div class="submit-info">
              <span class="label">提交时间</span>
              <span class="value-time">2024-02-03 09:15</span>
            </div>
          </div>
        </div>

        <!-- 被申请人 (模拟操作) -->
        <div class="party-box respondent" :class="{ pending: !respondentSelected }">
          <div class="box-header">
            <div class="header-left">
              <div class="icon-circle respondent-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="header-text">
                <div class="role-label">被申请人</div>
                <h4 class="box-title">{{ state.caseInfo.members.respondent }}</h4>
              </div>
            </div>
            <el-tag v-if="respondentSelected" size="small" effect="dark" type="primary" class="status-tag">已提交</el-tag>
            <el-tag v-else size="small" effect="plain" type="info" class="status-tag">待提交</el-tag>
          </div>
          <div class="box-content">
            <div class="info-label">选定边裁</div>
            
            <!-- 选定后显示卡片 -->
            <div v-if="respondentSelected" class="arbitrator-card">
              <div class="card-bg-decor"></div>
              <div class="arb-avatar">
                {{ respondentCandidate.name.charAt(0) }}
              </div>
              <div class="arb-info">
                <div class="arb-name-row">
                  <span class="arb-name">{{ respondentCandidate.name }}</span>
                  <span class="arb-id">{{ respondentCandidate.id }}</span>
                </div>
                <div class="arb-meta">
                  <span class="meta-item">{{ respondentCandidate.gender }}</span>
                  <span class="meta-dot">·</span>
                  <span class="meta-item">{{ respondentCandidate.education }}</span>
                </div>
                <div class="arb-tags">
                  <span v-for="tag in respondentCandidate.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
              <div class="arb-check">
                <el-icon><Select /></el-icon>
              </div>
            </div>

            <!-- 空态/操作按钮 -->
            <div v-else class="empty-selection">
              <div class="action-area">
                <el-button type="primary" size="large" class="simulate-btn" @click="showDialog = true">
                  <el-icon><Pointer /></el-icon> 模拟被申请人选定
                </el-button>
                <p class="hint-text">点击模拟被申请人侧的操作流程</p>
              </div>
            </div>

            <div class="submit-info">
              <span class="label">{{ respondentSelected ? '提交时间' : '截止时间' }}</span>
              <span class="value-time">{{ respondentSelected ? '刚刚' : '2024-02-10 23:59' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 模拟选定弹窗 -->
    <el-dialog
      v-model="showDialog"
      title="请选定仲裁员 (被申请人视角)"
      width="600px"
      append-to-body
      class="custom-dialog"
    >
      <div class="dialog-body">
        <el-alert title="模拟提示：此处仅展示部分候选人用于演示" type="info" show-icon :closable="false" style="margin-bottom: 20px" />
        
        <div class="candidate-list">
          <div 
            v-for="candidate in mockCandidates" 
            :key="candidate.id"
            class="candidate-item"
            :class="{ active: selectedCandidate?.id === candidate.id }"
            @click="selectedCandidate = candidate"
          >
            <div class="c-avatar">{{ candidate.name.charAt(0) }}</div>
            <div class="c-info">
              <div class="c-name">{{ candidate.name }}</div>
              <div class="c-tags">
                <span v-for="tag in candidate.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="c-check" v-if="selectedCandidate?.id === candidate.id">
              <el-icon><Select /></el-icon>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmSelection" :disabled="!selectedCandidate">
            确认选定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { User, Select, Loading, Pointer } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useArbitration } from '../composables/useArbitration'

defineProps(['nodeData'])

const { state } = useArbitration()
const showDialog = ref(false)
const respondentSelected = ref(false)
const selectedCandidate = ref(null)
const respondentCandidate = ref(null)

const mockCandidates = [
  { id: 'A004', name: '梁伟诚', gender: '男', education: '硕士', tags: ['国际贸易', '投资'] },
  { id: 'A005', name: '叶晓琳', gender: '女', education: '硕士', tags: ['知识产权', '技术'] },
  { id: 'A006', name: '张明远', gender: '男', education: '博士', tags: ['房地产', '金融'] }
]

const confirmSelection = () => {
  respondentCandidate.value = selectedCandidate.value
  respondentSelected.value = true
  showDialog.value = false
}
</script>

<style scoped>
.node-content {
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
}
.node-card {
  padding: 32px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
}
.card-header-wrapper {
  margin-bottom: 32px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.header-divider {
  height: 2px;
  background: linear-gradient(90deg, var(--arb-primary) 0%, transparent 100%);
  opacity: 0.2;
}
.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--arb-text-primary);
  font-family: var(--arb-font-serif);
}
.selection-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
.party-box {
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.6);
  position: relative;
}

/* Themes */
.party-box.applicant {
  background: linear-gradient(135deg, #fff0f0 0%, #fff 100%);
  border-top: 4px solid #f56c6c;
  box-shadow: 0 8px 24px rgba(245, 108, 108, 0.08);
}
.party-box.respondent {
  background: linear-gradient(135deg, #ecf5ff 0%, #fff 100%);
  border-top: 4px solid #409eff;
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.08);
}
.party-box.respondent.pending {
  background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
  border-top-color: #909399;
  box-shadow: none;
  border: 1px dashed #dcdfe6;
}

.party-box:hover {
  transform: translateY(-4px);
}

.box-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.header-left {
  display: flex;
  gap: 16px;
}
.icon-circle {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.applicant-icon {
  background: linear-gradient(135deg, #f56c6c, #fab6b6);
}
.respondent-icon {
  background: linear-gradient(135deg, #409eff, #a0cfff);
}
.party-box.pending .respondent-icon {
  background: #dcdfe6;
}

.header-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.role-label {
  font-size: 12px;
  color: var(--arb-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.box-title {
  margin: 0;
  font-size: 16px; /* Slightly smaller for long names */
  color: var(--arb-text-main);
  font-weight: 700;
  max-width: 220px;
  line-height: 1.4;
}

.box-content {
  padding: 0 24px 24px;
}
.info-label {
  font-size: 13px;
  color: var(--arb-text-secondary);
  margin-bottom: 12px;
  font-weight: 500;
}

/* Arbitrator Card */
.arbitrator-card {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.02);
}

.card-bg-decor {
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: linear-gradient(225deg, rgba(245,108,108,0.1) 0%, transparent 70%);
  border-radius: 0 0 0 40px;
}
.party-box.respondent .card-bg-decor {
  background: linear-gradient(225deg, rgba(64,158,255,0.1) 0%, transparent 70%);
}

.arb-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f2f6fc;
  color: var(--arb-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.arb-info {
  flex: 1;
}

.arb-name-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.arb-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--arb-text-secondary);
  margin-bottom: 8px;
}

.meta-item {
  font-family: var(--arb-font-mono);
  font-weight: 600;
}

.meta-dot {
  opacity: 0.6;
}

.arb-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--arb-text-primary);
}

.arb-id {
  font-size: 12px;
  color: #909399;
}

.arb-tags {
  display: flex;
  gap: 6px;
}

.tag {
  font-size: 11px;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
  color: #67c23a;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(103, 194, 58, 0.1);
  border: 1px solid rgba(103, 194, 58, 0.2);
}

.arb-check {
  color: #67c23a;
  font-size: 20px;
  padding-right: 8px;
}

/* Empty State */
.empty-selection {
  margin-bottom: 20px;
  border: 2px dashed #e4e7ed;
  border-radius: 12px;
  padding: 20px;
  background: #fafafa;
  text-align: center;
}

.action-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.simulate-btn {
  width: 100%;
  font-weight: 600;
}

.hint-text {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

.submit-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0,0,0,0.04);
  padding-top: 16px;
}
.label {
  color: var(--arb-text-secondary);
  font-size: 12px;
}
.value-time {
  font-family: var(--arb-font-mono);
  color: var(--arb-text-primary);
  font-size: 13px;
  font-weight: 500;
}

/* Candidate List */
.candidate-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.candidate-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.candidate-item:hover {
  border-color: var(--arb-primary);
  background: #f0f7ff;
}
.candidate-item.active {
  border-color: var(--arb-primary);
  background: #ecf5ff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}
.c-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #d9ecff;
  color: var(--arb-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}
.c-info {
  flex: 1;
}
.c-name {
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}
.c-tags {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 8px;
}
.c-check {
  color: var(--arb-primary);
  font-size: 20px;
}
</style>
