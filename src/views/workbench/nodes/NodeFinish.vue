<template>
  <div class="node-content">
    <div class="finish-container animate-fade-in-up">
      
      <!-- Success Header -->
      <div class="success-header">
        <div class="success-icon-box">
          <div class="icon-ring r1"></div>
          <div class="icon-ring r2"></div>
          <el-icon class="main-icon"><SuccessFilled /></el-icon>
        </div>
        <h1 class="success-title">组庭工作圆满完成</h1>
        <p class="success-subtitle">
        </p>
        <div class="parties-info-box">
           <div class="p-item"><strong>申请人：</strong>广州市天河区高新科技发展有限公司</div>
           <div class="p-divider">|</div>
           <div class="p-item"><strong>被申请人：</strong>深圳市南山区创新投资合伙企业（有限合伙）</div>
        </div>
      </div>

      <!-- Tribunal Formation Card -->
      <div class="tribunal-card">
        <div class="card-bg-decor"></div>
        <div class="card-title">
          <span class="decor-line"></span>
          仲裁庭组成人员
          <span class="decor-line"></span>
        </div>

        <div class="members-stage">
          <!-- Arbitrator Left -->
          <div class="member-box side">
            <div class="member-avatar">
              <span class="avatar-text">林</span>
              <div class="role-tag">边裁 (申)</div>
            </div>
            <div class="member-name">林志远</div>
            <div class="member-desc">申请人选定</div>
          </div>

          <!-- Chief Arbitrator -->
          <div class="member-box chief">
            <div class="crown-decoration">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="member-avatar">
              <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
              <div class="role-tag chief-tag">首席仲裁员</div>
            </div>
            <div class="member-name">郭建国</div>
            <div class="member-desc">主任指定</div>
          </div>

          <!-- Arbitrator Right -->
          <div class="member-box side">
            <div class="member-avatar">
              <span class="avatar-text">梁</span>
              <div class="role-tag">边裁 (被)</div>
            </div>
            <div class="member-name">梁伟诚</div>
            <div class="member-desc">被申请人选定</div>
          </div>
        </div>
      </div>

      <!-- Next Actions -->
      <div class="next-actions">
        <div class="action-hint">下一步操作建议</div>
        <div class="action-buttons">
          <el-button type="primary" size="large" class="main-btn" @click="handleNotify">
            <el-icon><Promotion /></el-icon> 一键发送组庭通知
          </el-button>
          <el-button size="large" class="secondary-btn">
            <el-icon><Calendar /></el-icon> 预约首次开庭
          </el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { SuccessFilled, Trophy, Promotion, Calendar } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineProps(['nodeData'])

const handleNotify = () => {
  ElMessage.success({
    message: '组庭通知已发送至双方当事人及仲裁员',
    type: 'success',
    duration: 3000
  })
}
</script>

<style scoped>
.node-content {
  padding: 40px 24px;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}

.finish-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Success Header */
.success-header {
  text-align: center;
  margin-bottom: 48px;
  position: relative;
}

.success-icon-box {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-icon {
  font-size: 64px;
  color: var(--el-color-success);
  position: relative;
  z-index: 2;
  background: white;
  border-radius: 50%;
}

.icon-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid var(--el-color-success);
  opacity: 0.2;
}

.r1 { width: 100%; height: 100%; animation: ripple 2s infinite; }
.r2 { width: 140%; height: 140%; animation: ripple 2s infinite 0.5s; }

@keyframes ripple {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}

.success-title {
  font-size: 28px;
  font-weight: 800;
  color: #303133;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #303133 0%, #606266 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.success-subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

.parties-info-box {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  font-size: 14px;
  color: #606266;
  background: #f4f4f5;
  padding: 8px 24px;
  border-radius: 20px;
}

.p-divider {
  color: #dcdfe6;
}

/* Tribunal Card */
.tribunal-card {
  width: 100%;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px -10px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
  margin-bottom: 48px;
  border: 1px solid rgba(255,255,255,0.5);
}

.card-bg-decor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  background: linear-gradient(180deg, #f0f9eb 0%, rgba(255,255,255,0) 100%);
  z-index: 0;
}

.card-title {
  position: relative;
  z-index: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-success);
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.decor-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--el-color-success));
}
.decor-line:last-child {
  background: linear-gradient(90deg, var(--el-color-success), transparent);
}

.members-stage {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 40px;
}

.member-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.3s;
}

.member-box:hover {
  transform: translateY(-5px);
}

.member-box.chief {
  margin-bottom: 20px;
  transform: scale(1.1);
}

.member-box.chief:hover {
  transform: scale(1.1) translateY(-5px);
}

.member-avatar {
  position: relative;
  margin-bottom: 16px;
}

.side .member-avatar {
  width: 64px;
  height: 64px;
  background: #f5f7fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
}

.avatar-text {
  font-size: 24px;
  font-weight: 700;
  color: #909399;
}

.role-tag {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: #909399;
  color: white;
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 10px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.role-tag.chief-tag {
  background: linear-gradient(135deg, #e6a23c, #f56c6c);
  font-size: 11px;
  padding: 3px 10px;
  bottom: -6px;
}

.crown-decoration {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  color: #e6a23c;
  filter: drop-shadow(0 4px 4px rgba(230, 162, 60, 0.4));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-5px); }
}

.member-name {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 4px;
}

.chief .member-name {
  font-size: 20px;
}

.member-desc {
  font-size: 12px;
  color: #909399;
}

/* Actions */
.next-actions {
  text-align: center;
  width: 100%;
}

.action-hint {
  font-size: 14px;
  color: #909399;
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.main-btn {
  padding: 12px 40px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(103, 194, 58, 0.3);
  font-size: 16px;
}

.secondary-btn {
  padding: 12px 32px;
  font-size: 16px;
}
</style>
