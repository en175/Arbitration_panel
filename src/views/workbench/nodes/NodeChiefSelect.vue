<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-left">
        <h2 class="gradient-text">边裁共同选定首席仲裁员</h2>
        <span class="subtitle">边裁一已提交首席人选，边裁二可在名册中选择</span>
      </div>
      <div class="header-right">
        <div class="status-badge">
          <div class="pulse-dot"></div>
          <span>待选定</span>
        </div>
      </div>
    </div>

    <div class="workspace-content">
      <div class="main-grid">
        <div class="panel-card">
          <div class="panel-title">边裁一已选定</div>
          <div class="selected-card filled">
            <div class="role-label">首席仲裁员</div>
            <div class="person-row">
              <div class="avatar">{{ arbOneSelection.name.charAt(0) }}</div>
              <div class="person-info">
                <div class="name-row">
                  <span class="name">{{ arbOneSelection.name }}</span>
                  <el-tag size="small" effect="dark">首席</el-tag>
                </div>
                <div class="meta">{{ arbOneSelection.gender }} · {{ arbOneSelection.education }}</div>
                <div class="tags">
                  <el-tag v-for="tag in arbOneSelection.domains" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                </div>
              </div>
            </div>
          </div>

          <div class="panel-title secondary">边裁二选定</div>
          <div class="selected-card" :class="{ filled: arbTwoSelection }">
            <div class="role-label">首席仲裁员</div>
            <div v-if="arbTwoSelection" class="person-row">
              <div class="avatar">{{ arbTwoSelection.name.charAt(0) }}</div>
              <div class="person-info">
                <div class="name-row">
                  <span class="name">{{ arbTwoSelection.name }}</span>
                  <el-tag size="small" effect="dark">首席</el-tag>
                </div>
                <div class="meta">{{ arbTwoSelection.gender }} · {{ arbTwoSelection.education }}</div>
                <div class="tags">
                  <el-tag v-for="tag in arbTwoSelection.domains" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">请在右侧名册中选择首席仲裁员</div>
            <div class="card-actions" v-if="arbTwoSelection">
              <el-button plain @click="clearSelection">清除</el-button>
            </div>
          </div>
        </div>

        <div class="panel-card">
          <div class="panel-title roster-title">
            仲裁员名册
            <div class="filters">
              <el-input v-model="filters.keyword" placeholder="姓名搜索" clearable />
              <el-select v-model="filters.domain" placeholder="领域" clearable>
                <el-option label="金融证券" value="金融证券" />
                <el-option label="建设工程" value="建设工程" />
                <el-option label="国际贸易" value="国际贸易" />
                <el-option label="公司法" value="公司法" />
                <el-option label="知识产权" value="知识产权" />
              </el-select>
              <el-select v-model="filters.education" placeholder="学历" clearable>
                <el-option label="博士" value="博士" />
                <el-option label="硕士" value="硕士" />
                <el-option label="学士" value="学士" />
              </el-select>
            </div>
          </div>

          <div class="roster-list">
            <div v-for="arb in filteredRoster" :key="arb.id" class="roster-card">
              <div class="roster-main">
                <div class="avatar">{{ arb.name.charAt(0) }}</div>
                <div class="roster-info">
                  <div class="name-row">
                    <span class="name">{{ arb.name }}</span>
                    <el-tag size="small" effect="plain">{{ arb.education }}</el-tag>
                  </div>
                  <div class="meta">{{ arb.gender }} · {{ arb.city }}</div>
                  <div class="tags">
                    <el-tag v-for="tag in arb.domains" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                  </div>
                </div>
              </div>
              <div class="roster-actions">
                <el-button size="small" type="primary" @click="selectArbitrator(arb)">
                  选为首席
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <el-button size="large" type="primary" :disabled="!arbTwoSelection" @click="submit">
          确认提交
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineProps(['nodeData'])

