<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2>主任最终指定</h2>
      <div class="header-actions">
        <!-- Removed Dispute Resolution Tag -->
      </div>
    </div>

    <div class="designate-container">
      <div class="list-section">
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
            v-for="(roleGroup, roleIndex) in displayTableData"
            :key="roleIndex"
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
                <div v-if="person.selected" class="person-selected-tag">已选定</div>
                <div v-else-if="person.selectedBy" class="person-selection-tag">
                  {{ person.selectedBy === 'applicant' ? '申请人选定' : '被申请人选定' }}
                </div>
                <div class="person-avatar">
                  {{ person.name.charAt(0) }}
                </div>
                <div class="person-info">
                  <div class="person-name">{{ person.name }}</div>
                  <div class="person-tags">
                    <span v-for="tag in person.tags" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="main-content-grid">
        <div class="roster-column">
          <div class="roster-card">
            <div class="section-label">
              <el-icon><Histogram /></el-icon> 仲裁员名册
            </div>
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
                    circle
                    type="primary"
                    size="small"
                    @click="selectArbitrator(arb)"
                  ><el-icon><Select /></el-icon></el-button>
                </div>
                <div class="d-tags">
                  <span v-for="tag in arb.domains" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="confirm-row">
            <el-button type="primary" size="large" class="confirm-btn white-text-btn" @click="handleConfirm">
              确认指定并签发
            </el-button>
          </div>
        </div>

        <div class="timeline-column">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Histogram, Operation, Select } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useArbitration } from '../composables/useArbitration'

const { setActiveNode } = useArbitration()

const tableData = ref([
  {
    role: '首席(独任)',
    candidates: [
      { name: '郭建国', type: 'blue', tags: ['博士', '男', '金融证券'], selected: true }
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

const searchQuery = ref('')
const filterDomain = ref('')
const filterEducation = ref('')
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

const displayTableData = computed(() => {
  return tableData.value.map((roleGroup, index) => {
    if (index !== 0) {
      return roleGroup
    }

    if (!activeCandidateName.value) {
      return {
        ...roleGroup,
        candidates: [
          { name: '待选定', type: 'blue', tags: [] }
        ]
      }
    }

    const arb = arbitratorList.find((item) => item.name === activeCandidateName.value)
    const tags = arb ? [arb.education, arb.gender, ...(arb.domains || [])] : []

    return {
      ...roleGroup,
      candidates: [
        { name: activeCandidateName.value, type: 'blue', tags, selected: true }
      ]
    }
  })
})

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
  },
  {
    role: '当事人',
    time: '2025-11-27 17:12:45',
    opinion: '',
    recommendation: '排序不一致，需主任指定。'
  }
]

const selectArbitrator = (arb) => {
  activeCandidateName.value = arb.name
}

const handleSearch = () => {
  ElMessage.info('查询已更新')
}

const handleConfirm = () => {
  if (!activeCandidateName.value) {
    ElMessage.warning('请先在名册中选定仲裁员')
    return
  }

  ElMessageBox.confirm(
    `确定指定 ${activeCandidateName.value} 为本案首席仲裁员吗？此操作不可撤销。`,
    '最终指定确认',
    {
      confirmButtonText: '确定指定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    ElMessage.success('指定成功，已生成组庭通知书')
    setTimeout(() => {
      setActiveNode(12)
    }, 1000)
  })
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

.workspace-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.designate-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
}

.list-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--arb-text-primary);
}

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

.person-selection-tag,
.person-selected-tag {
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

.person-selected-tag {
  background: #e0f2fe;
  color: #0369a1;
}

.person-card.blue {
  background: linear-gradient(145deg, #ecf5ff 0%, #fff 100%);
  border-color: #d9ecff;
}

.person-card.green {
  background: linear-gradient(145deg, #f0f9eb 0%, #fff 100%);
  border-color: #e1f3d8;
}

.person-card.orange {
  background: linear-gradient(145deg, #fdf6ec 0%, #fff 100%);
  border-color: #faecd8;
}

.person-card.red {
  background: linear-gradient(145deg, #fef2f2 0%, #fff 100%);
  border-color: #fee2e2;
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
.person-card.orange .person-avatar { background: linear-gradient(135deg, #e6a23c, #f3d19e); }
.person-card.red .person-avatar { background: linear-gradient(135deg, #f56c6c, #fca5a5); }

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

.roster-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.title {
  font-weight: 700;
  color: #1e293b;
}

.confirm-row {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.confirm-btn {
  width: 320px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.white-text-btn {
  color: #fff !important;
}
</style>
