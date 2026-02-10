<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-left">
        <h2>主任生成并发送名单</h2>
        <span class="subtitle">系统已自动生成推荐名单并发送至当事人</span>
      </div>
    </div>

    <div class="distribute-container animate-fade-in-up">
      <!-- Status Banner -->
      <div class="status-banner draft">
        <div class="banner-icon">
          <el-icon><Promotion /></el-icon>
        </div>
        <div class="banner-content">
          <div class="banner-title">确认推荐名单并发送</div>
          <div class="banner-desc">
            请确认以下 5 位仲裁员推荐名单，系统将发送至双方当事人进行排序。
            <br><strong>申请人：</strong>广州市天河区高新科技发展有限公司
            <br><strong>被申请人：</strong>深圳市南山区创新投资合伙企业（有限合伙）
          </div>
        </div>
        <div class="banner-action">
          <el-button type="primary" size="large" @click="handleSend">
            确认并发送 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- Candidates Grid -->
      <div class="section-title">
        <span class="decor"></span>
        推荐名单预览 (5人)
      </div>
      
      <div class="candidates-scroll-container">
        <div class="candidates-row">
          <div 
            v-for="(candidate, index) in recommendList" 
            :key="candidate.id"
            class="card-full-v3"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="v3-head">
              <div class="v3-avatar">{{ candidate.name.charAt(0) }}</div>
              <div class="v3-main">
                <div class="v3-name">{{ candidate.name }}</div>
                <div class="v3-tags">
                  <el-tag size="small" effect="light">系统推荐</el-tag>
                  <el-tag v-for="tag in candidate.specialties" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                </div>
              </div>
            </div>
            
            <div class="v3-body">
              <div class="v3-info">
                <span>{{ candidate.gender || '男' }}</span> | <span>{{ candidate.education || '博士' }}</span> | <span>办案 {{ candidate.cases }}件</span>
              </div>
              <div class="v3-rate">
                 <span class="rate-label">结案率</span>
                 <span class="rate-val">{{ candidate.rate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { Check, Loading, Promotion, ArrowRight, Select, Message, View, More } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'
import { ElMessage } from 'element-plus'

defineProps(['nodeData'])

const recommendList = reactive([
  { 
    id: 'A001', 
    name: '郭建国', 
    specialties: ['金融', '股权转让'],
    cases: 45,
    rate: 98,
    gender: '男',
    education: '博士'
  },
  { 
    id: 'A002', 
    name: '陈雅芳', 
    specialties: ['公司法', '合同法'],
    cases: 32,
    rate: 100,
    gender: '女',
    education: '硕士'
  },
  { 
    id: 'A003', 
    name: '林志远', 
    specialties: ['民商事', '争议解决'],
    cases: 56,
    rate: 95,
    gender: '男',
    education: '博士'
  },
  { 
    id: 'A004', 
    name: '梁伟诚', 
    specialties: ['国际贸易', '投资'],
    cases: 28,
    rate: 92,
    gender: '男',
    education: '博士'
  },
  { 
    id: 'A005', 
    name: '叶晓琳', 
    specialties: ['知识产权', '技术合同'],
    cases: 19,
    rate: 96,
    gender: '女',
    education: '硕士'
  }
])

const { setActiveNode } = useArbitration()

const handleSend = () => {
  ElMessage.success('推荐名单已发送至当事人')
  setTimeout(() => {
    setActiveNode(9) // Go to Party Sort Node
  }, 1000)
}
</script>

<style scoped>
.node-workspace {
  padding: 24px;
  background: var(--arb-bg-gray);
  min-height: 100%;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-left h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
}

/* Status Banner */
.status-banner {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.status-banner.draft {
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
  border: 1px solid #bae6fd;
}

.banner-icon {
  width: 56px;
  height: 56px;
  background: #22c55e;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
}

.status-banner.draft .banner-icon {
  background: #0ea5e9;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
}

.banner-content {
  flex: 1;
}

.banner-title {
  font-size: 20px;
  font-weight: 700;
  color: #14532d;
  margin-bottom: 8px;
}

.status-banner.draft .banner-title {
  color: #0c4a6e;
}

.banner-desc {
  font-size: 14px;
  color: #166534;
  line-height: 1.6;
}

.status-banner.draft .banner-desc {
  color: #334155;
}

.banner-action {
  flex-shrink: 0;
  padding-left: 20px;
  border-left: 1px solid rgba(0,0,0,0.05);
}

/* Section Title */
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.decor {
  width: 4px;
  height: 16px;
  background: var(--arb-primary);
  border-radius: 2px;
}

/* Candidates Row */
.candidates-scroll-container {
  overflow-x: auto;
  padding-bottom: 24px;
}

.candidates-row {
  display: flex;
  gap: 20px;
  min-width: max-content;
}

/* Card Full V3 (Standardized) */
.card-full-v3 {
  width: 280px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.card-full-v3:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  border-color: var(--arb-primary-light);
}

.v3-head {
  display: flex;
  gap: 12px;
  align-items: center;
}

.v3-avatar {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
}

.v3-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.v3-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.v3-tags {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.v3-body {
  border-top: 1px dashed #e2e8f0;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.v3-info {
  font-size: 13px;
  color: #64748b;
  display: flex;
  gap: 8px;
}

.v3-rate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.rate-label {
  color: #94a3b8;
}

.rate-val {
  font-weight: 600;
  color: var(--arb-primary);
}

.white-text-btn {
  color: #fff !important;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fade-in-up 0.5s ease-out;
}
</style>