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
        <div class="hero-card animate-fade-in-up">
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
              <el-tag effect="plain" class="glass-tag">合议庭</el-tag>
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
        <div class="decor-shape shape-1"></div>
      </div>
    </header>

    <!-- 2. Timeline / Branch Map Switcher -->
    <div
      ref="timelineAreaRef"
      class="timeline-area glass-card animate-fade-in-up"
      :class="{ 'is-dragging': isDragging }"
      :style="[timelinePositionStyle, { animationDelay: '0.1s' }]"
    >
      <div class="nav-panel" @pointerdown="startDrag">
        <div class="nav-panel-left">
          <div class="nav-panel-title">流程导航</div>
        </div>
        <!-- <div class="nav-panel-right">
          <el-radio-group v-model="navMode" size="small" class="nav-toggle">
            <el-radio-button value="timeline">时间轴</el-radio-button>
            <el-radio-button value="branch">分支图</el-radio-button>
          </el-radio-group>
        </div> -->
      </div>

      <div v-if="navMode === 'timeline'" class="nav-content">
        <HorizontalTimeline 
          :nodes="state.timelineNodes" 
          :active-node-id="state.activeNodeId"
          @select="handleNodeSelect"
        />
      </div>
      <div v-else class="nav-content nav-content-branch">
        <ArbBranchCanvas
          :active-node-id="state.activeNodeId"
          :timeline-nodes="state.timelineNodes"
          @select="handleCanvasSelect"
        />
      </div>
    </div>

    <!-- 3. Dynamic Workspace Content -->
    <main class="wb-main">
      <div class="main-container animate-fade-in-up" style="animation-delay: 0.2s">
        <div class="workspace-area">
          <div v-if="viewingNode" class="viewing-role-row">
            <el-tag effect="dark" size="small" round>{{ viewingNode.roleLabel }}</el-tag>
            <span class="viewing-node-title">{{ viewingNode.title }}</span>
          </div>

          <component :is="currentNodeComponent" :node-data="viewingNode" />

          <div v-if="!currentNodeComponent" class="empty-workspace glass-card">
            <el-empty description="该节点功能暂未在演示版中开放" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { Calendar } from '@element-plus/icons-vue'
import { useArbitration } from './composables/useArbitration'
import HorizontalTimeline from './components/HorizontalTimeline.vue'
import ArbBranchCanvas from '../../modules/branch-tree/ArbBranchCanvas.vue'

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
import NodeReview from './nodes/NodeReview.vue'
import NodeReviewJoint from './nodes/NodeReviewJoint.vue'
import NodeReview62 from './nodes/NodeReview62.vue'
import NodeReview63 from './nodes/NodeReview63.vue'
import NodeReviewLeadership from './nodes/NodeReviewLeadership.vue'
import NodeDirectorConfirm from './nodes/NodeDirectorConfirm.vue'
import NodeDirectorConfirmAlt from './nodes/NodeDirectorConfirmAlt.vue'
import NodeDirectorDesignate from './nodes/NodeDirectorDesignate.vue' // Node 11
import NodeFinish from './nodes/NodeFinish.vue'       // Node 12
import NodeChiefSelect from './nodes/NodeChiefSelect.vue'
import NodeChiefConfirm from './nodes/NodeChiefConfirm.vue'
import NodeReview64 from './nodes/NodeReview64.vue'
import NodeDirectorConfirm77 from './nodes/NodeDirectorConfirm77.vue'
import NodeReview66 from './nodes/NodeReview66.vue'
import NodeDirectorDesignate113 from './nodes/NodeDirectorDesignate113.vue'
import NodeDirectorDesignate17 from './nodes/NodeDirectorDesignate17.vue'

const { state, viewingNode, setActiveNode } = useArbitration()
const navMode = ref('branch')
const timelineAreaRef = ref(null)
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const position = ref({ x: 0, y: 0 })

const timelinePositionStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`
}))

const handleNodeSelect = (node) => {
  setActiveNode(node.id)
}

const handleCanvasSelect = (id) => {
  setActiveNode(id)
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const syncInitialPosition = () => {
  const el = timelineAreaRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const parentRect = el.offsetParent?.getBoundingClientRect()
  const baseLeft = parentRect ? rect.left - parentRect.left : rect.left
  const baseTop = parentRect ? rect.top - parentRect.top : rect.top
  position.value = { x: baseLeft, y: baseTop }
}

const startDrag = (event) => {
  if (event.button !== 0) return
  if (event.target?.closest?.('.nav-toggle')) return
  const el = timelineAreaRef.value
  if (!el) return
  isDragging.value = true
  const rect = el.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  window.addEventListener('pointermove', handleDragMove)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
  event.preventDefault()
}

const handleDragMove = (event) => {
  if (!isDragging.value) return
  const el = timelineAreaRef.value
  if (!el) return
  const parentRect = el.offsetParent?.getBoundingClientRect()
  const baseLeft = parentRect?.left ?? 0
  const baseTop = parentRect?.top ?? 0
  const maxX = (parentRect?.width ?? window.innerWidth) - el.offsetWidth
  const maxY = (parentRect?.height ?? window.innerHeight) - el.offsetHeight
  const rawX = event.clientX - baseLeft - dragOffset.value.x
  const rawY = event.clientY - baseTop - dragOffset.value.y
  position.value = {
    x: clamp(rawX, 0, Math.max(0, maxX)),
    y: clamp(rawY, 0, Math.max(0, maxY))
  }
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  window.removeEventListener('pointermove', handleDragMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
}

onMounted(async () => {
  await nextTick()
  syncInitialPosition()
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', handleDragMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
})

const currentNodeComponent = computed(() => {
  const id = viewingNode.value?.id
  switch (id) {
    case 1: return NodeStart
    case 2: return NodeNominate
    case 3: return NodeSelection
    case 4: return NodeDisclosure // Swapped (was 5)
    case 5: return NodeCheck      // Swapped (was 4)
    case 6: return NodeReview     // Moved (was 11)
    case 6.1: return NodeReviewJoint
    case 6.2: return NodeReview62
    case 6.3: return NodeReview63
    case 6.4: return NodeReview64
    case 6.5: return NodeReviewLeadership
    case 6.6: return NodeReview66
    case 7: return NodeDirector   // Was 6
    case 7.1: return NodeDirectorConfirm
    case 7.7: return NodeDirectorConfirm77
    case 8: return NodeDistribute // Was 7
    case 9: return NodeRanking    // Was 8
    case 10: return NodeResult    // Was 9
    case 11.1: return NodeChiefConfirm
    case 11.2: return NodeDirectorConfirmAlt
    case 11.3: return NodeDirectorDesignate113
    case 11: return NodeDirectorDesignate // New Node
    case 12: return NodeFinish    // Was 11
    case 14: return NodeChiefSelect
    case 17: return NodeDirectorDesignate17
    default: return null
  }
})
</script>

<style scoped>
.workbench-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Changed from height: 100vh to min-height */
  background: var(--arb-bg);
  /* Added nice background gradient mesh */
  background-image: 
    radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%), 
    radial-gradient(circle at 85% 30%, rgba(180, 83, 9, 0.05), transparent 25%);
  padding-bottom: 40px; /* Add some bottom padding for scrolling */
  position: relative;
}

.wb-header {
  min-height: 600px !important;
  position: relative;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #1E40AF 100%);
  color: white;
  padding: 0 24px 32px;
  /* overflow: hidden; Removed to prevent clipping of shadows/glows */
  height: auto;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  border-bottom: none;
  box-shadow: 0 10px 40px -10px rgba(30, 58, 138, 0.5);
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
  font-size: 20px;
  font-family: var(--arb-font-serif);
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.app-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  padding: 4px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Hero Card Styling */
.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 32px 48px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.hero-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.case-info-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.case-no {
  font-family: var(--arb-font-mono);
  font-size: 36px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, #fff, #bfdbfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.case-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  opacity: 0.95;
  color: #E2E8F0;
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
  margin-top: 10px;
  display: flex;
  gap: 8px;
}

.glass-tag {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 500;
  backdrop-filter: blur(4px);
}

/* Days Remaining Card */
.days-remaining {
  flex-shrink: 0;
}

.days-card {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  width: 110px;
  height: 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  backdrop-filter: blur(10px);
}

.days-num {
  font-size: 42px;
  font-weight: 800;
  line-height: 1;
  font-family: var(--arb-font-mono);
  background: linear-gradient(to bottom, #fff, #fbbf24);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
}

.days-label {
  font-size: 12px;
  margin-top: 6px;
  color: rgba(255,255,255,0.9);
  font-weight: 500;
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
  filter: blur(60px);
}

.circle-1 {
  width: 600px;
  height: 600px;
  top: -250px;
  right: -150px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(30, 58, 138, 0) 70%);
  opacity: 0.8;
  animation: float 10s ease-in-out infinite;
}

.circle-2 {
  width: 500px;
  height: 500px;
  bottom: -200px;
  left: -100px;
  background: radial-gradient(circle, rgba(180, 83, 9, 0.2) 0%, rgba(180, 83, 9, 0) 70%);
  opacity: 0.6;
  animation: float 12s ease-in-out infinite reverse;
}

.decor-shape {
  position: absolute;
  background: linear-gradient(45deg, rgba(255,255,255,0.03), transparent);
  transform: rotate(45deg);
}

.shape-1 {
  width: 1000px;
  height: 200px;
  top: 50px;
  left: -200px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.timeline-area {
  z-index: 10;
  max-width: 100vw;
  width: 100%;
  position: absolute;
  /* Glassmorphism applied via glass-card class in template, override specific padding/radius here */
  border-radius: 16px;
  padding: 12px;
}

.nav-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 8px 10px;
  cursor: grab;
  user-select: none;
}

.is-dragging .nav-panel {
  cursor: grabbing;
}

.nav-panel-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--arb-text-primary);
  font-family: var(--arb-font-serif);
}

.nav-toggle :deep(.el-radio-button__inner) {
  border-color: rgba(30, 58, 138, 0.18);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 6px 14px;
}

.nav-toggle :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, rgba(30, 58, 138, 0.92), rgba(59, 130, 246, 0.88));
  border-color: transparent;
  box-shadow: 0 10px 28px rgba(30, 58, 138, 0.22);
}

.nav-toggle :deep(.el-radio-button__inner:hover) {
  border-color: rgba(30, 58, 138, 0.32);
}

.nav-content {
  width: 100%;
}

.nav-content-branch {
  height: 500px;
  padding: 6px 6px 10px;
}

.wb-main {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
}

.main-container {
  max-width: 1400px;
  margin: 0 auto;
}

.workspace-area {
  flex: 1;
  min-width: 0;
}

.viewing-role-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
}

.viewing-node-title {
  color: var(--arb-text-secondary);
  font-size: 13px;
}

.empty-workspace {
  padding: 64px;
  border: 1px dashed var(--arb-border);
}
</style>
