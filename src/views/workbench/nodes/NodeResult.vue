<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">系统汇总排序结果</span>
          <el-tag type="warning" effect="dark" round>进行中</el-tag>
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
          type="warning"
          description="系统已根据双方提交的排序结果完成比对，发现首选不一致。"
          show-icon
          :closable="false"
          class="mb-6 result-alert"
        />
        
        <div class="preview-result">
          <!-- Applicant Column -->
          <div class="result-column app-column">
            <div class="column-bg-decor"></div>
            <div class="column-header">
              <div class="role-badge app">申请人</div>
              <div class="party-full-name">广州市天河区高新科技发展有限公司</div>
              <h4>提交排序</h4>
            </div>
            <div class="sort-list-static">
              <div class="static-item first">
                <div class="rank-num">1</div>
                <div class="card-full-v3">
                   <div class="v3-head">
                     <div class="v3-avatar">陈</div>
                     <div class="v3-main">
                       <div class="v3-name">陈雅芳</div>
                       <div class="v3-tags">
                        <el-tag size="small" effect="plain">公司法</el-tag>
                        <el-tag size="small" effect="plain">合同法</el-tag>
                       </div>
                     </div>
                   </div>
                   <div class="v3-body">
                     <div class="v3-info">
                      <span>女</span> | <span>硕士</span>
                     </div>
                   </div>
                </div>
                <div class="crown-icon"><el-icon><Trophy /></el-icon></div>
              </div>
              <div class="static-item">
                <span class="rank">2</span> 郭建国
              </div>
              <div class="static-item">
                <span class="rank">3</span> 林志远
              </div>
              <div class="static-item">
                <span class="rank">4</span> 梁伟诚
              </div>
              <div class="static-item">
                <span class="rank">5</span> 叶晓琳
              </div>
            </div>
          </div>

          <div class="vs-divider">
            <div class="vs-circle">VS</div>
          </div>

          <!-- Respondent Column -->
          <div class="result-column res-column">
            <div class="column-bg-decor"></div>
            <div class="column-header">
              <div class="role-badge res">被申请人</div>
              <div class="party-full-name">深圳市南山区创新投资合伙企业（有限合伙）</div>
              <h4>提交排序</h4>
            </div>
            <div class="sort-list-static">
              <div class="static-item first">
                <div class="rank-num">1</div>
                <div class="card-full-v3">
                   <div class="v3-head">
                     <div class="v3-avatar">叶</div>
                     <div class="v3-main">
                       <div class="v3-name">叶晓琳</div>
                       <div class="v3-tags">
                        <el-tag size="small" effect="plain">知识产权</el-tag>
                        <el-tag size="small" effect="plain">技术合同</el-tag>
                       </div>
                     </div>
                   </div>
                   <div class="v3-body">
                     <div class="v3-info">
                      <span>女</span> | <span>硕士</span>
                     </div>
                   </div>
                </div>
                <div class="crown-icon"><el-icon><Trophy /></el-icon></div>
              </div>
              <div class="static-item">
                <span class="rank">2</span> 梁伟诚
              </div>
              <div class="static-item">
                <span class="rank">3</span> 林志远
              </div>
              <div class="static-item">
                <span class="rank">4</span> 郭建国
              </div>
              <div class="static-item">
                <span class="rank">5</span> 陈雅芳
              </div>
            </div>
          </div>

          <div class="arrow-divider">
            <el-icon size="32" color="#909399"><Right /></el-icon>
          </div>

          <!-- Result Column -->
          <div class="result-column system-column">
            <div class="column-bg-decor"></div>
            <div class="column-header">
              <div class="role-badge system">系统判定</div>
              <h4>匹配结果</h4>
            </div>
            
            <!-- Inconsistent State (Demo) -->
            <div class="match-result-box warning">
              <div class="warning-circle">
                <el-icon :size="40"><WarningFilled /></el-icon>
              </div>
              <div class="match-name">排序不一致</div>
              <div class="conflict-detail">
                <div class="conflict-item">申：陈雅芳 (1)</div>
                <div class="conflict-item">被：叶晓琳 (1)</div>
              </div>
              <p class="match-desc">双方首选未达成一致，且未在规定期限内达成补充协议。<br>需报请主任进行最终指定。</p>
              <div class="action-box">
                <el-button type="primary" size="large" class="director-btn white-text-btn" @click="handleConflict">
                  报请主任指定 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Close, Right, Loading, Cpu, List, Histogram, Checked, WarningFilled, Trophy, ArrowRight } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'
