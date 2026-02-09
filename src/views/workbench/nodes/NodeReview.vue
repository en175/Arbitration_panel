<template>
  <div class="node-workspace">
    <div class="workspace-header">
      <h2>组庭结果复核</h2>
      <div class="status-alert">
        <el-tag type="info">待审批</el-tag>
      </div>
    </div>

    <div class="workspace-content">
      <el-row :gutter="24">
        <el-col :span="16">
          <div class="review-card">
            <div class="section-title">拟组庭人员名单</div>
            <el-table :data="tableData" border style="width: 100%">
              <el-table-column prop="role" label="角色" width="120" />
              <el-table-column prop="name" label="姓名" width="120">
                <template #default="scope">
                  <strong>{{ scope.row.name }}</strong>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="产生方式" />
              <el-table-column prop="status" label="回避核查" width="100">
                <template #default>
                  <el-tag type="success" size="small">通过</el-tag>
                </template>
              </el-table-column>
            </el-table>

            <div class="section-title" style="margin-top: 32px">历程追溯</div>
            <el-timeline>
              <el-timeline-item timestamp="2024-02-01" type="primary">
                案件受理，启动组庭程序
              </el-timeline-item>
              <el-timeline-item timestamp="2024-02-03" type="success">
                当事人选定方式：推荐名单选定
              </el-timeline-item>
              <el-timeline-item timestamp="2024-02-08" type="success">
                主任生成推荐名单（5人）
              </el-timeline-item>
              <el-timeline-item timestamp="2024-02-10" type="warning">
                双方完成排序，首选一致：<strong>张三</strong>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="approval-panel">
            <div class="panel-header">审批操作</div>
            <el-form label-position="top">
              <el-form-item label="审批意见">
                <el-radio-group v-model="approvalResult">
                  <el-radio label="approve">同意组庭</el-radio>
                  <el-radio label="reject">退回重议</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备注/批示">
                <el-input v-model="comment" type="textarea" rows="4" placeholder="请输入审批意见..." />
              </el-form-item>
              <el-button type="primary" class="full-btn" @click="submit">提交审批结果</el-button>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const approvalResult = ref('approve')
const comment = ref('同意按此名单组庭。')

const tableData = [
  { role: '首席仲裁员', name: '张三', source: '双方共同选定(排序一致)', status: 'pass' },
  { role: '申请人边裁', name: '李四', source: '当事人指定', status: 'pass' },
  { role: '被申请人边裁', name: '王五', source: '当事人指定', status: 'pass' }
]

const submit = () => {
  ElMessage.success('审批已通过，组庭完成！')
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

.review-card {
  background: white;
  padding: 32px;
  border-radius: 8px;
  border: 1px solid var(--arb-border);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--arb-text-main);
  margin-bottom: 16px;
  border-left: 4px solid var(--arb-gold);
  padding-left: 12px;
}

.approval-panel {
  background: white;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid var(--arb-border);
  position: sticky;
  top: 24px;
}

.panel-header {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--arb-border-light);
}

.full-btn {
  width: 100%;
  margin-top: 16px;
}
</style>
