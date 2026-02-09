import { reactive, computed } from 'vue'

const state = reactive({
  currentUser: 'party', // party, secretary, director, arbitrator
  currentRoleLabel: '当事人',
  
  caseInfo: {
    caseNo: '穗仲案字[2024]第12345号',
    caseReason: '股权转让纠纷',
    courtType: '三人合议庭',
    amount: '¥ 5,000,000.00',
    members: {
      applicant: '广州某科技公司',
      respondent: '深圳某投资公司'
    }
  },

  // 12 Nodes from PRD
  timelineNodes: [
    {
      id: 1,
      title: '组庭启动',
      role: 'secretary',
      roleLabel: '秘书',
      status: 'completed',
      date: '2024-02-01 10:00',
      summary: '已确认庭型为三人合议庭，发起组庭流程。'
    },
    {
      id: 2,
      title: '当事人选择组庭方式',
      role: 'party',
      roleLabel: '当事人',
      status: 'completed',
      date: '2024-02-02 14:30',
      summary: '双方均选择：推荐名单排序路径。'
    },
    {
      id: 3,
      title: '当事人提交选定/提名',
      role: 'party',
      roleLabel: '当事人',
      status: 'completed',
      date: '2024-02-03 09:15',
      summary: '申请人已提交；被申请人已提交。'
    },
    {
      id: 4,
      title: '秘书材料核对',
      role: 'secretary',
      roleLabel: '秘书',
      status: 'completed',
      date: '2024-02-03 11:00',
      summary: '材料齐全，无风险项。'
    },
    {
      id: 5,
      title: '边裁披露与接受',
      role: 'arbitrator',
      roleLabel: '仲裁员',
      status: 'completed',
      date: '2024-02-04 09:00',
      summary: '双方选定/提名的边裁已签署接受书与披露声明。'
    },
    {
      id: 6,
      title: '主任选择指定路径',
      role: 'director',
      roleLabel: '主任',
      status: 'completed',
      date: '2024-02-04 16:20',
      summary: '主任选择：路径B（推荐名单排序）。'
    },
    {
      id: 7,
      title: '主任生成并发送名单',
      role: 'director',
      roleLabel: '主任',
      status: 'completed',
      date: '2024-02-05 09:30',
      summary: '已生成5人首席推荐名单，已发送当事人。'
    },
    {
      id: 8,
      title: '当事人排序共同选定',
      role: 'party',
      roleLabel: '当事人',
      status: 'in_progress', // Current Active Node
      deadline: '2024-02-15 23:59', // 10 days later
      remainingDays: 5,
      summary: '等待双方提交排序结果。',
      data: {
        applicantSorted: false,
        respondentSorted: false,
        list: [
          { id: 'A001', name: '张三（资深仲裁员）', tags: ['金融', '股权'] },
          { id: 'A002', name: '李四（法学教授）', tags: ['公司法', '合同'] },
          { id: 'A003', name: '王五（退休法官）', tags: ['民商事', '建设工程'] },
          { id: 'A004', name: '赵六（律师）', tags: ['国际贸易', '投资'] },
          { id: 'A005', name: '孙七（行业专家）', tags: ['知识产权', '技术'] }
        ]
      }
    },
    {
      id: 9,
      title: '系统汇总排序结果',
      role: 'system',
      roleLabel: '系统',
      status: 'pending',
      summary: '等待双方提交后自动计算。'
    },
    {
      id: 10,
      title: '主任确认最终人选',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '待排序完成后确认。'
    },
    {
      id: 11,
      title: '部门负责人复核',
      role: 'secretary',
      roleLabel: '部门负责人',
      status: 'pending',
      summary: '待组庭名单确认后审批。'
    },
    {
      id: 12,
      title: '组庭完成通知',
      role: 'secretary',
      roleLabel: '秘书',
      status: 'pending',
      summary: '待审批通过后发送通知。'
    }
  ],

  // Active Node Logic
  activeNodeId: 8, // Tracks which node is currently being VIEWED (can be different from in_progress node)
})

export function useArbitration() {
  
  const switchRole = (role) => {
    state.currentUser = role
    const labels = {
      party: '当事人 (申请人代表)',
      secretary: '秘书 (经办人)',
      director: '主任',
      arbitrator: '仲裁员',
      dept_head: '部门负责人'
    }
    state.currentRoleLabel = labels[role]
  }

  // Action: Submit Sort (Party)
  const submitSort = (ranking) => {
    // Simulate API call
    const node = state.timelineNodes.find(n => n.id === 8)
    if (node) {
      node.data.applicantSorted = true
      node.summary = '申请人已提交排序；等待被申请人提交。'
      
      // Auto-simulate respondent if in demo mode?
      // For now just mark applicant done.
    }
  }
  
  // Action: Force complete sort (Debug/Demo)
  const completeSortNode = () => {
    const node8 = state.timelineNodes.find(n => n.id === 8)
    node8.status = 'completed'
    node8.summary = '双方已完成排序，存在相同序位：李四。'
    node8.data.applicantSorted = true
    node8.data.respondentSorted = true
    
    // Activate next
    const node10 = state.timelineNodes.find(n => n.id === 10)
    node10.status = 'in_progress'
    node10.summary = '系统建议：李四（双方第一序位）。请主任确认。'
    
    // Update active view as well
    state.activeNodeId = 10
  }

  const activeNode = computed(() => state.timelineNodes.find(n => n.status === 'in_progress'))
  const viewingNode = computed(() => state.timelineNodes.find(n => n.id === state.activeNodeId))

  const setActiveNode = (id) => {
    state.activeNodeId = id
  }

  return {
    state,
    switchRole,
    submitSort,
    completeSortNode,
    activeNode,
    viewingNode,
    setActiveNode
  }
}
