<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2>主任路径决策</h2>
      <div class="status-alert">
        <el-tag type="danger" effect="dark">关键节点</el-tag>
      </div>
    </div>

    <div class="workspace-content">
      <el-row :gutter="24">
        <el-col :span="16">
          <div class="decision-panel">
            <div class="panel-title">请选择推进路径</div>
            
            <el-radio-group v-model="pathType" class="path-selector">
              <div 
                class="path-option" 
                :class="{ active: pathType === 'A' }"
                @click="pathType = 'A'"
              >
                <div class="path-header">
                  <span class="path-code">路径 A</span>
                  <span class="path-name">主任直接指定</span>
                </div>
                <div class="path-desc">适用于双方未能达成一致，或特殊案件需要直接指定首席仲裁员的情况。效率最高。</div>
              </div>

              <div 
                class="path-option" 
                :class="{ active: pathType === 'B' }"
                @click="pathType = 'B'"
              >
                <div class="path-header">
                  <span class="path-code">路径 B</span>
                  <span class="path-name">提供推荐名单</span>
                </div>
                <div class="path-desc">系统生成或人工筛选推荐名单（5-7人），交由当事人排序选定。体现当事人意思自治。</div>
              </div>
            </el-radio-group>

            <div class="config-area" v-if="pathType === 'B'">
              <div class="area-title">推荐名单生成配置</div>
              <el-form label-width="100px">
                <el-form-item label="专业领域">
                  <el-select v-model="domain" multiple placeholder="请选择专业领域">
                    <el-option label="金融" value="finance" />
                    <el-option label="房地产" value="estate" />
                    <el-option label="国际贸易" value="trade" />
                  </el-select>
                </el-form-item>
                <el-form-item label="回避情形">
                  <el-checkbox-group v-model="exclusions">
                    <el-checkbox label="曾代理过本案当事人" />
                    <el-checkbox label="与本案有利害关系" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain @click="generateList">生成候选人名单</el-button>
                </el-form-item>
              </el-form>

              <div class="candidate-preview" v-if="candidates.length > 0">
                <div class="preview-header">已生成候选人 ({{ candidates.length }}人)</div>
                <div class="candidate-tags">
                  <el-tag 
                    v-for="name in candidates" 
                    :key="name" 
                    closable 
                    @close="removeCandidate(name)"
                  >
                    {{ name }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="info-sidebar">
            <div class="info-card">
              <h4>案件概况辅助</h4>
              <p><strong>标的额：</strong> 5,000,000 元</p>
              <p><strong>争议类型：</strong> 股权转让纠纷</p>
              <p><strong>适用规则：</strong> 2024版仲裁规则</p>
            </div>
             <div class="info-card warning">
              <h4>风险提示</h4>
              <p>检测到当事人一方为外籍，请优先推荐具备涉外仲裁经验的仲裁员。</p>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="bottom-actions">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" size="large" @click="submit">确认决策并流转</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const pathType = ref('B')
const domain = ref(['finance', 'estate'])
const exclusions = ref(['曾代理过本案当事人'])
const candidates = ref([])

const generateList = () => {
  candidates.value = ['张三', '李四', '王五', '赵六', '孙七']
  ElMessage.success('系统已根据规则匹配出 5 位推荐候选人')
}

const removeCandidate = (name) => {
  candidates.value = candidates.value.filter(c => c !== name)
}

const submit = () => {
  ElMessage.success('决策已提交，流程流转至：推荐名单排序')
}

const reset = () => {
  pathType.value = 'B'
  candidates.value = []
}
</script>

<style scoped>
.node-workspace {
  max-width: 1200px;
  margin: 0 auto;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.workspace-header h2 {
  font-family: var(--arb-font-serif);
  color: var(--arb-primary);
  margin: 0;
}

.decision-panel {
  background: white;
  padding: 32px;
  border-radius: 8px;
  border: 1px solid var(--arb-border);
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--arb-text-main);
}

.path-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.path-option {
  border: 2px solid var(--arb-border);
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.path-option:hover {
  border-color: var(--arb-primary-light);
}

.path-option.active {
  border-color: var(--arb-gold);
  background: var(--arb-gold-bg);
}

.path-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.path-code {
  background: var(--arb-primary);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.path-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--arb-text-main);
}

.path-desc {
  font-size: 14px;
  color: var(--arb-text-secondary);
  padding-left: 56px;
}

.config-area {
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px dashed var(--arb-border);
}

.area-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--arb-text-main);
}

.candidate-preview {
  margin-top: 24px;
  background: var(--arb-bg);
  padding: 16px;
  border-radius: 8px;
}

.preview-header {
  font-size: 13px;
  color: var(--arb-text-secondary);
  margin-bottom: 12px;
}

.candidate-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-card {
  background: var(--arb-bg);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid var(--arb-border);
}

.info-card h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: var(--arb-text-main);
}

.info-card p {
  margin: 8px 0;
  font-size: 13px;
  color: var(--arb-text-secondary);
}

.info-card.warning {
  background: #FEF2F2;
  border-color: #FECACA;
}

.info-card.warning h4 {
  color: #DC2626;
}

.bottom-actions {
  margin-top: 32px;
  text-align: right;
  border-top: 1px solid var(--arb-border);
  padding-top: 24px;
}
</style>