const roster = ref([
  { id: 'A001', name: '郭建国', gender: '男', education: '博士', city: '广州', domains: ['金融证券', '公司法'] },
  { id: 'A002', name: '陈雅芳', gender: '女', education: '硕士', city: '深圳', domains: ['知识产权', '公司法'] },
  { id: 'A003', name: '林志远', gender: '男', education: '学士', city: '上海', domains: ['建设工程'] },
  { id: 'A004', name: '梁伟诚', gender: '男', education: '硕士', city: '北京', domains: ['国际贸易', '投资'] },
  { id: 'A005', name: '叶晓琳', gender: '女', education: '博士', city: '杭州', domains: ['金融证券', '知识产权'] },
  { id: 'A006', name: '孟淑华', gender: '女', education: '博士', city: '成都', domains: ['公司法', '合规'] },
  { id: 'A007', name: '张明远', gender: '男', education: '硕士', city: '南京', domains: ['房地产', '金融证券'] }
])

const arbOneSelection = ref(roster.value[1])
const arbTwoSelection = ref(null)

const filters = ref({
  keyword: '',
  domain: '',
  education: ''
})

const filteredRoster = computed(() => {
  const keyword = filters.value.keyword.trim()
  const domain = filters.value.domain
  const education = filters.value.education
  return roster.value.filter((arb) => {
    const matchKeyword = !keyword || arb.name.includes(keyword)
    const matchDomain = !domain || arb.domains.includes(domain)
    const matchEducation = !education || arb.education === education
    return matchKeyword && matchDomain && matchEducation
  })
})

const selectArbitrator = (arb) => {
  if (!arb) return
  if (arbOneSelection.value && arb.id !== arbOneSelection.value.id) {
    ElMessageBox.confirm(
      '你与另一边裁选定的首席仲裁员不一致，如继续操作，将由主任指定首席仲裁员。',
      '选定不一致提醒',
      {
        confirmButtonText: '继续操作',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      arbTwoSelection.value = arb
      ElMessage.success('已提交边裁二选定结果')
    }).catch(() => {})
    return
  }
  arbTwoSelection.value = arb
  ElMessage.success('已提交边裁二选定结果')
}

const clearSelection = () => {
  arbTwoSelection.value = null
}

const submit = () => {
  if (!arbTwoSelection.value) {
    ElMessage.warning('请先选定首席仲裁员')
    return
  }
  ElMessage.success('边裁二选定结果已提交')
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
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 600;
}

.gradient-text {
  background: var(--arb-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--arb-text-secondary);
  font-size: 14px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: #2563EB;
  font-weight: 600;
  font-size: 13px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #2563EB;
  box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.2);
}

.main-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

.panel-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--arb-text-main);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-title.secondary {
  margin-top: 24px;
}

.selected-card {
  border: 1px solid var(--arb-border);
  border-radius: 14px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.6);
}

.selected-card.filled {
  border-color: rgba(37, 99, 235, 0.25);
  background: rgba(59, 130, 246, 0.08);
}

.role-label {
  font-size: 13px;
  color: var(--arb-text-secondary);
  margin-bottom: 12px;
}

.person-row {
  display: flex;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #2563EB;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.person-info .name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.person-info .meta {
  color: var(--arb-text-secondary);
  font-size: 13px;
  margin: 6px 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.empty-state {
  color: var(--arb-text-secondary);
  font-size: 14px;
  padding: 10px 0;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
}

.roster-title {
  align-items: flex-start;
  gap: 16px;
}

.filters {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
}

.roster-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.roster-card {
  border: 1px solid var(--arb-border);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(248, 250, 252, 0.7);
}

.roster-main {
  display: flex;
  gap: 12px;
}

.roster-info .name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
}

.roster-info .meta {
  color: var(--arb-text-secondary);
  font-size: 12px;
  margin: 4px 0;
}

.roster-actions {
  display: flex;
  gap: 8px;
}

.footer-actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1100px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
}
</style>
