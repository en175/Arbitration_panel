<template>
  <div class="node-content animate-fade-in-up">
    <div class="node-card glass-card">
      <div class="card-header-wrapper">
        <div class="card-header">
          <span class="title-large">组庭启动</span>
          <el-tag type="success" effect="dark" round size="large" class="status-tag">已完成</el-tag>
        </div>
        <div class="header-divider"></div>
      </div>
      
      <div class="info-section">
        <!-- Modern Grid Info Layout -->
        <div class="info-grid">
          <div class="info-item">
            <span class="label">案号</span>
            <span class="value value-highlight">穗仲案字[2024]第12345号</span>
          </div>
          <div class="info-item">
            <span class="label">案由</span>
            <span class="value">股权转让纠纷</span>
          </div>
          <div class="info-item">
            <span class="label">标的额</span>
            <span class="value value-money">¥ 5,000,000.00</span>
          </div>
          <div class="info-item">
            <span class="label">适用程序</span>
            <span class="value">普通程序</span>
          </div>
          <div class="info-item">
            <span class="label">拟定庭型</span>
            <span class="value">合议庭</span>
          </div>
          <div class="info-item">
            <span class="label">经办秘书</span>
            <div class="value-user">
              <el-avatar :size="32" class="user-avatar">张</el-avatar>
              <span>张秘书</span>
            </div>
          </div>
        </div>

        <div class="method-card glass-card">
          <div class="method-header">
            <h4 class="arb-section-title">选择组庭方式</h4>
            <div class="method-hint">选择后用于明确后续流程分支</div>
          </div>
          <div class="method-grid">
            <button class="method-item" type="button" @click="selectMethod('joint_agreed')">
              <div class="method-title">当事人双方约定共同选定边裁+首裁</div>
              <div class="method-desc">当事人已达成一致意见，双方共同选定边裁与首裁后进入后续确认/审批。</div>
            </button>
            <button class="method-item" type="button" @click="selectMethod('delegate_arbitrators')">
              <div class="method-title">当事人委托边裁选择首裁</div>
              <div class="method-desc">当事人先选定边裁，由两名边裁在期限内共同选定首裁，无法一致则进入后续处理。</div>
            </button>
            <button class="method-item" type="button" @click="selectMethod('not_agreed')">
              <div class="method-title">当事人未约定一致</div>
              <div class="method-desc">当事人未能形成一致约定，按规则进入边裁选定与首裁产生机制分支。</div>
            </button>
          </div>
        </div>

        <div class="action-log-wrapper">
          <div class="section-header">
            <h4 class="arb-section-title">处理记录</h4>
          </div>
          <el-timeline class="custom-timeline">
            <el-timeline-item timestamp="2024-02-01 10:00" placement="top" type="primary" size="large" hollow>
              <div class="log-card">
                <span class="log-content">秘书确认案件要素无误，发起组庭流程</span>
              </div>
            </el-timeline-item>
            <el-timeline-item timestamp="2024-02-01 09:30" placement="top" color="#E2E8F0" size="large">
              <div class="log-card muted">
                <span class="log-content text-muted">系统自动立案</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['nodeData'])
import { ElMessage } from 'element-plus'
import { useArbitration } from '../composables/useArbitration'

const { setActiveNode, setFormationMethod } = useArbitration()

const selectMethod = (method) => {
  setFormationMethod(method)
  ElMessage.success('组庭方式已选择')
  setActiveNode(2)
}
</script>

<style scoped>
.node-content {
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
}
.node-card {
  padding: 40px;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 10px 30px -5px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.card-header-wrapper {
  margin-bottom: 32px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.title-large {
  font-size: 28px;
  font-weight: 700;
  background: var(--arb-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}
.status-tag {
  font-weight: 600;
  padding: 0 20px;
  height: 32px;
}
.header-divider {
  height: 1px;
  background: linear-gradient(90deg, var(--arb-border) 0%, transparent 100%);
  opacity: 0.6;
}

/* Modern Grid Info Layout */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 14px;
  color: var(--arb-text-secondary);
  font-weight: 500;
}

.value {
  font-size: 18px;
  color: var(--arb-text-main);
  font-weight: 600;
  line-height: 1.4;
}

.value-highlight {
  color: var(--arb-primary);
  font-family: var(--arb-font-mono);
  font-weight: 700;
  font-size: 20px;
}

.value-money {
  font-family: var(--arb-font-mono);
  color: var(--arb-gold);
  font-size: 20px;
}

.value-user {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
}

.user-avatar {
  background: var(--arb-gradient-primary);
  color: white;
  font-weight: 600;
}

.method-card {
  padding: 24px;
  margin: 0 0 28px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.55);
}

.method-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.method-hint {
  font-size: 12px;
  color: var(--arb-text-secondary);
}

.method-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.method-item {
  text-align: left;
  border-radius: 16px;
  padding: 18px 18px 16px;
  border: 1px solid rgba(30, 58, 138, 0.14);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.58));
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.method-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.10);
  border-color: rgba(59, 130, 246, 0.35);
}

.method-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--arb-text-main);
  line-height: 1.35;
  margin-bottom: 8px;
}

.method-desc {
  font-size: 12px;
  line-height: 1.55;
  color: var(--arb-text-secondary);
}

/* Action Log */
.action-log-wrapper {
  padding: 0 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;
  padding-left: 16px;
}

.section-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 4px;
  height: 24px;
  background: var(--arb-primary);
  border-radius: 2px;
  transform: translateY(-50%);
}

.arb-section-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: var(--arb-text-main);
}

.custom-timeline {
  padding-left: 8px;
}

.log-card {
  background: rgba(255, 255, 255, 0.8);
  padding: 16px 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  display: inline-block;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.log-card.muted {
  background: rgba(241, 245, 249, 0.4);
  border: none;
  box-shadow: none;
}

.log-content {
  font-size: 16px;
  color: var(--arb-text-main);
  line-height: 1.5;
}

.text-muted {
  color: var(--arb-text-secondary);
}

/* Responsive adjustment */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  .method-grid {
    grid-template-columns: 1fr;
  }
}
</style>
