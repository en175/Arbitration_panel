<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2>推荐名单排序</h2>
      <div class="deadline-alert">
        <el-icon><Timer /></el-icon>
        截止时间：2024-02-15 23:59 (剩余 5 天)
      </div>
    </div>

    <div class="workspace-content">
      <div class="left-panel">
        <div class="instruction-card">
          <h3>操作指引</h3>
          <p>请对下方推荐的仲裁员进行排序。您的排序将与对方当事人的排序进行比对，以确定最终人选。</p>
          <ul class="rule-list">
            <li>支持拖拽调整顺序。</li>
            <li>排在第一位的为您的首选。</li>
            <li>若双方首选一致，该仲裁员将直接确认为首席仲裁员。</li>
          </ul>
        </div>
      </div>

      <div class="right-panel">
        <div class="sort-container">
          <div class="list-header">
            <span>推荐名单 (5人)</span>
            <el-tag type="warning" effect="dark" size="small">待提交</el-tag>
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
                <el-avatar :size="40" style="background: var(--arb-primary-light)">{{ arb.name[0] }}</el-avatar>
              </div>
              <div class="arb-details">
                <div class="name-row">
                  <span class="name">{{ arb.name }}</span>
                  <el-tag size="small" effect="plain" v-for="tag in arb.tags" :key="tag">{{ tag }}</el-tag>
                </div>
                <div class="desc">资深法律专家，执业年限 15年+</div>
              </div>
              <div class="drag-handle">
                <el-icon><Grid /></el-icon>
              </div>
            </div>
          </div>

          <div class="actions">
            <el-button type="primary" size="large" class="submit-btn" @click="submit">
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
  { id: 'A001', name: '张三', tags: ['金融', '股权'] },
  { id: 'A002', name: '李四', tags: ['公司法', '合同'] },
  { id: 'A003', name: '王五', tags: ['民商事', '建设工程'] },
  { id: 'A004', name: '赵六', tags: ['国际贸易', '投资'] },
  { id: 'A005', name: '孙七', tags: ['知识产权', '技术'] }
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
  color: var(--arb-primary);
  margin: 0;
}

.deadline-alert {
  background: #FEF2F2;
  color: #DC2626;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.workspace-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
}

.instruction-card {
  background: var(--arb-surface);
  padding: 24px;
  border-radius: var(--arb-radius);
  border: 1px solid var(--arb-border);
}

.instruction-card h3 {
  margin-top: 0;
  color: var(--arb-text-main);
  font-size: 16px;
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
  background: var(--arb-surface);
  border-radius: var(--arb-radius-lg);
  box-shadow: var(--arb-shadow);
  overflow: hidden;
  border: 1px solid var(--arb-border-light);
}

.list-header {
  background: var(--arb-bg);
  padding: 16px 24px;
  border-bottom: 1px solid var(--arb-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: var(--arb-text-main);
}

.sort-list {
  padding: 16px;
}

.sort-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid var(--arb-border);
  border-radius: 8px;
  margin-bottom: 12px;
  background: white;
  transition: all 0.2s;
  cursor: grab;
}

.sort-item:hover {
  border-color: var(--arb-primary-light);
  box-shadow: var(--arb-shadow);
}

.sort-item.is-first {
  border-color: var(--arb-gold);
  background: var(--arb-gold-bg);
}

.rank-badge {
  width: 28px;
  height: 28px;
  background: var(--arb-border);
  color: var(--arb-text-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 16px;
}

.sort-item.is-first .rank-badge {
  background: var(--arb-gold);
  color: white;
}

.arb-details {
  flex: 1;
  margin-left: 16px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.name {
  font-weight: 600;
  font-size: 16px;
}

.desc {
  font-size: 12px;
  color: var(--arb-text-muted);
}

.drag-handle {
  color: var(--arb-border);
  cursor: grab;
}

.actions {
  padding: 24px;
  border-top: 1px solid var(--arb-border-light);
  text-align: right;
  background: var(--arb-bg);
}

.submit-btn {
  width: 200px;
  --el-button-bg-color: var(--arb-gold);
  --el-button-border-color: var(--arb-gold);
  --el-button-hover-bg-color: var(--arb-gold-light);
  --el-button-hover-border-color: var(--arb-gold-light);
}
</style>