import { ElMessage } from 'element-plus'

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

const handleConflict = () => {
  ElMessage.success('已生成报告，即将进入主任指定环节')
  setTimeout(() => {
    setActiveNode(11) // Go to Director Designate Node
  }, 1000)
}
</script>

<style scoped>
.node-content {
  padding: 0 24px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.node-card {
  border-radius: 16px;
  overflow: hidden;
  border: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

/* Algorithm Loading Styles */
.algo-loading-container {
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8fafc;
}

.radar-scan {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 1px solid #e2e8f0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  margin-bottom: 40px;
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.1);
}

.central-chip {
  color: var(--arb-primary);
  z-index: 2;
}

.radar-beam {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2px;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.5), transparent);
  transform-origin: 0 0;
  animation: radar-spin 2s linear infinite;
  z-index: 1;
}

.radar-circle {
  position: absolute;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
}

.c1 { width: 100%; height: 100%; animation: pulse 2s infinite; }
.c2 { width: 70%; height: 70%; animation: pulse 2s infinite 0.5s; }
.c3 { width: 40%; height: 40%; animation: pulse 2s infinite 1s; }

@keyframes radar-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(0.9); opacity: 0.5; }
  50% { transform: scale(1.05); opacity: 0.2; }
  100% { transform: scale(0.9); opacity: 0.5; }
}

.loading-status {
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.loading-title {
  font-size: 20px;
  color: #1e293b;
  margin-bottom: 24px;
}

.loading-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
  position: relative;
}

.step-item {
  font-size: 14px;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.step-item.active { color: var(--arb-primary); font-weight: 600; }
.step-item.done { color: #10b981; }

.algo-progress {
  margin-top: 20px;
}

/* Result Box */
.calculation-box {
  padding: 24px;
}

.preview-result {
  display: flex;
  gap: 24px;
  align-items: stretch;
}

.result-column {
  flex: 1;
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.column-bg-decor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(180deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%);
}

.column-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.role-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.role-badge.app { background: #eff6ff; color: #3b82f6; }
.role-badge.res { background: #f0fdf4; color: #22c55e; }
.role-badge.system { background: #fdf4ff; color: #d946ef; }

.party-full-name {
  font-size: 13px;
  color: #475569;
  margin-bottom: 8px;
  font-weight: 500;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.3;
}

.column-header h4 {
  margin: 0;
  font-size: 16px;
  color: #1e293b;
}

.sort-list-static {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.static-item {
  background: white;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-size: 14px;
}

.static-item.first {
  background: linear-gradient(135deg, #fff 0%, #fefce8 100%);
  border: 1px solid #fef08a;
  padding: 16px;
}

.rank-num {
  width: 24px;
  height: 24px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.static-item.first .rank-num {
  background: #facc15;
  color: white;
  box-shadow: 0 2px 4px rgba(250, 204, 21, 0.4);
}

/* Card Full V3 (Rank 1) */
.card-full-v3 {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.v3-head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.v3-avatar {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.v3-main {
  flex: 1;
}

.v3-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.v3-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.v3-body {
  border-top: 1px dashed #e2e8f0;
  padding-top: 8px;
}

.v3-info {
  font-size: 12px;
  color: #64748b;
}

.crown-icon {
  color: #facc15;
  font-size: 24px;
  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
}

.vs-divider {
  display: flex;
  align-items: center;
  padding: 0 12px;
}

.vs-circle {
  width: 40px;
  height: 40px;
  background: #e2e8f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #94a3b8;
  font-style: italic;
}

.arrow-divider {
  display: flex;
  align-items: center;
  color: #cbd5e1;
  padding: 0 12px;
}

.match-result-box {
  background: white;
  border-radius: 12px;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}

.match-result-box.warning {
  background: linear-gradient(180deg, #fff 0%, #fff7ed 100%);
  border: 1px solid #fed7aa;
}

.warning-circle {
  width: 64px;
  height: 64px;
  background: #ffedd5;
  color: #f97316;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.match-name {
  font-size: 20px;
  font-weight: 700;
  color: #9a3412;
  margin-bottom: 16px;
}

.conflict-detail {
  background: rgba(255, 255, 255, 0.6);
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  margin-bottom: 16px;
  font-size: 13px;
  color: #c2410c;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.match-desc {
  font-size: 14px;
  color: #9a3412;
  line-height: 1.6;
  margin-bottom: 24px;
}

.action-box {
  margin-top: auto;
  width: 100%;
}

.director-btn {
  width: 100%;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border: none;
}

.director-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
}

.fade-in {
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
