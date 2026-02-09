<template>
  <el-drawer
    v-model="visible"
    :title="node?.title"
    size="600px"
    :before-close="handleClose"
    class="node-drawer"
  >
    <template #header>
      <div class="drawer-header">
        <span class="title">{{ node?.title }}</span>
        <el-tag :type="node?.status === 'in_progress' ? 'warning' : 'success'">
          {{ node?.status === 'in_progress' ? '进行中' : '已完成' }}
        </el-tag>
      </div>
    </template>

    <div v-if="node" class="drawer-content">
      <!-- Common Info -->
      <div class="section">
        <div class="section-title">节点信息</div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="责任角色">{{ node.roleLabel }}</el-descriptions-item>
          <el-descriptions-item label="截止时间" v-if="node.deadline">{{ node.deadline }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">{{ node.summary }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <!-- Node 8: Sorting Interface -->
      <div v-if="node.id === 8 && node.status === 'in_progress'" class="section sorting-section">
        <div class="section-title">
          推荐名单排序
          <span class="subtitle">请对以下推荐仲裁员进行排序（拖拽或点击调整）</span>
        </div>
        
        <div v-if="canOperate" class="sort-list">
          <div 
            v-for="(arb, index) in localSortList" 
            :key="arb.id" 
            class="sort-item"
            :class="{ 'is-top': index === 0 }"
          >
            <div class="rank-number">{{ index + 1 }}</div>
            <div class="arb-info">
              <div class="arb-name">{{ arb.name }}</div>
              <div class="arb-tags">
                <el-tag v-for="tag in arb.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
              </div>
            </div>
            <div class="sort-actions">
              <el-button circle size="small" :disabled="index === 0" @click="moveUp(index)">
                <el-icon><ArrowUp /></el-icon>
              </el-button>
              <el-button circle size="small" :disabled="index === localSortList.length - 1" @click="moveDown(index)">
                <el-icon><ArrowDown /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div v-else class="permission-denied">
          <el-alert title="您当前无权操作此节点（需切换为当事人）" type="info" show-icon :closable="false" />
        </div>
      </div>

      <!-- Generic Content for other nodes -->
      <div v-else class="section">
        <el-empty description="暂无更多操作内容" image-size="100" />
      </div>
    </div>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="visible = false">关闭</el-button>
        <el-button 
          v-if="canOperate && node?.status === 'in_progress'" 
          type="primary" 
          @click="handleSubmit"
          class="submit-btn"
        >
          提交排序结果
        </el-button>
        <!-- Debug Tool -->
        <el-button 
          v-if="state.currentUser === 'director' && node?.id === 8" 
          type="warning" 
          plain 
          @click="forceComplete"
        >
          [演示] 强制完成双方排序
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  node: Object
})

const emit = defineEmits(['update:modelValue'])

const { state, submitSort, completeSortNode } = useArbitration()
const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const localSortList = ref([])

const canOperate = computed(() => {
  return props.node?.role === state.currentUser
})

watch(() => props.node, (newNode) => {
  if (newNode && newNode.id === 8 && newNode.data?.list) {
    localSortList.value = [...newNode.data.list]
  }
}, { immediate: true })

const moveUp = (index) => {
  if (index === 0) return
  const item = localSortList.value[index]
  localSortList.value.splice(index, 1)
  localSortList.value.splice(index - 1, 0, item)
}

const moveDown = (index) => {
  if (index === localSortList.value.length - 1) return
  const item = localSortList.value[index]
  localSortList.value.splice(index, 1)
  localSortList.value.splice(index + 1, 0, item)
}

const handleSubmit = () => {
  submitSort(localSortList.value)
  ElMessage.success('排序结果已提交')
  visible.value = false
}

const forceComplete = () => {
  completeSortNode()
  ElMessage.success('演示：已强制完成双方排序')
  visible.value = false
}

const handleClose = (done) => {
  done()
}
</script>

<style scoped>
.drawer-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--arb-primary);
  font-family: var(--arb-font-serif);
}

.section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--arb-text-main);
  border-left: 4px solid var(--arb-gold);
  padding-left: 12px;
  display: flex;
  flex-direction: column;
}

.subtitle {
  font-size: 12px;
  font-weight: 400;
  color: var(--arb-text-secondary);
  margin-top: 4px;
}

.sort-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sort-item {
  display: flex;
  align-items: center;
  background: var(--arb-bg);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid var(--arb-border);
  transition: all 0.2s;
}

.sort-item:hover {
  border-color: var(--arb-primary-light);
  background: white;
}

.sort-item.is-top {
  border-color: var(--arb-gold);
  background: var(--arb-gold-bg);
}

.rank-number {
  width: 32px;
  height: 32px;
  background: var(--arb-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 12px;
  color: var(--arb-text-secondary);
}

.sort-item.is-top .rank-number {
  background: var(--arb-gold);
  color: white;
}

.arb-info {
  flex: 1;
}

.arb-name {
  font-weight: 500;
  color: var(--arb-text-main);
}

.arb-tags {
  margin-top: 4px;
  display: flex;
  gap: 4px;
}

.sort-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.submit-btn {
  background-color: var(--arb-gold);
  border-color: var(--arb-gold);
}

.submit-btn:hover {
  background-color: var(--arb-gold-light);
  border-color: var(--arb-gold-light);
}
</style>
