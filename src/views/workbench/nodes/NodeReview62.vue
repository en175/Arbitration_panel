<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-content">
        <div class="header-left">
          <h2 class="gradient-text">秘书代当事人选定仲裁员</h2>
          <span class="subtitle">从名册选定两名边裁与首席仲裁员，并上传共同选定凭证</span>
        </div>
        <div class="header-right">
          <div class="status-badge">
            <div class="pulse-dot"></div>
            <span>待提交</span>
          </div>
        </div>
      </div>
    </div>

    <div class="workspace-content">
      <div class="main-grid">
        <div class="panel-card">
          <div class="panel-title">
            已选仲裁员
            <el-tag type="info" effect="plain">需选 1 名首席 + 2 名边裁</el-tag>
          </div>

          <div class="selected-grid">
            <div class="selected-card" :class="{ filled: selectedChief }">
              <div class="role-label">首席仲裁员</div>
              <div v-if="selectedChief" class="person-row">
                <div class="avatar">{{ selectedChief.name.charAt(0) }}</div>
                <div class="person-info">
                  <div class="name-row">
                    <span class="name">{{ selectedChief.name }}</span>
                    <el-tag size="small" effect="dark">首席</el-tag>
                  </div>
                  <div class="meta">{{ selectedChief.gender }} · {{ selectedChief.education }}</div>
                  <div class="tags">
                    <el-tag v-for="tag in selectedChief.domains" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">尚未选择首席仲裁员</div>
              <div class="card-actions">
                <el-button type="primary" @click="assignFromList('chief')">从名册选择</el-button>
                <el-button v-if="selectedChief" plain @click="clearRole('chief')">清除</el-button>
              </div>
            </div>

            <div class="selected-card" :class="{ filled: selectedSide1 }">
              <div class="role-label">边裁一</div>
              <div v-if="selectedSide1" class="person-row">
                <div class="avatar">{{ selectedSide1.name.charAt(0) }}</div>
                <div class="person-info">
                  <div class="name-row">
                    <span class="name">{{ selectedSide1.name }}</span>
                    <el-tag size="small" effect="dark" type="success">边裁</el-tag>
                  </div>
                  <div class="meta">{{ selectedSide1.gender }} · {{ selectedSide1.education }}</div>
                  <div class="tags">
                    <el-tag v-for="tag in selectedSide1.domains" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">尚未选择边裁一</div>
              <div class="card-actions">
                <el-button type="primary" @click="assignFromList('side1')">从名册选择</el-button>
                <el-button v-if="selectedSide1" plain @click="clearRole('side1')">清除</el-button>
              </div>
            </div>

            <div class="selected-card" :class="{ filled: selectedSide2 }">
              <div class="role-label">边裁二</div>
              <div v-if="selectedSide2" class="person-row">
                <div class="avatar">{{ selectedSide2.name.charAt(0) }}</div>
                <div class="person-info">
                  <div class="name-row">
                    <span class="name">{{ selectedSide2.name }}</span>
                    <el-tag size="small" effect="dark" type="success">边裁</el-tag>
                  </div>
                  <div class="meta">{{ selectedSide2.gender }} · {{ selectedSide2.education }}</div>
                  <div class="tags">
                    <el-tag v-for="tag in selectedSide2.domains" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">尚未选择边裁二</div>
              <div class="card-actions">
                <el-button type="primary" @click="assignFromList('side2')">从名册选择</el-button>
                <el-button v-if="selectedSide2" plain @click="clearRole('side2')">清除</el-button>
              </div>
            </div>
          </div>

          <div class="upload-area">
            <div class="upload-title">
              上传凭证
              <el-tag size="small" effect="plain">双方书面文件</el-tag>
            </div>
            <el-upload
              v-model:file-list="proofFiles"
              action="#"
              :auto-upload="false"
              :limit="5"
              :on-exceed="handleExceed"
              class="upload-widget"
            >
              <el-button type="primary">选择文件</el-button>
            </el-upload>
            <div class="upload-tip">用于证明当事人双方提交书面文件，共同选定边裁与首席仲裁员</div>
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
                <el-button size="small" plain :disabled="isChosen(arb)" @click="quickAssign('chief', arb)">
                  选为首席
                </el-button>
                <el-button size="small" plain :disabled="isChosen(arb)" @click="quickAssign('side1', arb)">
                  选为边裁一
                </el-button>
                <el-button size="small" type="primary" :disabled="isChosen(arb)" @click="quickAssign('side2', arb)">
                  选为边裁二
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <el-button size="large" plain @click="resetAll">清空选择</el-button>
        <el-button size="large" type="primary" @click="submit">确认提交</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

