<template>
  <div class="node-content">
    <el-card class="node-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="title">秘书材料核对</span>
          <el-tag type="success" effect="dark">已完成</el-tag>
        </div>
      </template>

      <div class="checklist-container">
        <el-table :data="checklist" border style="width: 100%">
          <el-table-column prop="item" label="核对项" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.status">通过</el-tag>
              <el-tag type="danger" v-else>待核实</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" />
        </el-table>

        <div class="summary-box">
          <el-alert
            title="核对结论：材料齐全，选定人员符合规定，无关联回避情形。"
            type="success"
            :closable="false"
            show-icon
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

defineProps(['nodeData'])

const checklist = reactive([
  { item: '当事人身份证明材料', status: true, remark: '已核验原件' },
  { item: '授权委托书及代理人手续', status: true, remark: '符合要求' },
  { item: '选定仲裁员资格核查', status: true, remark: '在册仲裁员，执业证有效' },
  { item: '仲裁员利益冲突检索', status: true, remark: '系统检索无关联' }
])
</script>

<style scoped>
.node-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 18px;
  font-weight: 600;
  color: var(--arb-text-primary);
}
.summary-box {
  margin-top: 24px;
}
</style>