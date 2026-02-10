<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-left">
        <h2 class="gradient-text">边裁共同选定首裁</h2>
        <div class="subline">
          <span>截止时间：{{ deadlineText }}</span>
        </div>
      </div>
      <div class="header-right">
        <el-tag effect="dark" type="warning" round>进行中</el-tag>
      </div>
    </div>

    <div class="workspace-content">
      <div class="glass-card content-card">
        <div class="top-row">
          <div class="hint">
            两名边裁需在期限内共同选定一名首裁。提交后系统将自动判定是否一致。
          </div>
          <el-button type="primary" plain :disabled="!bothSubmitted" @click="goResult">
            查看结果
          </el-button>
        </div>

        <div class="main-grid">
          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">{{ arbitrators[0]?.name || '边裁A' }}</div>
              <el-tag size="small" effect="plain">{{ arbitrators[0]?.side || '当事人选定' }}</el-tag>
              <el-tag v-if="arbitrators[0]?.submitted" size="small" effect="dark" type="success">已提交</el-tag>
              <el-tag v-else size="small" effect="plain" type="info">待提交</el-tag>
            </div>
            <div class="candidate-list">
              <button
                v-for="c in candidates"
                :key="c.id"
                type="button"
                class="candidate-item"
                :class="{ selected: arbitrators[0]?.selectedCandidateId === c.id }"
                @click="pickCandidate(0, c.id)"
              >
                <div class="c-name">{{ c.name }}</div>
                <div class="c-tags">
                  <el-tag v-for="t in c.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
                </div>
              </button>
            </div>
            <div class="panel-actions">
              <el-button type="primary" :disabled="!arbitrators[0]?.selectedCandidateId || arbitrators[0]?.submitted" @click="submit(0)">
                提交选择
              </el-button>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <div class="panel-title">{{ arbitrators[1]?.name || '边裁B' }}</div>
              <el-tag size="small" effect="plain">{{ arbitrators[1]?.side || '当事人选定' }}</el-tag>
              <el-tag v-if="arbitrators[1]?.submitted" size="small" effect="dark" type="success">已提交</el-tag>
              <el-tag v-else size="small" effect="plain" type="info">待提交</el-tag>
            </div>
            <div class="candidate-list">
              <button
                v-for="c in candidates"
                :key="c.id"
                type="button"
                class="candidate-item"
                :class="{ selected: arbitrators[1]?.selectedCandidateId === c.id }"
                @click="pickCandidate(1, c.id)"
              >
                <div class="c-name">{{ c.name }}</div>
                <div class="c-tags">
                  <el-tag v-for="t in c.tags" :key="t" size="small" effect="plain">{{ t }}</el-tag>
                </div>
              </button>
            </div>
            <div class="panel-actions">
              <el-button type="primary" :disabled="!arbitrators[1]?.selectedCandidateId || arbitrators[1]?.submitted" @click="submit(1)">
                提交选择
              </el-button>
            </div>
          </div>
        </div>

        <div v-if="bothSubmitted" class="result-hint">
          <el-icon class="hint-icon"><CircleCheck /></el-icon>
          <span>双方均已提交，可查看系统判定结果。</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'

const props = defineProps(['nodeData'])
const { state, setActiveNode } = useArbitration()

const node = computed(() => state.timelineNodes.find((n) => n.id === 13) || props.nodeData)
const deadlineText = computed(() => node.value?.data?.deadline || '-')
const arbitrators = computed(() => node.value?.data?.arbitrators || [])
const candidates = computed(() => node.value?.data?.candidates || [])

const bothSubmitted = computed(() => Boolean(arbitrators.value?.[0]?.submitted && arbitrators.value?.[1]?.submitted))

const pickCandidate = (idx, candidateId) => {
  const list = node.value?.data?.arbitrators
  if (!list?.[idx]) return
  if (list[idx].submitted) return
  list[idx].selectedCandidateId = candidateId
}

const submit = (idx) => {
  const list = node.value?.data?.arbitrators
  if (!list?.[idx]) return
  if (!list[idx].selectedCandidateId) {
    ElMessage.warning('请先选择一名首裁候选人')
    return
  }
  list[idx].submitted = true
  ElMessage.success('已提交')
}

const goResult = () => {
  if (!bothSubmitted.value) return
  setActiveNode(14)
}
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

.top-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;
}

.hint {
  color: var(--arb-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.panel {
  border-radius: 16px;
  border: 1px solid rgba(30, 58, 138, 0.12);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.panel-title {
  font-weight: 800;
  color: var(--arb-text-primary);
  font-size: 14px;
}

.candidate-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.candidate-item {
  text-align: left;
  border-radius: 14px;
  border: 1px solid rgba(30, 58, 138, 0.12);
  background: rgba(255, 255, 255, 0.68);
  padding: 14px 14px 12px;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.candidate-item:hover {
  transform: translateY(-1px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
}

.candidate-item.selected {
  border-color: rgba(59, 130, 246, 0.7);
  box-shadow: 0 14px 26px rgba(59, 130, 246, 0.14);
}

.c-name {
  font-weight: 800;
  color: var(--arb-text-primary);
  margin-bottom: 8px;
}

.c-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.panel-actions {
  display: flex;
  justify-content: flex-end;
}

.result-hint {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(236, 253, 245, 0.7);
  border: 1px solid rgba(16, 185, 129, 0.18);
  color: rgba(6, 95, 70, 0.9);
  font-weight: 600;
}

.hint-icon {
  color: #10b981;
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>