defineProps(['nodeData'])

const selectedChief = ref(null)
const selectedSide1 = ref(null)
const selectedSide2 = ref(null)
const proofFiles = ref([])

const roster = ref([
  { id: 'A001', name: '郭建国', gender: '男', education: '博士', city: '广州', domains: ['金融证券', '公司法'] },
  { id: 'A002', name: '陈雅芳', gender: '女', education: '硕士', city: '深圳', domains: ['知识产权', '公司法'] },
  { id: 'A003', name: '林志远', gender: '男', education: '学士', city: '上海', domains: ['建设工程'] },
  { id: 'A004', name: '梁伟诚', gender: '男', education: '硕士', city: '北京', domains: ['国际贸易', '投资'] },
  { id: 'A005', name: '叶晓琳', gender: '女', education: '博士', city: '杭州', domains: ['金融证券', '知识产权'] },
  { id: 'A006', name: '孟淑华', gender: '女', education: '博士', city: '成都', domains: ['公司法', '合规'] },
  { id: 'A007', name: '张明远', gender: '男', education: '硕士', city: '南京', domains: ['房地产', '金融证券'] }
])

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

const isChosen = (arb) => {
  const targets = [selectedChief.value, selectedSide1.value, selectedSide2.value].filter(Boolean)
  return targets.some((item) => item.id === arb.id)
}

const assignFromList = (role) => {
  const candidate = filteredRoster.value.find((arb) => !isChosen(arb))
  if (!candidate) {
    ElMessage.warning('名册中没有可选仲裁员')
    return
  }
  quickAssign(role, candidate)
}

const quickAssign = (role, arb) => {
  if (isChosen(arb)) {
    ElMessage.warning('该仲裁员已被选择')
    return
  }
  if (role === 'chief') selectedChief.value = arb
  if (role === 'side1') selectedSide1.value = arb
  if (role === 'side2') selectedSide2.value = arb
  const roleMap = { chief: '首席仲裁员', side1: '边裁一', side2: '边裁二' }
  ElMessage.success(`已选定 ${arb.name} 为${roleMap[role]}`)
}

const clearRole = (role) => {
  if (role === 'chief') selectedChief.value = null
  if (role === 'side1') selectedSide1.value = null
  if (role === 'side2') selectedSide2.value = null
}

const handleExceed = () => {
  ElMessage.warning('最多上传 5 份凭证')
}

const resetAll = () => {
  selectedChief.value = null
  selectedSide1.value = null
  selectedSide2.value = null
  proofFiles.value = []
  ElMessage.info('已清空选择与凭证')
}

const submit = () => {
  if (!selectedChief.value || !selectedSide1.value || !selectedSide2.value) {
    ElMessage.error('请先选定首席与两名边裁')
    return
  }
  if (!proofFiles.value.length) {
    ElMessage.error('请上传共同选定凭证')
    return
  }
  ElMessage.success('已提交确认，进入下一流程')
}
</script>

<style scoped>
.node-workspace {
  max-width: 1200px;
  margin: 0 auto;
}

.workspace-header {
  margin-bottom: 28px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gradient-text {
  font-family: var(--arb-font-serif);
  font-size: 28px;
  margin: 0;
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
  background: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 108, 108, 0.7); }
}

.workspace-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
}

.panel-card {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--arb-text-primary);
  gap: 12px;
}

.roster-title {
  align-items: flex-start;
}

.filters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.selected-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.selected-card {
  border: 1px solid var(--arb-border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: rgba(255, 255, 255, 0.6);
}

.selected-card.filled {
  border-color: rgba(64, 158, 255, 0.4);
  background: rgba(64, 158, 255, 0.04);
}

.role-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--arb-text-secondary);
}

.person-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--arb-gradient-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.person-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.name {
  color: var(--arb-text-primary);
}

.meta {
  font-size: 13px;
  color: var(--arb-text-secondary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.empty-state {
  color: var(--arb-text-secondary);
  font-size: 14px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.upload-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(64, 158, 255, 0.06);
}

.upload-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--arb-text-primary);
}

.upload-widget {
  width: 100%;
}

.upload-tip {
  font-size: 12px;
  color: var(--arb-text-secondary);
}

.roster-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.roster-card {
  border: 1px solid var(--arb-border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.roster-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.roster-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.roster-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

@media (max-width: 1080px) {
  .main-grid {
    grid-template-columns: 1fr;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .roster-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .roster-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
