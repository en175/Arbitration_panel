<template>
  <div class="timeline-wrapper">
    <transition name="fade">
      <button 
        v-show="showLeftArrow" 
        class="scroll-btn left" 
        @click="scroll('left')"
      >
        <el-icon><ArrowLeft /></el-icon>
      </button>
    </transition>
    
    <div 
      class="timeline-scroller" 
      ref="scrollContainer"
      @scroll="checkScroll"
    >
      <div class="nodes-track">
        <div 
          v-for="(node, index) in nodes" 
          :key="node.id"
          class="timeline-node"
          :class="{
            'is-active': node.id === activeNodeId,
            'is-completed': node.status === 'completed',
            'is-current-process': node.status === 'in_progress',
          }"
          @click="handleClick(node)"
        >
          <div class="node-indicator">
            <div class="line left" v-if="index > 0"></div>
            <div class="dot-wrapper">
              <div class="dot">
                <el-icon v-if="node.status === 'completed'" class="icon-check"><Select /></el-icon>
                <span v-else class="step-num">{{ index + 1 }}</span>
              </div>
              <div class="pulse-ring" v-if="node.status === 'in_progress'"></div>
            </div>
            <div class="line right" v-if="index < nodes.length - 1"></div>
          </div>
          <div class="node-content">
            <div class="node-title">{{ node.title }}</div>
            <div class="node-meta">
              <!-- Dynamic class based on role -->
              <span class="role-badge" :class="`role-${node.role}`">{{ node.roleLabel }}</span>
              <span v-if="node.status === 'in_progress'" class="status-badge">进行中</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <button 
        v-show="showRightArrow" 
        class="scroll-btn right" 
        @click="scroll('right')"
      >
        <el-icon><ArrowRight /></el-icon>
      </button>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Select, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

defineProps({
  nodes: Array,
  activeNodeId: Number
})

const emit = defineEmits(['select'])
const scrollContainer = ref(null)
const showLeftArrow = ref(false)
const showRightArrow = ref(true)

const handleClick = (node) => {
  emit('select', node)
}

const checkScroll = () => {
  if (!scrollContainer.value) return
  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
  
  // Show left arrow if scrolled more than 10px
  showLeftArrow.value = scrollLeft > 10
  
  // Show right arrow if not at the end (with small buffer)
  showRightArrow.value = scrollLeft + clientWidth < scrollWidth - 10
}

const scroll = (direction) => {
  if (!scrollContainer.value) return
  const scrollAmount = 320 
  const currentScroll = scrollContainer.value.scrollLeft
  const targetScroll = direction === 'left' 
    ? currentScroll - scrollAmount 
    : currentScroll + scrollAmount
    
  scrollContainer.value.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  })
}

onMounted(() => {
  checkScroll()
  window.addEventListener('resize', checkScroll)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll)
})
</script>

<style scoped>
.timeline-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
}

.scroll-btn {
  position: absolute; /* Changed to absolute to float over mask */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(30, 58, 138, 0.1);
  color: var(--arb-primary);
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.scroll-btn.left {
  left: -22px; /* Pull out slightly */
}

.scroll-btn.right {
  right: -22px;
}

.scroll-btn:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.2);
  color: var(--arb-primary-light);
}

.scroll-btn:active {
  transform: scale(0.95);
}

/* Fade transition for buttons */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.timeline-scroller {
  flex: 1;
  overflow-x: auto;
  padding: 40px 0;
  scrollbar-width: none; 
  scroll-behavior: smooth;
  /* Removed mask-image entirely to fix truncation issues */
}

.timeline-scroller::-webkit-scrollbar {
  display: none; 
}

.nodes-track {
  display: flex;
  /* Increased padding to ensure shadows and glow are fully visible */
  padding: 0 80px; 
  min-width: max-content;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 180px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Hover Effect */
.timeline-node:hover .node-title {
  color: var(--arb-primary);
  transform: translateY(-2px);
}

.timeline-node:hover .dot {
  transform: scale(1.1);
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.1);
}

/* Node Indicator Lines */
.node-indicator {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
  position: relative;
  height: 32px;
  justify-content: center;
}

.line {
  height: 2px;
  background: #E2E8F0;
  flex: 1;
  transition: all 0.4s ease;
}

