<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-content">
        <h2 class="gradient-text">立案部长审核</h2>
        <div class="header-right">
           <div class="status-badge">
             <div class="pulse-dot"></div>
             <span>待审核</span>
           </div>
        </div>
      </div>
    </div>

    <div class="workspace-content">
      <div class="review-layout">
        <!-- 左侧：拟组庭名单 -->
        <div class="left-panel">
          <div class="panel-header">
            <h3>拟组庭人员名单</h3>
            <div class="legend-group">
              <div class="legend-item blue"><span class="dot"></span>系统推荐</div>
              <div class="legend-item green"><span class="dot"></span>当事人选定</div>
              <div class="legend-item orange"><span class="dot"></span>上一级审批人推荐</div>
              <div class="legend-item red"><span class="dot"></span>变更前组庭仲裁员</div>
            </div>
          </div>

          <div class="candidate-list">
            <div 
              v-for="(roleGroup, index) in tableData" 
              :key="index"
              class="role-group-card"
            >
              <div class="role-badge">{{ roleGroup.role }}</div>
              
              <div class="candidates-grid">
                <div 
                  v-for="person in roleGroup.candidates" 
                  :key="person.name"
                  class="person-card"
                  :class="person.type"
                >
                  <div class="person-avatar">
                    {{ person.name.charAt(0) }}
                  </div>
                  <div class="person-info">
                    <div class="person-name">
                      {{ person.name }}
                    </div>
                    <div class="person-tags">
                      <span v-for="tag in person.tags" :key="tag" class="tag">{{ tag }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：审核操作 -->
        <div class="right-panel">
          <!-- 智能检测卡片 -->
          <div class="ai-check-card warning">
            <div class="card-icon">
              <el-icon><WarningFilled /></el-icon>
            </div>
            <div class="card-content">
              <h4>智能检测</h4>
              <p>检测到当事人未能共同选定首席仲裁员。</p>
              <el-button type="warning" size="large" @click="promptDirector" class="action-btn highlight-btn">
                提示主任：提供推荐名单
              </el-button>
            </div>
          </div>

          <!-- 审核表单 -->
          <div class="audit-card glass-card">
            <h3>审核意见</h3>
            <el-input
              v-model="comment"
              type="textarea"
              :rows="4"
              placeholder="请输入审核意见..."
              class="custom-textarea"
            />
            
            <div class="audit-actions">
              <el-button class="reject-btn" plain>
                <el-icon><Close /></el-icon> 退回
              </el-button>
              <el-button type="primary" class="approve-btn" @click="submit">
                <el-icon><Check /></el-icon> 同意并提交
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Select, WarningFilled, Close, Check } from '@element-plus/icons-vue'

const comment = ref('同意。建议转主任进行路径决策。')

const tableData = [
  { 
    role: '首席(独任)', 
    candidates: [
      { name: '郭建国', type: 'blue', tags: ['博士', '男', '金融证券'] }, // System Rec
      { name: '陈雅芳', type: 'green', tags: ['硕士', '女', '公司法'] }  // Party Selected
    ]
  },
  { 
    role: '仲裁员(边裁)', 
    candidates: [
      { name: '林志远', type: 'green', tags: ['学士', '男', '建设工程'] } // Party Selected
    ]
  },
  { 
    role: '仲裁员(边裁)', 
    candidates: [
      { name: '梁伟诚', type: 'green', tags: ['硕士', '男', '国际贸易'] } // Party Selected
    ]
  }
]

const promptDirector = () => {
  ElMessage.success('已发送提示给主任：建议使用推荐名单路径。')
}

const submit = () => {
  ElMessage.success('审核完成，流程流转至主任端。')
}
</script>

<style scoped>
.node-workspace {
  max-width: 1200px;
  margin: 0 auto;
}

.workspace-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.gradient-text {
  font-family: var(--arb-font-serif);
  font-size: 28px;
  margin: 0;
  background: var(--arb-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  font-size: 14px;
  color: var(--arb-primary);
  font-weight: 600;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #f56c6c;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(245, 108, 108, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 108, 108, 0); }
}

.review-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

/* Left Panel */
.left-panel {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.panel-header h3 { margin: 0; font-size: 18px; color: var(--arb-text-primary); }

.legend-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--arb-text-secondary);
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-item.blue .dot { background: #409eff; }
.legend-item.green .dot { background: #67c23a; }
.legend-item.orange .dot { background: #e6a23c; }
.legend-item.red .dot { background: #f56c6c; }

.role-group-card {
  margin-bottom: 24px;
}

.role-badge {
  display: inline-block;
  background: #f8fafc;
  color: var(--arb-text-secondary);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 12px;
}

.candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.person-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.person-card.blue {
  background: linear-gradient(145deg, #ecf5ff 0%, #fff 100%);
  border-color: #d9ecff;
}

.person-card.green {
  background: linear-gradient(145deg, #f0f9eb 0%, #fff 100%);
  border-color: #e1f3d8;
}

.person-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
}

.person-avatar {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.person-card.blue .person-avatar { background: linear-gradient(135deg, #409eff, #79bbff); }
.person-card.green .person-avatar { background: linear-gradient(135deg, #67c23a, #95d475); }

.person-info { flex: 1; }

.person-name {
  font-weight: 600;
  color: var(--arb-text-main);
  margin-bottom: 8px;
  font-size: 16px;
}

.person-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.person-tags .tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255,255,255,0.8);
  color: var(--arb-text-secondary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}

/* Right Panel */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.ai-check-card {
  background: #fdf6ec;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  border: 1px solid #faecd8;
}

.ai-check-card .card-icon {
  width: 56px;
  height: 56px;
  background: rgba(230, 162, 60, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #e6a23c;
  font-size: 28px;
}

.ai-check-card h4 { margin: 0; color: #e6a23c; font-size: 18px; font-weight: 600; }
.ai-check-card p { margin: 0; color: #909399; font-size: 14px; line-height: 1.5; }

.action-btn { width: 100%; border-radius: 8px; font-weight: 600; }
.highlight-btn {
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
  transition: all 0.3s;
}
.highlight-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(230, 162, 60, 0.4);
}

.audit-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  flex: 1;
}

.audit-card h3 { margin: 0 0 16px 0; font-size: 16px; }

.custom-textarea :deep(.el-textarea__inner) {
  background: #f8fafc;
  border: none;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
}

.audit-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.reject-btn, .approve-btn {
  flex: 1;
  height: 44px;
  border-radius: 12px;
  font-size: 15px;
}

.approve-btn {
  background: var(--arb-gradient-primary);
  border: none;
}
</style>