<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">系统汇总排序结果</span>
          <el-tag type="warning" effect="dark">进行中</el-tag>
        </div>
      </template>

      <!-- Algorithm Loading State -->
      <div v-if="isLoading" class="algo-loading-container">
        <div class="radar-scan">
          <div class="radar-beam"></div>
          <div class="radar-circle c1"></div>
          <div class="radar-circle c2"></div>
          <div class="radar-circle c3"></div>
          <div class="central-chip">
            <el-icon :size="48"><Cpu /></el-icon>
          </div>
        </div>
        
        <div class="loading-status">
          <h3 class="loading-title">智能组庭算法计算中...</h3>
          <div class="loading-steps">
            <div class="step-item" :class="{ active: progress >= 20, done: progress > 40 }">
              <el-icon><List /></el-icon> 获取双方排序数据
            </div>
            <div class="step-item" :class="{ active: progress >= 50, done: progress > 70 }">
              <el-icon><Histogram /></el-icon> 比对首选重合度
            </div>
            <div class="step-item" :class="{ active: progress >= 80, done: progress >= 100 }">
              <el-icon><Checked /></el-icon> 生成最终人选建议
            </div>
          </div>
          <el-progress 
            :percentage="progress" 
            :stroke-width="12" 
            striped 
            striped-flow 
            :duration="10"
            class="algo-progress"
          />
        </div>
      </div>

      <!-- Result State -->
      <div v-else class="calculation-box fade-in">
        <el-alert
          title="排序结果计算完成"
          type="success"
          description="系统已根据双方提交的排序结果，自动匹配出拟定首席仲裁员。"
          show-icon
          :closable="false"
          class="mb-6"
        />
        
        <div class="preview-result">
          <!-- Applicant Column -->
          <div class="result-column">
            <div class="column-header">
              <el-tag effect="plain">申请人</el-tag>
              <h4>提交排序</h4>
            </div>
            <div class="sort-list-static">
              <div class="static-item first">
                <span class="rank">1</span> 李四
              </div>
              <div class="static-item">
                <span class="rank">2</span> 张三
              </div>
              <div class="static-item">
                <span class="rank">3</span> 王五
              </div>
            </div>
          </div>

          <div class="divider">
            <el-icon size="24"><Close /></el-icon>
          </div>

          <!-- Respondent Column -->
          <div class="result-column">
            <div class="column-header">
              <el-tag effect="plain" type="success">被申请人</el-tag>
              <h4>提交排序</h4>
            </div>
            <div class="sort-list-static">
              <div class="static-item first">
                <span class="rank">1</span> 李四
              </div>
              <div class="static-item">
                <span class="rank">2</span> 王五
              </div>
              <div class="static-item">
                <span class="rank">3</span> 张三
              </div>
            </div>
          </div>

          <div class="divider">
            <el-icon size="24"><Right /></el-icon>
          </div>

          <!-- Result Column -->
          <div class="result-column highlight">
            <div class="column-header">
              <el-tag effect="dark">系统</el-tag>
              <h4>匹配结果</h4>
            </div>
            <div class="match-result-box success">
              <div class="crown-box">👑</div>
              <el-avatar :size="64" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div class="match-name">李四</div>
              <el-tag type="success" size="small">双方共同首选</el-tag>
            </div>
          </div>
        </div>
        
        <div class="action-footer">
           <el-button type="primary" size="large" @click="goNext">进入下一环节：主任确认</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Close, Right, Loading, Cpu, List, Histogram, Checked } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'

defineProps(['nodeData'])
const { setActiveNode } = useArbitration()

const isLoading = ref(true)
const progress = ref(0)

onMounted(() => {
  // Simulate Algorithm Process
  const timer = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      clearInterval(timer)
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }, 50)
})

const goNext = () => {
  setActiveNode(10)
}
</script>

<style scoped>
.node-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--arb-text-primary);
}
.calculation-box {
  padding: 12px 0;
}
.mb-6 {
  margin-bottom: 24px;
}

/* Algorithm Animation Styles */
.algo-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  min-height: 400px;
}

.radar-scan {
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 40px;
}

.central-chip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: var(--arb-primary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 10;
  box-shadow: 0 0 20px var(--arb-primary-light);
  animation: pulse-chip 2s infinite;
}

.radar-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid var(--arb-primary);
  border-radius: 50%;
  opacity: 0;
}

.c1 { width: 100px; height: 100px; animation: ripple 3s infinite; animation-delay: 0s; }
.c2 { width: 140px; height: 140px; animation: ripple 3s infinite; animation-delay: 1s; }
.c3 { width: 180px; height: 180px; animation: ripple 3s infinite; animation-delay: 2s; }

.radar-beam {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  background: conic-gradient(from 0deg, transparent 0deg, var(--arb-primary-light) 60deg, transparent 60deg);
  transform-origin: top left;
  animation: scan 4s linear infinite;
  border-radius: 50%;
  opacity: 0.3;
}

.loading-status {
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.loading-title {
  font-size: 20px;
  color: var(--arb-primary);
  margin-bottom: 24px;
  font-family: var(--arb-font-mono);
}

.loading-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 13px;
  color: var(--arb-text-secondary);
}

.step-item {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.5;
  transition: all 0.3s;
}

.step-item.active {
  opacity: 1;
  color: var(--arb-primary);
  font-weight: 600;
}

.step-item.done {
  color: var(--arb-success);
}

/* Result Styles */
.fade-in {
  animation: fadeIn 0.8s ease-out;
}

.preview-result {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 16px;
  background: var(--arb-surface-dim);
  padding: 32px;
  border-radius: 12px;
  border: 1px solid var(--arb-border-color);
}
.result-column {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--arb-shadow-sm);
  display: flex;
  flex-direction: column;
}
.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.column-header h4 {
  margin: 0;
  font-size: 14px;
  color: var(--arb-text-secondary);
}

.sort-list-static {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.static-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-weight: 500;
}

.static-item.first {
  background: #eff6ff;
  color: var(--arb-primary);
  border: 1px solid var(--arb-primary-light);
}

.rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 50%;
  font-size: 12px;
  color: #64748b;
  font-weight: 700;
}

.static-item.first .rank {
  background: var(--arb-primary);
  color: white;
}

.highlight {
  border: 1px solid var(--arb-primary-light);
  background: linear-gradient(180deg, #fff 0%, var(--arb-primary-weak) 100%);
}
.match-result-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--arb-primary);
  font-weight: 600;
}
.match-result-box.success .match-name {
  font-size: 24px;
  font-family: var(--arb-font-serif);
}
.crown-box {
  font-size: 32px;
  margin-bottom: -10px;
  z-index: 1;
  animation: bounce 2s infinite;
}
.divider {
  display: flex;
  align-items: center;
  color: var(--arb-text-secondary);
  opacity: 0.5;
}
.action-footer {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@keyframes pulse-chip {
  0% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
  100% { transform: translate(-50%, -50%) scale(1); }
}

@keyframes ripple {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; border-width: 4px; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; border-width: 0px; }
}

@keyframes scan {
  0% { transform: translate(-100%, -100%) rotate(0deg); }
  100% { transform: translate(-100%, -100%) rotate(360deg); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>