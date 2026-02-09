<template>
  <div class="arb-page workbench-layout">
    <!-- 1. Top Bar: Global Status & Role -->
    <header class="wb-header">
      <div class="header-content">
        <!-- Top Nav Line -->
        <div class="header-top">
            <div class="brand">
              <img src="/gzac-logo.png" alt="Logo" class="app-logo" />
              <span class="app-name">广州仲裁委·仲裁组庭</span>
            </div>
          </div>

        <!-- Hero Card Area -->
        <div class="hero-card">
          <div class="case-info-main">
            <h1 class="case-no">{{ state.caseInfo.caseNo }}</h1>
            <div class="case-meta">
              <span class="meta-item"><el-icon><Calendar /></el-icon> 受理日期: 2025-01-20</span>
              <span class="meta-divider"></span>
              <span class="meta-item">标的额: {{ state.caseInfo.amount }}</span>
              <span class="meta-divider"></span>
              <span class="case-reason">{{ state.caseInfo.caseReason }}</span>
            </div>
            <div class="case-tags">
              <el-tag effect="plain" class="glass-tag">三人仲裁庭</el-tag>
              <el-tag effect="plain" class="glass-tag">独任仲裁庭</el-tag>
            </div>
          </div>
          
          <div class="days-remaining">
            <div class="days-card">
              <span class="days-num">11</span>
              <span class="days-label">剩余天数</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Decorative Background Elements -->
      <div class="header-bg-decor">
        <div class="decor-circle circle-1"></div>
        <div class="decor-circle circle-2"></div>
      </div>
    </header>

    <!-- 2. Timeline Stepper (Horizontal Scroll) -->
    <div class="timeline-area">
      <HorizontalTimeline 
        :nodes="state.timelineNodes" 
        :active-node-id="state.activeNodeId"
        @select="handleNodeSelect"
      />
    </div>

    <!-- 3. Dynamic Workspace Content -->
    <main class="wb-main">
      <div class="main-container">
        <!-- Dynamic Component Loading -->
        <component :is="currentNodeComponent" :node-data="viewingNode" />
        
        <!-- Default Empty State for un-implemented nodes -->
        <div v-if="!currentNodeComponent" class="empty-workspace">
          <el-empty description="该节点功能暂未在演示版中开放" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import { useArbitration } from './composables/useArbitration'
import HorizontalTimeline from './components/HorizontalTimeline.vue'

// Import Node Components
import NodeStart from './nodes/NodeStart.vue'         // Node 1
import NodeSelection from './nodes/NodeSelection.vue' // Node 2
import NodeNominate from './nodes/NodeNominate.vue'   // Node 3
import NodeCheck from './nodes/NodeCheck.vue'         // Node 4
import NodeDisclosure from './nodes/NodeDisclosure.vue' // Node 5
import NodeDirector from './nodes/NodeDirector.vue'   // Node 6
import NodeDistribute from './nodes/NodeDistribute.vue' // Node 7
import NodeRanking from './nodes/NodeRanking.vue'     // Node 8
import NodeResult from './nodes/NodeResult.vue'       // Node 9
import NodeConfirm from './nodes/NodeConfirm.vue'     // Node 10
import NodeReview from './nodes/NodeReview.vue'       // Node 11
import NodeFinish from './nodes/NodeFinish.vue'       // Node 12

const { state, viewingNode, setActiveNode } = useArbitration()

const handleNodeSelect = (node) => {
  setActiveNode(node.id)
}

const currentNodeComponent = computed(() => {
  const id = viewingNode.value?.id
  switch (id) {
    case 1: return NodeStart
    case 2: return NodeSelection
    case 3: return NodeNominate
    case 4: return NodeCheck
    case 5: return NodeDisclosure
    case 6: return NodeDirector
    case 7: return NodeDistribute
    case 8: return NodeRanking
    case 9: return NodeResult
    case 10: return NodeConfirm
    case 11: return NodeReview
    case 12: return NodeFinish
    default: return null
  }
})
</script>

<style scoped>
.workbench-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--arb-bg);
}

.wb-header {
  position: relative;
  background: linear-gradient(180deg, #124494 0%, #0E3E8A 100%); /* Solid Authority Blue */
  color: white;
  padding: 0 24px 32px;
  overflow: hidden;
  height: auto;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  border-bottom: none;
  box-shadow: 0 4px 20px rgba(18, 68, 148, 0.15);
}

.header-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  margin-bottom: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;
  color: white;
  font-size: 18px;
  font-family: var(--arb-font-serif);
}

.app-logo {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  padding: 2px;
}

.role-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-weight: 500;
}

/* Hero Card Styling */
.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 32px 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.case-info-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-no {
  font-family: var(--arb-font-mono);
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.case-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  opacity: 0.9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-divider {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.4);
}

.case-tags {
  margin-top: 8px;
  display: flex;
  gap: 8px;
}

.glass-tag {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
}

/* Days Remaining Card */
.days-remaining {
  flex-shrink: 0;
}

.days-card {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.days-num {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
  font-family: var(--arb-font-mono);
}

.days-label {
  font-size: 12px;
  margin-top: 4px;
  opacity: 0.9;
}

/* Background Decoration */
.header-bg-decor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.decor-circle {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
}

.circle-1 {
  width: 600px;
  height: 600px;
  top: -200px;
  right: -100px;
  opacity: 0.6;
}

.circle-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -50px;
  opacity: 0.4;
}

.timeline-area {
  margin-top: -32px; /* Pull up to overlap */
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  z-index: 10;
  max-width: 1200px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  padding: 8px 0;
}

.wb-main {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
}

.main-container {
  max-width: 1200px;
  margin: 0 auto;
}

.empty-workspace {
  background: white;
  border-radius: 12px;
  padding: 64px;
  border: 1px dashed var(--arb-border);
  box-shadow: var(--arb-shadow);
}
</style>

