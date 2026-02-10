<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-left">
        <h2 class="gradient-text">边裁选首裁结果</h2>
        <div class="subline">系统根据两名边裁提交结果生成一致性结论</div>
      </div>
      <div class="header-right">
        <el-tag effect="dark" :type="isConsistent ? 'success' : 'warning'" round>
          {{ isConsistent ? '一致' : '不一致' }}
        </el-tag>
      </div>
    </div>

    <div class="workspace-content">
      <div class="glass-card content-card">
        <div class="summary-card" :class="{ ok: isConsistent, warn: !isConsistent }">
          <div class="summary-icon">
            <el-icon v-if="isConsistent"><CircleCheck /></el-icon>
            <el-icon v-else><WarningFilled /></el-icon>
          </div>
          <div class="summary-main">
            <div class="summary-title">
              {{ isConsistent ? '边裁已共同选定首裁' : '边裁未能共同选定首裁' }}
            </div>
            <div class="summary-desc">
              {{ isConsistent ? '可进入主任最终指定/确认流程。' : '将进入审批链，由部门负责人/分管委领导推荐并由主任最终确认。' }}
            </div>
          </div>
          <div class="summary-actions">
            <el-button v-if="isConsistent" type="primary" @click="goDirectorFinal">进入主任最终指定</el-button>
            <el-button v-else type="warning" @click="goApproval">进入审批链</el-button>
          </div>
        </div>

        <div class="detail-grid">
          <div class="detail-panel">
            <div class="panel-title">提交情况</div>
            <div class="row" v-for="a in arbitrators" :key="a.id">
              <div class="who">
                <div class="avatar">{{ (a.name || '边').slice(0, 1) }}</div>
                <div class="who-main">
                  <div class="who-name">{{ a.name }}</div>
                  <div class="who-side">{{ a.side }}</div>
                </div>
              </div>
              <div class="pick">
                <div class="pick-name">{{ candidateName(a.selectedCandidateId) }}</div>
                <el-tag size="small" :type="a.submitted ? 'success' : 'info'" effect="plain">
                  {{ a.submitted ? '已提交' : '未提交' }}
                </el-tag>
              </div>
            </div>
          </div>

          <div class="detail-panel">
            <div class="panel-title">候选人</div>
            <div class="cand-row" v-for="c in candidates" :key="c.id">
              <div class="cand-name">{{ c.name }}</div>
              <div class="cand-tags">
                <el-tag v-for="t in c.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-actions">
          <el-button plain @click="backToChoose">返回边裁选首裁</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CircleCheck, WarningFilled } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'

const { state, setActiveNode } = useArbitration()

const chooseNode = computed(() => state.timelineNodes.find((n) => n.id === 13))
const candidates = computed(() => chooseNode.value?.data?.candidates || [])
const arbitrators = computed(() => chooseNode.value?.data?.arbitrators || [])

const isConsistent = computed(() => {
  const a = arbitrators.value?.[0]
  const b = arbitrators.value?.[1]
  if (!a?.submitted || !b?.submitted) return false
  if (!a.selectedCandidateId || !b.selectedCandidateId) return false
  return a.selectedCandidateId === b.selectedCandidateId
})

const candidateName = (id) => {
  const c = candidates.value.find((x) => x.id === id)
  return c?.name || '-'
}

const goApproval = () => setActiveNode(6)
const goDirectorFinal = () => setActiveNode(11)
const backToChoose = () => setActiveNode(13)
</script>

<style scoped>
.node-workspace {
  max-width: 1200px;
  margin: 0 auto;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gradient-text {
  background: var(--arb-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  font-family: var(--arb-font-serif);
}

.subline {
  font-size: 13px;
  color: var(--arb-text-secondary);
}

.content-card {
  padding: 28px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 18px;
  border-radius: 16px;
  border: 1px solid rgba(30, 58, 138, 0.12);
  background: rgba(255, 255, 255, 0.6);
  margin-bottom: 18px;
}

.summary-card.ok {
  border-color: rgba(16, 185, 129, 0.22);
  background: rgba(236, 253, 245, 0.7);
}

.summary-card.warn {
  border-color: rgba(245, 158, 11, 0.25);
  background: rgba(255, 251, 235, 0.75);
}

.summary-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.06);
  flex-shrink: 0;
}

.summary-main {
  flex: 1;
  min-width: 0;
}

.summary-title {
  font-weight: 900;
  color: var(--arb-text-primary);
  margin-bottom: 6px;
}

.summary-desc {
  color: var(--arb-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 18px;
}

.detail-panel {
  border-radius: 16px;
  border: 1px solid rgba(30, 58, 138, 0.12);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 18px;
}

.panel-title {
  font-weight: 900;
  color: var(--arb-text-primary);
  margin-bottom: 14px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(15, 23, 42, 0.06);
  margin-bottom: 10px;
}

.who {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.95), rgba(59, 130, 246, 0.85));
}

.who-name {
  font-weight: 800;
  color: var(--arb-text-primary);
}

.who-side {
  font-size: 12px;
  color: var(--arb-text-secondary);
  margin-top: 2px;
}

.pick {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pick-name {
  font-weight: 800;
  color: var(--arb-text-primary);
}

.cand-row {
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(15, 23, 42, 0.06);
  margin-bottom: 10px;
}

.cand-name {
  font-weight: 800;
  color: var(--arb-text-primary);
  margin-bottom: 8px;
}

.cand-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.footer-actions {
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>

