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
              v-for="(roleGroup, roleIndex) in tableData" 
              :key="roleIndex"
              class="role-group-card"
            >
              <div class="role-badge">{{ roleGroup.role }}</div>
              
              <div class="candidates-grid">
                <div 
                  v-for="(person, personIndex) in roleGroup.candidates" 
                  :key="person.name"
                  class="person-card"
                  :class="person.type"
                >
                  <div v-if="person.selectedBy" class="person-selection-tag">
                    {{ person.selectedBy === 'applicant' ? '申请人选定' : '被申请人选定' }}
                  </div>
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
                  <el-button
                    v-if="person.type === 'blue'"
                    circle
                    type="primary"
                    size="small"
                    class="person-switch-btn"
                    @click="openSwitchDialog(roleIndex, personIndex)"
                  ><el-icon><RefreshLeft /></el-icon></el-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：审核操作 -->
        <div class="right-panel" v-if="false">
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
      <div class="audit-card glass-card">
        <div class="audit-header">
          <h3>审核意见</h3>
          <div class="audit-switch">
            <span>推荐名单</span>
            <el-switch v-model="includeRecommendation" />
          </div>
        </div>
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

  <el-dialog
    v-model="showMoreDialog"
    title="仲裁员名册查询"
    width="900px"
    append-to-body
    class="custom-dialog-modern"
  >
    <div class="dialog-search-header">
      <el-input v-model="searchQuery" placeholder="输入姓名搜索..." prefix-icon="Search" class="search-input" />
      <div class="filters">
        <el-select v-model="filterDomain" placeholder="领域" clearable><el-option label="金融" value="finance" /></el-select>
        <el-select v-model="filterEducation" placeholder="学历" clearable><el-option label="博士" value="phd" /></el-select>
      </div>
      <el-button type="primary" @click="handleSearch">查询</el-button>
    </div>

    <div class="dialog-grid">
      <div 
        v-for="arb in displayArbitratorList" 
        :key="arb.name" 
        class="dialog-card"
        :class="{ selected: activeCandidateName === arb.name }"
      >
        <div class="d-header">
          <div class="d-avatar">{{ arb.name.charAt(0) }}</div>
          <div class="d-info">
            <div class="d-name">{{ arb.name }}</div>
            <div class="d-meta">{{ arb.education }} · {{ arb.gender }}</div>
          </div>
          <el-button 
            circle type="primary" size="small" 
            @click="replaceFromDialog(arb)"
          ><el-icon><Select /></el-icon></el-button>
        </div>
        <div class="d-tags">
          <span v-for="tag in arb.domains" :key="tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Select, WarningFilled, Close, Check, RefreshLeft } from '@element-plus/icons-vue'

const comment = ref('同意。')
const includeRecommendation = ref(false)
const recommendationText = '建议主任采用推荐5人名单形式选择首席仲裁员'

const tableData = ref([
  { 
    role: '首席(独任)', 
    candidates: [
      { name: '郭建国', type: 'blue', tags: ['博士', '男', '金融证券'] },
      // { name: '林志远', type: 'green', tags: ['学士', '男', '建设工程'], selectedBy: 'applicant' },
      // { name: '梁伟诚', type: 'green', tags: ['硕士', '男', '国际贸易'], selectedBy: 'respondent' }
      
      // { name: '陈雅芳', type: 'green', tags: ['硕士', '女', '公司法'] }  // Party Selected
    ]
  },
  { 
    role: '仲裁员(边裁)', 
    candidates: [
      { name: '林志远', type: 'green', tags: ['学士', '男', '建设工程'], selectedBy: 'applicant' }
    ]
  },
  { 
    role: '仲裁员(边裁)', 
    candidates: [
      { name: '梁伟诚', type: 'green', tags: ['硕士', '男', '国际贸易'], selectedBy: 'respondent' }
    ]
  }
])

const showMoreDialog = ref(false)
const searchQuery = ref('')
const filterDomain = ref('')
const filterEducation = ref('')
const activeTarget = ref(null)
const activeCandidateName = ref('')

