<template>
  <div class="arb-branch-tree">
    <el-tree
      :data="treeData"
      node-key="key"
      :default-expanded-keys="defaultExpandedKeys"
      :expand-on-click-node="false"
      :indent="16"
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <div
          class="bt-node"
          :class="{
            clickable: Boolean(data.targetId),
            active: data.targetId === activeNodeId
          }"
        >
          <span class="bt-label">{{ data.label }}</span>
          <el-tag
            v-if="data.roleLabel"
            size="small"
            effect="plain"
            class="bt-tag"
          >
            {{ data.roleLabel }}
          </el-tag>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activeNodeId: {
    type: Number,
    required: true
  },
  timelineNodes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['select'])

const roleLabelByTargetId = (targetId) => {
  const match = props.timelineNodes.find((n) => n.id === targetId)
  return match?.roleLabel || ''
}

const treeData = computed(() => [
  {
    key: 'root',
    label: '合议庭',
    targetId: 1,
    roleLabel: roleLabelByTargetId(1),
    children: [
      {
        key: 'start',
        label: '组庭启动',
        targetId: 1,
        roleLabel: roleLabelByTargetId(1)
      },
      {
        key: 'ways',
        label: '三种方式',
        targetId: 1,
        roleLabel: roleLabelByTargetId(1),
        children: [
          {
            key: 'way-a',
            label: '首席+边裁都已选定',
            targetId: 6.1,
            roleLabel: roleLabelByTargetId(6.1),
            children: [
              {
                key: 'way-a-dept',
                label: '部门负责人审批',
                targetId: 6,
                roleLabel: roleLabelByTargetId(6)
              },
              {
                key: 'way-a-lead',
                label: '分管委领导审批',
                targetId: 6.5,
                roleLabel: roleLabelByTargetId(6.5)
              },
              {
                key: 'way-a-dir',
                label: '主任最终指定/确认',
                targetId: 11,
                roleLabel: roleLabelByTargetId(11)
              }
            ]
          },
          {
            key: 'way-b',
            label: '当事人委托边裁选择首席',
            targetId: 2,
            roleLabel: roleLabelByTargetId(2),
            children: [
              {
                key: 'way-b-nominate',
                label: '当事人选择边裁',
                targetId: 2,
                roleLabel: roleLabelByTargetId(2)
              },
              {
                key: 'way-b-consensus',
                label: '当事人选择边裁是否一致',
                targetId: 2,
                roleLabel: '系统',
                children: [
                  {
                    key: 'way-b-consensus-yes',
                    label: '一致',
                    targetId: 7,
                    roleLabel: roleLabelByTargetId(7),
                    children: [
                      {
                        key: 'way-b-chief-confirm',
                        label: '主任确认',
                        targetId: 7,
                        roleLabel: roleLabelByTargetId(7)
                      },
                      {
                        key: 'way-b-chief-return',
                        label: '退回',
                        targetId: 2,
                        roleLabel: roleLabelByTargetId(2)
                      },
                      {
                        key: 'way-b-chief-notify',
                        label: '通知边裁限期共同选定首席',
                        targetId: 3,
                        roleLabel: roleLabelByTargetId(3),
                        children: [
                          {
                            key: 'way-b-chief-result',
                            label: '边裁选择首席结果是否一致',
                            targetId: 3,
                            roleLabel: '系统',
                            children: [
                              {
                                key: 'way-b-chief-result-yes',
                                label: '一致',
                                targetId: 11,
                                roleLabel: roleLabelByTargetId(11),
                                children: [
                                  {
                                    key: 'way-b-chief-final',
                                    label: '首席确认',
                                    targetId: 11.1,
                                    roleLabel: roleLabelByTargetId(11.1)
                                  }
                                ]
                              },
                              {
                                key: 'way-b-chief-result-no',
                                label: '不一致',
                                targetId: 6,
                                roleLabel: roleLabelByTargetId(6),
                                children: [
                                  {
                                    key: 'way-b-chief-approve-dept',
                                    label: '部门负责人推荐',
                                    targetId: 6,
                                    roleLabel: roleLabelByTargetId(6)
                                  },
                                  {
                                    key: 'way-b-chief-approve-lead',
                                    label: '分管委领导推荐',
                                    targetId: 6.5,
                                    roleLabel: roleLabelByTargetId(6.5)
                                  },
                                  {
                                    key: 'way-b-chief-approve-dir',
                                    label: '主任确认',
                                    targetId: 11.2,
                                    roleLabel: roleLabelByTargetId(11.2)
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  {
                    key: 'way-b-consensus-no',
                    label: '不一致',
                    targetId: 6,
                    roleLabel: roleLabelByTargetId(6),
                    children: [
                      {
                        key: 'way-b-side-approve-dept',
                        label: '部门负责人推荐边裁',
                        targetId: 6,
                        roleLabel: roleLabelByTargetId(6)
                      },
                      {
                        key: 'way-b-side-approve-lead',
                        label: '分管委领导推荐边裁',
                        targetId: 6.5,
                        roleLabel: roleLabelByTargetId(6.5)
                      },
                      {
                        key: 'way-b-side-approve-dir',
                        label: '主任确认边裁',
                        targetId: 7,
                        roleLabel: roleLabelByTargetId(7)
                      },
                      {
                        key: 'way-b-side-notify',
                        label: '通知边裁限期共同选定首席',
                        targetId: 3,
                        roleLabel: roleLabelByTargetId(3)
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            key: 'way-c',
            label: '当事人选择边裁',
            targetId: 2,
            roleLabel: roleLabelByTargetId(2),
            children: [
              {
                key: 'way-c-nominate',
                label: '当事人选择边裁',
                targetId: 2,
                roleLabel: roleLabelByTargetId(2)
              },
              {
                key: 'way-c-method',
                label: '当事人选择首席组成方式',
                targetId: 3,
                roleLabel: roleLabelByTargetId(3),
                children: [
                  {
                    key: 'way-c-method-delegate-arb',
                    label: '委托边裁选定首席',
                    targetId: 2,
                    roleLabel: roleLabelByTargetId(2),
                    children: [
                      {
                        key: 'way-c-method-delegate-arb-ref',
                        label: '进入「当事人委托边裁选择首席」流程',
                        targetId: 2,
                        roleLabel: roleLabelByTargetId(2)
                      }
                    ]
                  },
                  {
                    key: 'way-c-method-joint',
                    label: '双方当事人共同选定',
                    targetId: 3,
                    roleLabel: roleLabelByTargetId(3)
                  },
                  {
                    key: 'way-c-method-director',
                    label: '委托主任选定/指定',
                    targetId: 7,
                    roleLabel: roleLabelByTargetId(7)
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])

const defaultExpandedKeys = [
  'root',
  'ways',
  'way-a',
  'way-b',
  'way-b-consensus',
  'way-c',
  'way-c-method'
]

const handleNodeClick = (data) => {
  if (!data?.targetId) return
  emit('select', data.targetId)
}
</script>

<style scoped>
.arb-branch-tree {
  width: 100%;
}

.bt-node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 10px;
  width: 100%;
  min-height: 36px;
  transition: background 0.2s ease, color 0.2s ease;
}

.bt-node.clickable {
  cursor: pointer;
}

.bt-node:hover {
  background: rgba(30, 58, 138, 0.06);
}

.bt-node.active {
  background: rgba(30, 58, 138, 0.1);
}

.bt-label {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  line-height: 1.4;
  color: var(--arb-text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bt-tag {
  flex-shrink: 0;
  border-radius: 999px;
}

:deep(.el-tree-node__content) {
  height: auto;
  padding: 2px 4px;
}

:deep(.el-tree-node__content:hover) {
  background: transparent;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background: transparent;
}
</style>
