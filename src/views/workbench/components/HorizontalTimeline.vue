<template>
  <div class="timeline-scroller">
    <div class="nodes-track">
      <div 
        v-for="(node, index) in nodes" 
        :key="node.id"
        class="timeline-node"
        :class="{
          'is-active': node.id === activeNodeId,
          'is-completed': node.status === 'completed',
          'is-current-process': node.status === 'in_progress',
          'is-disabled': false, // Disable the disabled state visual for demo
          // 'is-disabled': node.status === 'pending' && node.id !== activeNodeId
        }"
        @click="handleClick(node)"
      >
        <div class="node-indicator">
          <div class="line left" v-if="index > 0"></div>
          <div class="dot">
            <el-icon v-if="node.status === 'completed'" class="icon-check"><Select /></el-icon>
            <span v-else class="step-num">{{ index + 1 }}</span>
          </div>
          <div class="line right" v-if="index < nodes.length - 1"></div>
        </div>
        <div class="node-content">
          <div class="node-title">{{ node.title }}</div>
          <div class="node-meta">
            <span class="role">{{ node.roleLabel }}</span>
            <span v-if="node.status === 'in_progress'" class="status-badge">进行中</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Select } from '@element-plus/icons-vue'

defineProps({
  nodes: Array,
  activeNodeId: Number // The node currently being VIEWED
})

const emit = defineEmits(['select'])

const handleClick = (node) => {
  // Allow clicking ALL nodes for demo purposes
  // if (node.status === 'pending' && node.status !== 'in_progress') return
  emit('select', node)
}
</script>

<style scoped>
.timeline-scroller {
  width: 100%;
  overflow-x: auto;
  padding: 20px 0;
  background: white;
  border-bottom: 1px solid var(--arb-border);
  scrollbar-width: none; /* Firefox */
}

.timeline-scroller::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.nodes-track {
  display: flex;
  padding: 0 40px;
  min-width: max-content;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 160px; /* Fixed width per node */
  cursor: pointer;
  transition: all 0.3s;
  opacity: 0.6;
}

.timeline-node:hover {
  opacity: 1;
}

.timeline-node.is-active {
  opacity: 1;
}

.timeline-node.is-active .node-title {
  color: var(--arb-primary);
  font-weight: 700;
}

.timeline-node.is-active .dot {
  transform: scale(1.1);
  box-shadow: 0 0 0 4px var(--arb-primary-light);
  border-color: var(--arb-primary);
  background: var(--arb-primary);
  color: white;
}

.timeline-node.is-current-process .dot {
  border-color: var(--arb-gold);
  background: var(--arb-gold);
  color: white;
  animation: pulse-gold 2s infinite;
}

.timeline-node.is-completed .dot {
  background: var(--arb-primary);
  border-color: var(--arb-primary);
  color: white;
}

.timeline-node.is-completed .line {
  background: var(--arb-primary);
}

.node-indicator {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
}

.line {
  flex: 1;
  height: 2px;
  background: var(--arb-border);
}

.dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--arb-border);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  transition: all 0.3s;
  color: var(--arb-text-secondary);
  font-weight: 600;
  font-size: 14px;
}

.node-content {
  text-align: center;
  padding: 0 8px;
}

.node-title {
  font-size: 14px;
  color: var(--arb-text-main);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
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
}

@keyframes pulse-gold {
  0% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(180, 83, 9, 0); }
  100% { box-shadow: 0 0 0 0 rgba(180, 83, 9, 0); }
}
</style>
