import { createRouter, createWebHashHistory } from 'vue-router'
import RecordsView from '../views/RecordsView.vue'
import ArbitrationWorkbench from '../views/workbench/ArbitrationWorkbench.vue'

const routes = [
  { path: '/', redirect: '/workbench' },
  { path: '/records', name: 'records', component: RecordsView },
  { path: '/workbench', name: 'workbench', component: ArbitrationWorkbench }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
