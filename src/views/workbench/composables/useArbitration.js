import { reactive, computed } from 'vue'

const state = reactive({
  currentUser: 'party', // party, secretary, director, arbitrator
  currentRoleLabel: '当事人',
  
  caseInfo: {
    caseNo: '穗仲案字[2024]第12345号',
    caseReason: '股权转让纠纷',
    courtType: '合议庭',
    amount: '¥ 5,000,000.00',
    members: {
      applicant: '广州市天河区高新科技发展有限公司',
      respondent: '深圳市南山区创新投资合伙企业（有限合伙）'
    }
  },

  // 12 Nodes from PRD (Modified per request)
  timelineNodes: [
    {
      id: 1,
      title: '组庭启动',
      role: 'secretary',
      roleLabel: '秘书',
      status: 'completed',
      date: '2024-02-01 10:00',
      summary: '已确认庭型为合议庭，发起组庭流程。'
    },
    {
      id: 2,
      title: '边裁选择',
      role: 'party',
      roleLabel: '当事人',
      status: 'completed',
      date: '2024-02-02 14:30',
      summary: '双方均选择：推荐名单排序路径。'
    },
    {
      id: 3,
      title: '首席选择',
      role: 'party',
      roleLabel: '当事人',
      status: 'completed',
      date: '2024-02-03 09:15',
      summary: '申请人已提交；被申请人已提交。'
    },
    {
      id: 14,
      title: '边裁选定首席',
      role: 'arbitrator',
      roleLabel: '边裁',
      status: 'pending',
      summary: '边裁一已选定首席，等待边裁二确认。'
    },
    // {
    //   id: 4,
    //   title: '边裁披露与接受', // Was Node 5
    //   role: 'arbitrator',
    //   roleLabel: '仲裁员',
    //   status: 'completed',
    //   date: '2024-02-03 11:00',
    //   summary: '双方选定/提名的边裁已签署接受书与披露声明。'
    // },
    // {
    //   id: 5,
    //   title: '秘书材料核对', // Was Node 4
    //   role: 'secretary',
    //   roleLabel: '秘书',
    //   status: 'completed',
    //   date: '2024-02-04 09:00',
    //   summary: '材料齐全，无风险项。'
    // },
    {
      id: 6,
      title: '立案部长审核', // Was Node 11 (Dept Head Review), moved here
      role: 'secretary', // Or Dept Head
      roleLabel: '立案部长',
      status: 'completed',
      date: '2024-02-04 14:00',
      summary: '已审核通过，建议主任提供推荐名单。'
    },
    {
      id: 6.1,
      title: '立案部长审核',
      role: 'secretary',
      roleLabel: '立案部长',
      status: 'completed',
      date: '2024-02-04 14:00',
      summary: '已审核通过，建议主任提供推荐名单。'
    },
    {
      id: 6.2,
      title: '秘书提交名单',
      role: 'secretary',
      roleLabel: '秘书',
      status: 'completed',
      date: '2024-02-04 14:00',
      summary: '已审核通过，建议主任提供推荐名单。'
    },
    {
      id: 6.3,
        title: '立案部长审核', // Was Node 11 (Dept Head Review), moved here
        role: 'secretary', // Or Dept Head
        roleLabel: '立案部长',
        status: 'completed',
        date: '2024-02-04 14:00',
        summary: '已审核通过，建议主任提供推荐名单。'
    },
    {
      id: 6.4,
      title: '分管委领导', // Was Node 11 (Dept Head Review), moved here
      role: 'secretary', // Or Dept Head
      roleLabel: '分管委领导',
      status: 'completed',
      date: '2024-02-04 14:00',
      summary: '已审核通过，建议主任提供推荐名单。'
    },
    {
      id: 6.5,
      title: '分管委领导', // Was Node 11 (Dept Head Review), moved here
      role: 'secretary', // Or Dept Head
      roleLabel: '分管委领导',
      status: 'completed',
      date: '2024-02-04 14:00',
      summary: '已审核通过，建议主任提供推荐名单。'
    },
    {
      id: 6.6,
      title: '分管委领导', // Was Node 11 (Dept Head Review), moved here
      role: 'secretary', // Or Dept Head
      roleLabel: '分管委领导',
      status: 'completed',
      date: '2024-02-04 14:00',
      summary: '已审核通过，建议主任提供推荐名单。'
    },
    {
      id: 7,
      title: '主任选择指定路径', // Was Node 6
      role: 'director',
      roleLabel: '主任',
      status: 'completed',
      date: '2024-02-04 16:20',
      summary: '主任选择：路径B（推荐名单排序）。'
    },
    {
      id: 7.1,
      title: '主任确认',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '等待主任确认。'
    },
    {
      id: 7.7,
      title: '主任确认',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '待主任确认。'
    },
    {
      id: 8,
      title: '主任生成并发送名单', // Was Node 7
      role: 'director',
      roleLabel: '主任',
      status: 'completed',
      date: '2024-02-05 09:30',
      summary: '已生成5人首席推荐名单，已发送当事人。'
    },
    {
      id: 17,
      title: '主任直接指定',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '主任直接指定首席人选。'
    },
    {
      id: 9,
      title: '当事人排序共同选定', // Was Node 8
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
          { id: 'A001', name: '郭建国（资深仲裁员）', tags: ['金融', '股权'] },
          { id: 'A002', name: '陈雅芳（法学教授）', tags: ['公司法', '合同'] },
          { id: 'A003', name: '林志远（退休法官）', tags: ['民商事', '建设工程'] },
          { id: 'A004', name: '梁伟诚（律师）', tags: ['国际贸易', '投资'] },
          { id: 'A005', name: '叶晓琳（行业专家）', tags: ['知识产权', '技术'] }
        ]
      }
    },
    {
      id: 10,
      title: '系统汇总排序结果', // Was Node 9
      role: 'system',
      roleLabel: '系统',
      status: 'pending',
      summary: '等待双方提交后自动计算。'
    },
    {
      id: 11.1,
      title: '首席确认',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '边裁共同选定首席，待主任确认。'
    },
    {
      id: 11.2,
      title: '主任确认',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '待主任确认。'
    },
    {
      id: 11.3,
      title: '主任最终指定',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '因排序结果冲突，需主任介入指定。'
    },
    {
      id: 11,
      title: '主任最终指定',
      role: 'director',
      roleLabel: '主任',
      status: 'pending',
      summary: '因排序结果冲突，需主任介入指定。'
    },
    {
      id: 12,
      title: '组庭完成',
      role: 'secretary',
      roleLabel: '秘书',
      status: 'pending',
      summary: '待审批通过后发送通知。'
    }
  ],

  // Active Node Logic
  activeNodeId: 9, // Tracks which node is currently being VIEWED (matches 'in_progress' node id 9)
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
    const node = state.timelineNodes.find(n => n.id === 9)
    if (node) {
      node.data.applicantSorted = true
      node.summary = '申请人已提交排序；等待被申请人提交。'
      
      // Auto-simulate respondent if in demo mode?
      // For now just mark applicant done.
    }
  }
  
  // Action: Force complete sort (Debug/Demo)
  const completeSortNode = () => {
    const nodeSort = state.timelineNodes.find(n => n.id === 9)
    nodeSort.status = 'completed'
    nodeSort.summary = '双方已完成排序，存在相同序位：陈雅芳。'
    nodeSort.data.applicantSorted = true
    nodeSort.data.respondentSorted = true
    
    // Activate next (Node 10 - Result)
    const nodeResult = state.timelineNodes.find(n => n.id === 10)
    nodeResult.status = 'in_progress'
    nodeResult.summary = '系统计算完成：排序不一致，需主任指定。'
    
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
