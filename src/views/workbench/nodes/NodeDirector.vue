<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-content">
        <div class="title-group">
          <h2 class="main-title">主任决策</h2>
        </div>
        <div class="header-actions">
          <el-tag effect="dark" type="warning" class="status-badge">待决策</el-tag>
        </div>
      </div>
    </div>

    <div class="review-layout">
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
                  v-if="person.type === 'orange'"
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
    </div>

    <div class="bento-grid">
      <div class="main-column">
        <div class="path-selection-area">
          <div 
            class="path-card-large"
            :class="{ active: pathType === 'A' }"
            @click="pathType = 'A'"
          >
            <div class="card-glow"></div>
            <div class="card-icon-row">
              <div class="card-icon">
                <el-icon><List /></el-icon>
              </div>
              <span class="card-badge">立案部长建议流程</span>
            </div>
            <div class="card-content">
              <div class="card-title">路径 A · 推荐名单</div>
              <div class="card-desc">生成 5 人推荐名单，由当事人双方进行排序选定，体现当事人意思自治。</div>
            </div>
            <div class="selection-indicator">
              <el-icon><Check /></el-icon>
            </div>
          </div>

          <div 
            class="path-card-large"
            :class="{ active: pathType === 'B' }"
            @click="pathType = 'B'"
          >
            <div class="card-glow"></div>
            <div class="card-icon">
              <el-icon><UserFilled /></el-icon>
            </div>
            <div class="card-content">
              <div class="card-title">路径 B · 直接指定</div>
              <div class="card-desc">主任直接指定首席仲裁员，适用于简易程序或特殊情形，效率最高。</div>
            </div>
            <div class="selection-indicator">
              <el-icon><Check /></el-icon>
            </div>
          </div>
        </div>

        <transition name="el-zoom-in-top">
          <div v-if="pathType === 'A'" class="path-content-wrapper">
            <div class="candidates-panel">
              <div class="panel-header">
                <h3><el-icon><Trophy /></el-icon> 系统推荐名单 ({{ candidates.length }}/5)</h3>
                <el-button link type="primary" @click="showMoreDialog = true">
                  <el-icon><Search /></el-icon> 浏览完整名册
                </el-button>
              </div>

              <div class="candidates-grid">
                <div 
                  v-for="i in 5" 
                  :key="i"
                  class="candidate-slot"
                  :class="{ filled: candidates[i-1] }"
                  @click="!candidates[i-1] && (showMoreDialog = true)"
                >
                  <template v-if="candidates[i-1]">
                    <div class="slot-content">
                      <div class="c-avatar-large">
                        {{ candidates[i-1].name.charAt(0) }}
                      </div>
                      <div class="c-details">
                        <div class="c-name">{{ candidates[i-1].name }}</div>
                        <div class="c-tags">
                          <span class="tag-pill">{{ candidates[i-1].education }}</span>
                          <span class="tag-pill">{{ candidates[i-1].gender }}</span>
                        </div>
                      </div>
                      <div class="c-domains">
                        <span v-for="d in candidates[i-1].domains" :key="d">{{ d }}</span>
                      </div>
                      <el-button class="remove-icon-btn" link type="danger" @click.stop="removeCandidate(candidates[i-1].name)">
                        <el-icon><Close /></el-icon>
                      </el-button>
                    </div>
                  </template>
                  <template v-else>
                    <div class="slot-empty">
                      <div class="plus-circle">
                        <el-icon><Plus /></el-icon>
                      </div>
                      <span class="empty-text">席位 {{ i }}</span>
                    </div>
                  </template>
                </div>
              </div>

              <div class="submit-section">
                <el-button type="primary" size="large" class="submit-main-btn" @click="submit" :disabled="candidates.length < 5">
                  确认推荐名单
                </el-button>
              </div>
            </div>
          </div>
        </transition>

        <transition name="el-zoom-in-top">
          <div v-if="pathType === 'B'" class="path-content-wrapper">
            <div class="direct-appoint-panel glass-panel">
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
                  v-for="arb in arbitratorList" 
                  :key="arb.name" 
                  class="dialog-card"
                  :class="{ selected: candidates.some(c => c.name === arb.name) }"
                >
                  <div class="d-header">
                    <div class="d-avatar">{{ arb.name.charAt(0) }}</div>
                    <div class="d-info">
                      <div class="d-name">{{ arb.name }}</div>
                      <div class="d-meta">{{ arb.education }} · {{ arb.gender }}</div>
                    </div>
                    <el-button 
                      v-if="!candidates.some(c => c.name === arb.name)"
                      circle type="primary" size="small" 
                      @click="addFromDialog(arb)"
                    ><el-icon><Plus /></el-icon></el-button>
                    <el-button v-else circle type="success" size="small" disabled><el-icon><Check /></el-icon></el-button>
                  </div>
                  <div class="d-tags">
                    <span v-for="tag in arb.domains" :key="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="side-column">
        <div class="info-card-modern oa-timeline-card">
          <div class="card-header">
            <span class="icon-wrapper"><el-icon><Operation /></el-icon></span>
            <span class="title">OA审批流</span>
          </div>
          <div class="oa-timeline">
            <div v-for="(item, index) in oaTimeline" :key="index" class="oa-item">
              <div class="oa-marker"></div>
              <div class="oa-content">
                <div class="oa-title">
                  <span class="oa-role">{{ item.role }}</span>
                  <span class="oa-time">{{ item.time }}</span>
                </div>
                <div class="oa-opinion">{{ item.opinion }}</div>
                <div class="oa-recommend">{{ item.recommendation }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="info-card-modern" v-if="false">
          <div class="card-header">
            <span class="icon-wrapper"><el-icon><Document /></el-icon></span>
            <span class="title">案件概况</span>
          </div>
          <div class="info-grid">
            <div class="info-row">
              <span class="label">案号</span>
              <span class="value">GZCW-2024-001</span>
            </div>
            <div class="info-row">
              <span class="label">标的额</span>
              <span class="value highlight">¥ 5,000,000.00</span>
            </div>
            <div class="info-row">
              <span class="label">类型</span>
              <span class="value">股权转让纠纷</span>
            </div>
            <div class="info-row">
              <span class="label">程序</span>
              <span class="value">普通程序</span>
            </div>
          </div>
        </div>

        <!-- <div class="info-card-modern warning">
          <div class="card-header">
            <span class="icon-wrapper warning"><el-icon><Warning /></el-icon></span>
            <span class="title">智能风控</span>
          </div>
          <div class="warning-content">
            <p>检测到当事人一方为外籍（新加坡），请优先推荐具备<strong>涉外仲裁经验</strong>的仲裁员。</p>
          </div>
        </div> -->
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
          v-for="arb in arbitratorList" 
          :key="arb.name" 
          class="dialog-card"
          :class="{ selected: candidates.some(c => c.name === arb.name) }"
        >
          <div class="d-header">
            <div class="d-avatar">{{ arb.name.charAt(0) }}</div>
            <div class="d-info">
              <div class="d-name">{{ arb.name }}</div>
              <div class="d-meta">{{ arb.education }} · {{ arb.gender }}</div>
            </div>
            <el-button 
              v-if="!candidates.some(c => c.name === arb.name)"
              circle type="primary" size="small" 
              @click="addFromDialog(arb)"
            ><el-icon><Plus /></el-icon></el-button>
            <el-button v-else circle type="success" size="small" disabled><el-icon><Check /></el-icon></el-button>
          </div>
          <div class="d-tags">
            <span v-for="tag in arb.domains" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, List, Check, Search, Operation, MagicStick, Trophy, Plus, Close, Document, Warning, RefreshLeft } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'

