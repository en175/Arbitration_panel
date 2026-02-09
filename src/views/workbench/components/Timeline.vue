<template>
  <div class="timeline-container">
    <el-timeline>
      <el-timeline-item
        v-for="node in state.timelineNodes"
        :key="node.id"
        :type="getNodeType(node)"
        :color="getNodeColor(node)"
        :hollow="node.status === 'pending'"
        :timestamp="node.date"
        placement="top"
      >
        <div 
          class="timeline-card" 
          :class="{ 'is-active': node.status === 'in_progress', 'is-pending': node.status === 'pending' }"
          @click="handleNodeClick(node)"
        >
          <div class="card-header">
            <h3 class="node-title">{{ node.title }}</h3>
            <el-tag :type="getStatusType(node.status)" size="small" effect="dark" class="status-tag">
              {{ getStatusLabel(node.status) }}
            </el-tag>
          </div>
          
          <div class="card-body">
            <div class="meta-row">
              <span class="role-badge">
                <el-icon><User /></el-icon> {{ node.roleLabel }}
              </span>
              <span v-if="node.deadline" class="deadline-badge" :class="{ 'urgent': node.remainingDays <= 3 }">
                <el-icon><Timer /></el-icon> 截止: {{ node.deadline }} (余 {{ node.remainingDays }} 天)
              </span>
            </div>
            
            <p class="summary">{{ node.summary }}</p>
            
            <div v-if="node.status === 'in_progress'" class="action-area">
              <el-button type="primary" size="small" @click.stop="openDrawer(node)">
                {{ getActionButtonText(node) }}
              </el-button>
            </div>
          </div>
        </div>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup>
import { User, Timer } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'

const { state } = useArbitration()
const emit = defineEmits(['open-drawer'])

const getNodeType = (node) => {
  if (node.status === 'completed') return 'success'
  if (node.status === 'in_progress') return 'primary'
  return ''
}

const getNodeColor = (node) => {
  if (node.status === 'completed') return 'var(--arb-primary)'
  if (node.status === 'in_progress') return 'var(--arb-gold)'
  return '#E2E8F0'
}

const getStatusType = (status) => {
  if (status === 'completed') return 'success'
  if (status === 'in_progress') return 'warning' // Goldish
  return 'info'
}

const getStatusLabel = (status) => {
  const map = {
    completed: '已完成',
    in_progress: '进行中',
    pending: '未开始'
  }
  return map[status]
}

const getActionButtonText = (node) => {
  if (node.role === state.currentUser) return '立即办理'
  return '查看详情'
}

const handleNodeClick = (node) => {
  emit('open-drawer', node)
}

const openDrawer = (node) => {
  emit('open-drawer', node)
}
</script>

<style scoped>
.timeline-container {
  padding: 20px 40px;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-card {
  background: var(--arb-surface);
  border: 1px solid var(--arb-border);
  border-radius: var(--arb-radius);
  padding: 16px;
  margin-top: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--arb-shadow);
  border-color: var(--arb-primary-light);
}

.timeline-card.is-active {
  border-color: var(--arb-gold);
  background: linear-gradient(to right bottom, #fff, var(--arb-gold-bg));
  box-shadow: var(--arb-shadow-lg);
}

.timeline-card.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--arb-gold);
}

.timeline-card.is-pending {
  opacity: 0.7;
  background: #FAFAFA;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.node-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--arb-text-main);
  font-family: var(--arb-font-serif);
}

.status-tag {
  border-radius: 12px;
  font-weight: 500;
}

/* Override Tag Colors for Gold */
.el-tag--warning.el-tag--dark {
  --el-tag-bg-color: var(--arb-gold);
  --el-tag-border-color: var(--arb-gold);
}

.meta-row {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--arb-text-secondary);
}

.role-badge, .deadline-badge {
  display: flex;
  align-items: center;
  gap: 4px;
}

.deadline-badge.urgent {
  color: #DC2626;
  font-weight: 600;
}

.summary {
  font-size: 14px;
  color: var(--arb-text-secondary);
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.action-area {
  border-top: 1px solid rgba(0,0,0,0.05);
  padding-top: 12px;
  text-align: right;
}
</style>
