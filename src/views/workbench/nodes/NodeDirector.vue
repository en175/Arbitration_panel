<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <div class="header-content">
        <div class="title-group">
          <h2 class="main-title">主任路径决策</h2>
        </div>
        <div class="header-actions">
          <el-tag effect="dark" type="warning" class="status-badge">待决策</el-tag>
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
            <div class="card-icon">
              <el-icon><List /></el-icon>
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
              <div class="empty-state-large">
                <div class="icon-bg">
                  <el-icon><UserFilled /></el-icon>
                </div>
                <h3>直接指定模式</h3>
                <p>您已选择由主任直接指定首席仲裁员。请点击下方按钮进入人员指定流程。</p>
                <el-button type="primary" size="large" class="action-btn" @click="submit">
                  开始指定流程
                </el-button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <div class="side-column">
        <div class="info-card-modern">
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

        <div class="info-card-modern warning">
          <div class="card-header">
            <span class="icon-wrapper warning"><el-icon><Warning /></el-icon></span>
            <span class="title">智能风控</span>
          </div>
          <div class="warning-content">
            <p>检测到当事人一方为外籍（新加坡），请优先推荐具备<strong>涉外仲裁经验</strong>的仲裁员。</p>
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
import { UserFilled, List, Check, Search, Operation, MagicStick, Trophy, Plus, Close, Document, Warning } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'

const { setActiveNode } = useArbitration()

const pathType = ref('A')
const candidates = ref([
  { name: '郭建国', education: '博士', gender: '男', domains: ['金融', '房地产'] },
  { name: '陈雅芳', education: '硕士', gender: '女', domains: ['知识产权'] },
  { name: '林志远', education: '博士', gender: '男', domains: ['建设工程'] },
  { name: '梁伟诚', education: '博士', gender: '男', domains: ['国际贸易'] },
  { name: '叶晓琳', education: '硕士', gender: '女', domains: ['技术合同'] }
])
const showMoreDialog = ref(false)

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
  align-items: center;
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
