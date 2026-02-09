<template>
  <div class="role-switcher">
    <div class="label">当前视角</div>
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ currentRoleLabel }}
        <el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="party">当事人 (申请人)</el-dropdown-item>
          <el-dropdown-item command="secretary">秘书 (经办)</el-dropdown-item>
          <el-dropdown-item command="director">主任</el-dropdown-item>
          <el-dropdown-item command="dept_head">部门负责人</el-dropdown-item>
          <el-dropdown-item command="arbitrator">仲裁员</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue'
import { useArbitration } from '../composables/useArbitration'
import { toRefs } from 'vue'

const { state, switchRole } = useArbitration()
const { currentRoleLabel } = toRefs(state)

const handleCommand = (command) => {
  switchRole(command)
}
</script>

<style scoped>
.role-switcher {
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 2000;
  background: var(--arb-surface);
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: var(--arb-shadow-lg);
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--arb-gold);
}

.label {
  font-size: 12px;
  color: var(--arb-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--arb-primary);
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
}
</style>