const { setActiveNode } = useArbitration()

const pathType = ref('A')
const tableData = ref([
  { 
    role: '首席(独任)', 
    candidates: [
      { name: '郭建国', type: 'orange', tags: ['博士', '男', '金融证券'] }
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
const candidates = ref([
  { name: '郭建国', education: '博士', gender: '男', domains: ['金融', '房地产'] },
  { name: '陈雅芳', education: '硕士', gender: '女', domains: ['知识产权'] },
  { name: '林志远', education: '博士', gender: '男', domains: ['建设工程'] },
  { name: '梁伟诚', education: '博士', gender: '男', domains: ['国际贸易'] },
  { name: '叶晓琳', education: '硕士', gender: '女', domains: ['技术合同'] }
])
const showMoreDialog = ref(false)
const oaTimeline = [
  {
    role: '呈批人 · 秘书',
    time: '2025-11-27 15:31:07',
    opinion: '提交',
    recommendation: '申请人未选定首席仲裁员，选定齐华修（君安世纪（台州））为仲裁员；被申请人未选定首席仲裁员，未选定仲裁员。'
  },
  {
    role: '审批人 · 部门负责人',
    time: '2025-11-27 16:10:24',
    opinion: '同意推进',
    recommendation: '建议主任优先采用推荐名单路径，结合当事人选定结果进行校验。'
  },
  {
    role: '审批人 · 分管委领导',
    time: '2025-11-27 17:05:12',
    opinion: '通过',
    recommendation: '同意，必要时补充涉外经验仲裁员。'
  }
]

// Dialog Filters
const searchQuery = ref('')
const filterDomain = ref('')
const filterEducation = ref('')

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

const generateList = () => {
  candidates.value = [
    { name: '郭建国', education: '博士', gender: '男', domains: ['金融', '房地产'] },
    { name: '陈雅芳', education: '硕士', gender: '女', domains: ['知识产权'] },
    { name: '林志远', education: '博士', gender: '男', domains: ['建设工程'] },
    { name: '梁伟诚', education: '博士', gender: '男', domains: ['国际贸易'] },
    { name: '叶晓琳', education: '硕士', gender: '女', domains: ['技术合同'] }
  ]
  ElMessage.success('系统已智能匹配 5 位推荐候选人')
}

const removeCandidate = (name) => {
  candidates.value = candidates.value.filter(c => c.name !== name)
}

const addFromDialog = (row) => {
  if (candidates.value.length >= 5) {
     ElMessage.warning('最多只能提名5位候选人')
     return
  }
  if (!candidates.value.some(c => c.name === row.name)) {
    candidates.value.push({
      name: row.name,
      education: row.education || '博士',
      gender: row.gender || '男',
      domains: row.domains || ['综合']
    })
    ElMessage.success(`已添加 ${row.name}`)
  }
}

const handleSearch = () => {
  ElMessage.info('查询已更新')
}

const openSwitchDialog = () => {
  showMoreDialog.value = true
}

const submit = () => {
  ElMessage.success('决策已提交，流程流转至：确认推荐名单')
  setTimeout(() => {
    setActiveNode(8) // Go to Distribute Node (Node 8)
  }, 1000)
}
</script>

<style scoped>
.node-workspace {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
.workspace-header {
  margin-bottom: 48px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  padding-bottom: 24px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.subtitle {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--arb-primary);
  opacity: 0.6;
  font-weight: 700;
  margin-bottom: 8px;
}
.main-title {
  font-family: var(--arb-font-serif);
  font-size: 36px;
  color: var(--arb-text-primary);
  margin: 0;
  line-height: 1.2;
}
.status-badge {
  font-size: 13px;
  padding: 16px 24px;
  border-radius: 30px;
}
.bento-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 40px;
  align-items: start;
}
.review-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 32px;
}
.review-layout .left-panel {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
}
.review-layout .panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.review-layout .panel-header h3 { margin: 0; font-size: 18px; color: var(--arb-text-primary); }
.review-layout .legend-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.review-layout .legend-item {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--arb-text-secondary);
}
.review-layout .legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.review-layout .legend-item.blue .dot { background: #409eff; }
.review-layout .legend-item.green .dot { background: #67c23a; }
.review-layout .legend-item.orange .dot { background: #e6a23c; }
.review-layout .legend-item.red .dot { background: #f56c6c; }
.review-layout .candidate-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 8px;
}
.review-layout .role-group-card {
  margin-bottom: 24px;
}
.review-layout .role-badge {
  display: inline-block;
  background: #f8fafc;
  color: var(--arb-text-secondary);
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 12px;
}
.review-layout .candidates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.review-layout .person-card {
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
.review-layout .person-selection-tag {
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
.review-layout .person-card.blue {
  background: linear-gradient(145deg, #ecf5ff 0%, #fff 100%);
  border-color: #d9ecff;
}
.review-layout .person-card.green {
  background: linear-gradient(145deg, #f0f9eb 0%, #fff 100%);
  border-color: #e1f3d8;
}
.review-layout .person-card.orange {
  background: linear-gradient(145deg, #fdf6ec 0%, #fff 100%);
  border-color: #f3d19e;
}
.review-layout .person-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
}
.review-layout .person-avatar {
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
.review-layout .person-card.blue .person-avatar { background: linear-gradient(135deg, #409eff, #79bbff); }
.review-layout .person-card.green .person-avatar { background: linear-gradient(135deg, #67c23a, #95d475); }
.review-layout .person-card.orange .person-avatar { background: linear-gradient(135deg, #e6a23c, #f3d19e); }
.review-layout .person-info { flex: 1; }
.review-layout .person-name {
  font-weight: 600;
  color: var(--arb-text-main);
  margin-bottom: 8px;
  font-size: 16px;
}
.review-layout .person-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.review-layout .person-tags .tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(255,255,255,0.8);
  color: var(--arb-text-secondary);
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
}
.review-layout .person-switch-btn {
  flex-shrink: 0;
}
.main-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.side-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.path-selection-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.path-card-large {
  background: white;
  border-radius: 24px;
  padding: 32px;
  position: relative;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}
.path-card-large:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
.path-card-large.active {
  border-color: var(--arb-primary);
  background: linear-gradient(145deg, #fff, #f8fafc);
}
.path-card-large.active .card-glow {
  opacity: 1;
}
.card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--arb-primary), var(--arb-gold));
  opacity: 0;
  transition: opacity 0.3s;
}
.card-icon {
  width: 56px;
  height: 56px;
  background: #f1f5f9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #64748b;
  margin-bottom: 24px;
  transition: all 0.3s;
}
.card-icon-row {
  display: flex;
  align-items: start;
  gap: 12px;
  margin-bottom: 24px;
}
.card-icon-row .card-icon {
  margin-bottom: 0;
}
.card-badge {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  border: 1px solid #fed7aa;
  white-space: nowrap;
}
.path-card-large.active .card-icon {
  background: var(--arb-primary);
  color: white;
}
.card-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--arb-text-primary);
  margin-bottom: 8px;
}
.card-desc {
  font-size: 14px;
  color: var(--arb-text-secondary);
  line-height: 1.6;
}
.selection-indicator {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--arb-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s;
}
.path-card-large.active .selection-indicator {
  opacity: 1;
  transform: scale(1);
}

.glass-panel {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.02);
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.panel-header h3 {
  font-size: 18px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--arb-text-primary);
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 24px;
  align-items: end;
}
.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.label {
  font-size: 12px;
  font-weight: 600;
  color: var(--arb-text-secondary);
  text-transform: uppercase;
}
.generate-btn {
  height: 40px;
  padding: 0 24px;
  font-weight: 600;
}

.candidates-panel {
  margin-top: 32px;
}
.candidates-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}
.candidate-slot {
  aspect-ratio: 3/4;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8fafc;
}
.candidate-slot:hover {
  border-color: var(--arb-primary);
  background: #f1f5f9;
}
.candidate-slot.filled {
  border: none;
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}
.slot-empty {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  gap: 12px;
}
.plus-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}
.slot-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
}
.c-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: var(--arb-primary);
  margin-bottom: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.c-name {
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}
.c-tags {
  display: flex;
  gap: 4px;
  justify-content: center;
  margin-bottom: 12px;
}
.tag-pill {
  font-size: 10px;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 10px;
  color: #64748b;
}
.c-domains {
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
}
.remove-icon-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}
.candidate-slot:hover .remove-icon-btn {
  opacity: 1;
}

.direct-appoint-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 400px;
}
.empty-state-large {
  text-align: center;
  max-width: 400px;
}
.icon-bg {
  width: 80px;
  height: 80px;
  background: #eff6ff;
  border-radius: 50%;
  color: var(--arb-primary);
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.info-card-modern {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0,0,0,0.02);
}
.oa-timeline-card .card-header {
  margin-bottom: 16px;
}
.oa-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 14px;
}
.oa-timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: #e2e8f0;
}
.oa-item {
  position: relative;
  display: flex;
  gap: 12px;
}
.oa-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--arb-primary);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  margin-top: 6px;
  flex-shrink: 0;
}
.oa-content {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
}
.oa-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}
.oa-role {
  font-size: 13px;
  font-weight: 700;
  color: var(--arb-text-primary);
}
.oa-time {
  font-size: 12px;
  color: var(--arb-text-secondary);
}
.oa-opinion {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
}
.oa-recommend {
  font-size: 12px;
  color: var(--arb-text-secondary);
  line-height: 1.6;
}
.info-card-modern.warning {
  background: #fffafa;
  border: 1px solid #fee2e2;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.icon-wrapper {
  width: 32px;
  height: 32px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
}
.icon-wrapper.warning {
  background: #fee2e2;
  color: #ef4444;
}
.title {
  font-weight: 700;
  color: #1e293b;
}
.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
}
.value {
  font-weight: 600;
  color: #334155;
}
.value.highlight {
  color: var(--arb-primary);
  font-family: var(--arb-font-mono);
}
.warning-content {
  font-size: 13px;
  color: #7f1d1d;
  line-height: 1.6;
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
}
.d-tags span {
  font-size: 11px;
  background: #f8fafc;
  padding: 2px 8px;
  border-radius: 4px;
  color: #64748b;
}
.submit-main-btn {
  width: 100%;
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