.timeline-node.is-completed .line,
.timeline-node.is-current-process .line.left {
  background: var(--arb-primary);
}

.dot-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  z-index: 2;
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 2px solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.4s ease;
  z-index: 2;
  position: relative;
}

/* Completed State */
.timeline-node.is-completed .dot {
  background: var(--arb-primary);
  border-color: var(--arb-primary);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* Active/Current State */
.timeline-node.is-active .dot,
.timeline-node.is-current-process .dot {
  border-color: var(--arb-primary);
  color: var(--arb-primary);
  background: white;
  transform: scale(1.1);
}

.timeline-node.is-active .dot {
  background: var(--arb-primary);
  color: white;
}

/* Pulse Animation for Current Process */
.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--arb-primary);
  animation: pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  z-index: 1;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(2.2);
    opacity: 0;
  }
}

/* Content Styles */
.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 8px;
}

.node-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--arb-text-main);
  margin-bottom: 6px;
  transition: all 0.3s;
  white-space: nowrap;
}

.timeline-node.is-active .node-title {
  color: var(--arb-primary);
  font-weight: 700;
}

.node-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

/* Role Badges with Colors */
.role-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #F1F5F9;
  color: #64748B;
  transition: all 0.3s;
}

.role-secretary {
  background: #EFF6FF; /* Blue-50 */
  color: #2563EB; /* Blue-600 */
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.role-party {
  background: #FFFBEB; /* Amber-50 */
  color: #D97706; /* Amber-600 */
  border: 1px solid rgba(217, 119, 6, 0.2);
}

.role-director {
  background: #FEF2F2; /* Red-50 */
  color: #DC2626; /* Red-600 */
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.role-arbitrator {
  background: #F0FDF4; /* Green-50 */
  color: #16A34A; /* Green-600 */
  border: 1px solid rgba(22, 163, 74, 0.2);
}

.status-badge {
  font-size: 10px;
  color: white;
  background: var(--arb-gradient-gold);
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
}

.timeline-node:hover {
  opacity: 1;
  filter: grayscale(0);
  /* Removed transform to keep lines aligned */
}

.timeline-node:hover .node-content {
  transform: translateY(-4px);
}

.timeline-node:hover .dot {
  transform: scale(1.1);
  border-color: var(--arb-primary);
  color: var(--arb-primary);
  background: white;
}

.timeline-node.is-active {
  opacity: 1;
  filter: grayscale(0);
  /* Removed transform to keep lines aligned */
  z-index: 5;
}

.timeline-node.is-active .node-content {
  transform: translateY(-4px) scale(1.05);
}

.timeline-node.is-active .node-title {
  color: var(--arb-primary);
  font-weight: 700;
  font-size: 16px;
  background: linear-gradient(135deg, var(--arb-primary) 0%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.timeline-node.is-active .dot {
  transform: scale(1.3);
  box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.15);
  border-color: var(--arb-primary);
  background: var(--arb-primary);
  color: white;
}

.timeline-node.is-current-process .dot {
  border-color: var(--arb-gold);
  background: var(--arb-gradient-gold);
  color: white;
  animation: pulse-gold 2s infinite;
  box-shadow: 0 0 15px rgba(180, 83, 9, 0.4);
}

.timeline-node.is-completed .dot {
  background: white;
  border-color: var(--arb-primary);
  color: var(--arb-primary);
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.1);
}

.timeline-node.is-completed .line {
  background: var(--arb-primary-light);
  opacity: 0.6;
}

.node-indicator {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 14px;
}

.line {
  flex: 1;
  height: 2px;
  background: rgba(0,0,0,0.06);
  border-radius: 2px;
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.1);
  background: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: var(--arb-text-secondary);
  font-weight: 600;
  font-size: 14px;
}

.node-content {
  text-align: center;
  padding: 0 8px;
  transition: all 0.3s;
}

.node-title {
  font-size: 14px;
  color: var(--arb-text-main);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  transition: color 0.3s;
}

.node-meta {
  font-size: 12px;
  color: var(--arb-text-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.status-badge {
  color: var(--arb-gold);
  font-weight: 600;
  background: rgba(251, 191, 36, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  margin-top: 4px;
}

@keyframes pulse-gold {
  0% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.4); }
  70% { box-shadow: 0 0 0 8px rgba(180, 83, 9, 0); }
  100% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0); }
}
</style>
