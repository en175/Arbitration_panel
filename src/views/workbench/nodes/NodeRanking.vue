<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2 class="gradient-text">推荐名单排序</h2>
      <div class="deadline-alert glass-alert">
        <el-icon><Timer /></el-icon>
        <span>截止时间：2024-02-15 23:59 (剩余 5 天)</span>
      </div>
    </div>

    <div class="workspace-content">
      <div class="left-panel">
        <div class="instruction-card glass-card">
          <h3 class="section-title">操作指引</h3>
          <p>请对下方推荐的仲裁员进行排序。您的排序将与对方当事人的排序进行比对，以确定最终人选。</p>
          <ul class="rule-list">
            <li>支持拖拽调整顺序。</li>
            <li>排在第一位的为您的首选。</li>
            <li>若双方首选一致，该仲裁员将直接确认为首席仲裁员。</li>
          </ul>
        </div>
      </div>

      <div class="right-panel">
        <div class="sort-container glass-card">
          <div class="list-header">
            <span>推荐名单 (5人)</span>
            <el-tag type="warning" effect="dark" size="small" round>待提交</el-tag>
          </div>
          
          <div class="sort-list">
            <div 
              v-for="(arb, index) in localList" 
              :key="arb.id"
              class="sort-item"
              :class="{ 'is-first': index === 0 }"
              draggable="true"
              @dragstart="dragStart(index)"
              @dragover.prevent
              @drop="drop(index)"
            >
              <div class="rank-badge">{{ index + 1 }}</div>
              <div class="arb-avatar">
                <el-avatar :size="48" class="gradient-avatar">{{ arb.name[0] }}</el-avatar>
              </div>
              <div class="arb-details">
                <div class="name-row">
                  <span class="name">{{ arb.name }}</span>
                  <el-tag size="small" effect="plain" v-for="tag in arb.tags" :key="tag" class="tag-glass">{{ tag }}</el-tag>
                </div>
                <div class="desc">资深法律专家，执业年限 15年+</div>
              </div>
              <div class="drag-handle">
                <el-icon><Grid /></el-icon>
              </div>
            </div>
          </div>

          <div class="actions">
            <el-button class="arb-btn-primary" size="large" @click="submit">
              确认并提交排序结果
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Timer, Grid } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useArbitration } from '../composables/useArbitration'

const props = defineProps({
  nodeData: Object
})

const { completeSortNode } = useArbitration()

const localList = ref([
  { id: 'A001', name: '郭建国', tags: ['金融', '股权'] },
  { id: 'A002', name: '陈雅芳', tags: ['公司法', '合同'] },
  { id: 'A003', name: '林志远', tags: ['民商事', '建设工程'] },
  { id: 'A004', name: '梁伟诚', tags: ['国际贸易', '投资'] },
  { id: 'A005', name: '叶晓琳', tags: ['知识产权', '技术'] }
])

const draggedIndex = ref(null)

const dragStart = (index) => {
  draggedIndex.value = index
}

const drop = (index) => {
  const item = localList.value[draggedIndex.value]
  localList.value.splice(draggedIndex.value, 1)
  localList.value.splice(index, 0, item)
  draggedIndex.value = null
}

const submit = () => {
  completeSortNode()
  ElMessage.success('排序结果已提交成功！进入下一环节。')
}
</script>

<style scoped>
.node-workspace {
  max-width: 1000px;
  margin: 0 auto;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.workspace-header h2 {
  font-family: var(--arb-font-serif);
  margin: 0;
  font-size: 24px;
}

.gradient-text {
  background: var(--arb-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.deadline-alert {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.glass-alert {
  background: rgba(254, 242, 242, 0.7);
  backdrop-filter: blur(4px);
  color: #DC2626;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.workspace-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
}

.instruction-card {
  padding: 24px;
}

.section-title {
  margin-top: 0;
  color: var(--arb-text-main);
  font-size: 16px;
  font-weight: 600;
}

.instruction-card p {
  color: var(--arb-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.rule-list {
  padding-left: 20px;
  color: var(--arb-text-secondary);
  font-size: 13px;
  line-height: 1.8;
}

.sort-container {
  overflow: hidden;
  padding: 0;
}

.list-header {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--arb-text-main);
  background: rgba(255, 255, 255, 0.3);
}

.sort-list {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sort-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.4);
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.sort-item:hover {
  background: rgba(255, 255, 255, 0.7);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--arb-primary-light);
}

.sort-item.is-first {
  background: linear-gradient(to right, rgba(255, 255, 255, 0.8), rgba(240, 249, 255, 0.6));
  border-color: var(--arb-primary-light);
}

.rank-badge {
  width: 28px;
  height: 28px;
  background: var(--arb-bg);
  color: var(--arb-text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  margin-right: 16px;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

.is-first .rank-badge {
  background: var(--arb-gradient-gold);
  color: white;
  box-shadow: 0 2px 4px rgba(180, 83, 9, 0.3);
}

.gradient-avatar {
  background: var(--arb-gradient-primary);
  font-weight: 600;
}

.arb-avatar {
  margin-right: 16px;
}

.arb-details {
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.name {
  font-weight: 600;
  color: var(--arb-text-main);
  font-size: 16px;
}

.tag-glass {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.desc {
  font-size: 13px;
  color: var(--arb-text-secondary);
}

.drag-handle {
  color: var(--arb-text-muted);
  cursor: grab;
  padding: 8px;
}

.drag-handle:hover {
  color: var(--arb-primary);
}

.actions {
  padding: 24px;
  text-align: right;
  border-top: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.2);
}
</style>