const arbitratorList = [
  { name: '梁伟诚', education: '博士', gender: '男', domains: ['国际贸易', '投资'] },
  { name: '叶晓琳', education: '硕士', gender: '女', domains: ['知识产权', '技术'] },
  { name: '冯德昌', education: '博士', gender: '男', domains: ['海商法'] },
  { name: '孟淑华', education: '博士', gender: '女', domains: ['金融', '证券'] },
  { name: '魏东海', education: '硕士', gender: '男', domains: ['房地产'] },
  { name: '张明远', education: '博士', gender: '男', domains: ['房地产', '金融'] },
  { name: '王建国', education: '硕士', gender: '男', domains: ['房地产', '证券'] },
  { name: '李慧琳', education: '博士', gender: '女', domains: ['知识产权', '国贸'] }
]

const displayArbitratorList = computed(() => {
  const query = searchQuery.value.trim()
  const domainMap = { finance: '金融' }
  const educationMap = { phd: '博士' }
  const domainFilter = filterDomain.value ? (domainMap[filterDomain.value] || filterDomain.value) : ''
  const educationFilter = filterEducation.value ? (educationMap[filterEducation.value] || filterEducation.value) : ''

  return arbitratorList.filter((arb) => {
    const matchName = !query || arb.name.includes(query)
    const matchDomain = !domainFilter || (arb.domains || []).includes(domainFilter)
    const matchEducation = !educationFilter || arb.education === educationFilter
    return matchName && matchDomain && matchEducation
  })
})

const openSwitchDialog = (roleIndex, personIndex) => {
  activeTarget.value = { roleIndex, personIndex }
  activeCandidateName.value = tableData.value[roleIndex].candidates[personIndex]?.name || ''
  showMoreDialog.value = true
}

const buildTags = (arb) => {
  const baseTags = [arb.education || '博士', arb.gender || '男']
  const domainTags = arb.domains && arb.domains.length ? arb.domains : ['综合']
  return [...baseTags, ...domainTags]
}

const replaceFromDialog = (arb) => {
  if (!activeTarget.value) return
  const { roleIndex, personIndex } = activeTarget.value
  const target = tableData.value[roleIndex]?.candidates?.[personIndex]
  if (!target) return
  target.name = arb.name
  target.tags = buildTags(arb)
  activeCandidateName.value = arb.name
  showMoreDialog.value = false
  ElMessage.success(`已切换为 ${arb.name}`)
}

const handleSearch = () => {
  ElMessage.info('查询已更新')
}

const promptDirector = () => {
  ElMessage.success('已发送提示给主任：建议使用推荐名单路径。')
}

const submit = () => {
  ElMessage.success('审核完成，流程流转至主任端。')
}

const removeRecommendationLine = (value) => {
  return value
    .split('\n')
    .filter((line) => line.trim() !== recommendationText)
    .join('\n')
    .trim()
}

watch(includeRecommendation, (enabled) => {
  if (enabled) {
    if (!comment.value.includes(recommendationText)) {
      comment.value = comment.value ? `${comment.value}\n${recommendationText}` : recommendationText
    }
    return
  }
  if (comment.value.includes(recommendationText)) {
    comment.value = removeRecommendationLine(comment.value)
  }
})
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
  grid-template-columns: 1fr;
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

.candidate-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 8px;
}
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

.person-selection-tag {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--arb-text-secondary);
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
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

.person-switch-btn {
  flex-shrink: 0;
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
  margin-top: 16px;
}

.audit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  gap: 12px;
}

.audit-card h3 { margin: 0; font-size: 16px; }

.audit-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--arb-text-secondary);
  font-size: 13px;
}

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

.dialog-search-header {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 220px;
}

.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dialog-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.dialog-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-card.selected {
  border-color: #409eff;
  background: #f5faff;
}

.d-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.d-avatar {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.d-info {
  flex: 1;
}

.d-name {
  font-weight: 700;
  color: #1e293b;
}

.d-meta {
  font-size: 12px;
  color: #64748b;
}

.d-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.d-tags span {
  font-size: 11px;
  background: #f8fafc;
  padding: 2px 8px;
  border-radius: 4px;
  color: #64748b;
}
</style>
