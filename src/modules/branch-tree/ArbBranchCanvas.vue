<template>
  <div
    ref="viewportRef"
    class="branch-canvas"
    :class="{ panning: isPanning }"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
    @pointerleave="onPointerUp"
  >
    <div class="scroll-space" :style="scrollSpaceStyle">
      <div
        ref="contentRef"
        class="canvas-content"
        :style="contentStyle"
      >
        <svg class="canvas-edges" :width="canvasSize.w" :height="canvasSize.h">
          <defs>
            <marker
              id="arrowHead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(30, 58, 138, 0.35)" />
            </marker>
          </defs>

          <path
            v-for="e in edges"
            :key="e.key"
            :d="e.d"
            :class="['edge-path', e.variant]"
            marker-end="url(#arrowHead)"
          />
        </svg>

        <div
          v-for="n in nodes"
          :key="n.key"
          class="bn-card"
          :class="{
            clickable: Boolean(n.targetId),
            active: Boolean(n.targetId) && n.targetId === activeNodeId,
            group: n.kind === 'group',
            approve: n.kind === 'approve',
            primary: n.kind === 'primary'
          }"
          :style="{
            left: `${n.x}px`,
            top: `${n.y}px`,
            width: `${n.w}px`,
            height: `${n.h}px`
          }"
          @click="onNodeClick(n)"
        >
          <div class="bn-title">{{ n.label }}</div>
          <el-tag
            v-if="n.roleLabel"
            size="small"
            effect="plain"
            class="bn-role"
          >
            {{ n.roleLabel }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="zoom-pill" @pointerdown.stop>
      <button class="zp-btn" type="button" @click="zoomOut" :disabled="scale <= zoomRange.min">-</button>
      <button class="zp-mid" type="button" @click="fitToView">{{ zoomPercent }}</button>
      <button class="zp-btn" type="button" @click="zoomIn" :disabled="scale >= zoomRange.max">+</button>
      <button class="zp-btn zp-reset" type="button" @click="fitToView">⟲</button>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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

const canvasSize = {
  w: 4200,
  h: 760
}

const baseNodes = [
  { key: 'n-start', label: '组庭启动', targetId: 1, kind: 'primary', x: 80, y: 340, w: 220, h: 56 },
  { key: 'g-ways', label: '三种方式', kind: 'group', x: 340, y: 346, w: 220, h: 44 },

  { key: 'a-entry', label: '首席+边裁都已选定', targetId: 6, kind: 'primary', x: 620, y: 160, w: 260, h: 56 },
  { key: 'a-dept', label: '部门负责人审批', targetId: 6, kind: 'approve', x: 940, y: 160, w: 240, h: 56 },
  { key: 'a-lead', label: '分管委领导审批', targetId: 6.5, kind: 'approve', x: 1240, y: 160, w: 240, h: 56 },
  { key: 'a-dir', label: '主任最终指定/确认', targetId: 11, kind: 'approve', x: 1540, y: 160, w: 260, h: 56 },

  { key: 'b-entry', label: '当事人委托边裁选择首席', targetId: 2, kind: 'primary', x: 620, y: 340, w: 280, h: 56 },
  { key: 'b-nominate', label: '当事人选择边裁', targetId: 2, kind: 'primary', x: 940, y: 340, w: 220, h: 56 },
  { key: 'g-b-cons', label: '当事人选择边裁是否一致', kind: 'group', x: 1200, y: 346, w: 260, h: 44 },
  { key: 'b-yes', label: '一致', targetId: 7, kind: 'primary', x: 1520, y: 280, w: 180, h: 52 },
  { key: 'b-no', label: '不一致', targetId: 6, kind: 'primary', x: 1520, y: 400, w: 180, h: 52 },

  { key: 'b-review', label: '主任审核', targetId: 7, kind: 'approve', x: 1760, y: 280, w: 200, h: 56 },
  { key: 'b-return', label: '退回', targetId: 2, kind: 'primary', x: 1760, y: 360, w: 200, h: 56 },
  { key: 'b-confirm', label: '确认边裁', targetId: 7, kind: 'approve', x: 2000, y: 280, w: 200, h: 56 },
  { key: 'b-notify', label: '通知边裁限期共同选定首席', targetId: 3, kind: 'primary', x: 2240, y: 280, w: 300, h: 56 },

  { key: 'g-b-chief', label: '边裁选择首席结果是否一致', kind: 'group', x: 2580, y: 286, w: 260, h: 44 },
  { key: 'b-chief-yes', label: '一致', targetId: 11, kind: 'approve', x: 2880, y: 240, w: 180, h: 52 },
  { key: 'b-chief-no', label: '不一致', targetId: 6, kind: 'approve', x: 2880, y: 320, w: 180, h: 52 },
  { key: 'b-chief-final', label: '首席确认', targetId: 11, kind: 'approve', x: 3120, y: 240, w: 200, h: 56 },
  { key: 'b-chief-dept', label: '部门负责人推荐', targetId: 6, kind: 'approve', x: 3120, y: 320, w: 220, h: 56 },
  { key: 'b-chief-lead', label: '分管委领导推荐', targetId: 6.5, kind: 'approve', x: 3380, y: 320, w: 220, h: 56 },
  { key: 'b-chief-dir', label: '主任确认', targetId: 11, kind: 'approve', x: 3640, y: 320, w: 200, h: 56 },

  { key: 'b-side-dept', label: '部门负责人推荐边裁', targetId: 6, kind: 'approve', x: 1760, y: 440, w: 240, h: 56 },
  { key: 'b-side-lead', label: '分管委领导推荐边裁', targetId: 6.5, kind: 'approve', x: 2040, y: 440, w: 240, h: 56 },
  { key: 'b-side-dir', label: '主任确认边裁', targetId: 7, kind: 'approve', x: 2320, y: 440, w: 220, h: 56 },
  { key: 'b-side-notify', label: '通知边裁限期共同选定首席', targetId: 3, kind: 'primary', x: 2580, y: 440, w: 300, h: 56 },

  { key: 'c-entry', label: '当事人选择边裁', targetId: 2, kind: 'primary', x: 620, y: 520, w: 220, h: 56 },
  { key: 'g-c-method', label: '当事人选择首席组成方式', kind: 'group', x: 900, y: 526, w: 260, h: 44 },
  { key: 'c-delegate', label: '委托边裁选定首席', targetId: 2, kind: 'primary', x: 1220, y: 480, w: 240, h: 56 },
  { key: 'c-joint', label: '双方当事人共同选定', targetId: 3, kind: 'primary', x: 1220, y: 552, w: 240, h: 56 },
  { key: 'c-director', label: '委托主任选定/指定', targetId: 7, kind: 'primary', x: 1220, y: 624, w: 240, h: 56 }
]

const nodes = computed(() =>
  baseNodes.map((n) => ({
    ...n,
    roleLabel: n.roleLabel || (n.targetId ? roleLabelByTargetId(n.targetId) : '')
  }))
)

const nodeByKey = computed(() => {
  const map = new Map()
  nodes.value.forEach((n) => map.set(n.key, n))
  return map
})

const edgeDefs = [
  ['n-start', 'g-ways'],
  ['g-ways', 'a-entry'],
  ['g-ways', 'b-entry'],
  ['g-ways', 'c-entry'],

  ['a-entry', 'a-dept'],
  ['a-dept', 'a-lead'],
  ['a-lead', 'a-dir'],

  ['b-entry', 'b-nominate'],
  ['b-nominate', 'g-b-cons'],
  ['g-b-cons', 'b-yes'],
  ['g-b-cons', 'b-no'],

  ['b-yes', 'b-review'],
  ['b-review', 'b-confirm'],
  ['b-review', 'b-return'],
  ['b-confirm', 'b-notify'],

  ['b-notify', 'g-b-chief'],
  ['g-b-chief', 'b-chief-yes'],
  ['g-b-chief', 'b-chief-no'],
  ['b-chief-yes', 'b-chief-final'],
  ['b-chief-no', 'b-chief-dept'],
  ['b-chief-dept', 'b-chief-lead'],
  ['b-chief-lead', 'b-chief-dir'],

  ['b-no', 'b-side-dept'],
  ['b-side-dept', 'b-side-lead'],
  ['b-side-lead', 'b-side-dir'],
  ['b-side-dir', 'b-side-notify'],
  ['b-side-notify', 'g-b-chief'],

  ['c-entry', 'g-c-method'],
  ['g-c-method', 'c-delegate'],
  ['g-c-method', 'c-joint'],
  ['g-c-method', 'c-director']
]

const edges = computed(() => {
  const map = nodeByKey.value
  return edgeDefs
    .map(([fromKey, toKey], idx) => {
      const a = map.get(fromKey)
      const b = map.get(toKey)
      if (!a || !b) return null
      const sx = a.x + a.w
      const sy = a.y + a.h / 2
      const ex = b.x
      const ey = b.y + b.h / 2
      const dx = Math.min(180, Math.max(80, Math.abs(ex - sx) * 0.35))
      const d = `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`
      return {
        key: `e-${idx}-${fromKey}-${toKey}`,
        d,
        variant: 'solid'
      }
    })
    .filter(Boolean)
})

const viewportRef = ref(null)
const contentRef = ref(null)

const scale = ref(1)
const isPanning = ref(false)
const lastPoint = ref({ x: 0, y: 0 })

const zoomRange = {
  min: 0.2,
  max: 1.4
}

const zoomPercent = computed(() => `${Math.round(scale.value * 100)}%`)

const scaledSize = computed(() => ({
  w: Math.round(canvasSize.w * scale.value),
  h: Math.round(canvasSize.h * scale.value)
}))

const scrollSpaceStyle = computed(() => ({
  width: `${scaledSize.value.w}px`,
  height: `${scaledSize.value.h}px`
}))

const contentStyle = computed(() => ({
  width: `${canvasSize.w}px`,
  height: `${canvasSize.h}px`,
  transform: `scale(${scale.value})`
}))

const isInteractiveTarget = (event) => {
  const el = event?.target
  if (!(el instanceof Element)) return false
  return Boolean(el.closest('.bn-card.clickable') || el.closest('.zoom-pill'))
}

const onPointerDown = (event) => {
  if (event.button !== 0) return
  if (isInteractiveTarget(event)) return
  const viewport = viewportRef.value
  if (viewport) {
    const rect = viewport.getBoundingClientRect()
    const inVScrollbar = rect.right - event.clientX < 14
    const inHScrollbar = rect.bottom - event.clientY < 14
    if (inVScrollbar || inHScrollbar) return
  }
  isPanning.value = true
  lastPoint.value = { x: event.clientX, y: event.clientY }
  event.currentTarget?.setPointerCapture?.(event.pointerId)
}

const onPointerMove = (event) => {
  if (!isPanning.value) return
  const dx = event.clientX - lastPoint.value.x
  const dy = event.clientY - lastPoint.value.y
  lastPoint.value = { x: event.clientX, y: event.clientY }
  const viewport = viewportRef.value
  if (!viewport) return
  viewport.scrollLeft -= dx
  viewport.scrollTop -= dy
}

const onPointerUp = () => {
  isPanning.value = false
}

const clampScale = (v) => Math.min(zoomRange.max, Math.max(zoomRange.min, v))

const zoomAt = (nextScale, clientX, clientY) => {
  const viewport = viewportRef.value
  if (!viewport) return
  const rect = viewport.getBoundingClientRect()
  const px = clientX - rect.left
  const py = clientY - rect.top
  const s0 = scale.value
  const s1 = clampScale(nextScale)
  if (s0 === s1) return

  const worldX = (viewport.scrollLeft + px) / s0
  const worldY = (viewport.scrollTop + py) / s0
  scale.value = s1
  requestAnimationFrame(() => {
    viewport.scrollLeft = worldX * s1 - px
    viewport.scrollTop = worldY * s1 - py
  })
}

const onWheel = (event) => {
  const isZoom = event.ctrlKey || event.metaKey
  if (!isZoom) return
  event.preventDefault()
  const delta = -event.deltaY
  const step = delta > 0 ? 0.08 : -0.08
  zoomAt(scale.value + step, event.clientX, event.clientY)
}

const fitToView = () => {
  const viewport = viewportRef.value
  if (!viewport) return
  const rect = viewport.getBoundingClientRect()
  const vw = rect.width
  const vh = rect.height
  const pad = 80

  const items = nodes.value
  if (!items.length) return

  const minX = Math.min(...items.map((n) => n.x))
  const minY = Math.min(...items.map((n) => n.y))
  const maxX = Math.max(...items.map((n) => n.x + n.w))
  const maxY = Math.max(...items.map((n) => n.y + n.h))

  const bw = maxX - minX + pad * 2
  const bh = maxY - minY + pad * 2
  const s = clampScale(Math.min(vw / bw, vh / bh))

  const cx = minX + (maxX - minX) / 2
  const cy = minY + (maxY - minY) / 2
  scale.value = s
  nextTick(() => {
    const nextLeft = cx * s - vw / 2
    const nextTop = cy * s - vh / 2
    viewport.scrollLeft = Math.max(0, Math.min(nextLeft, scaledSize.value.w - vw))
    viewport.scrollTop = Math.max(0, Math.min(nextTop, scaledSize.value.h - vh))
  })
}

const zoomIn = () => {
  const viewport = viewportRef.value
  if (!viewport) return
  const rect = viewport.getBoundingClientRect()
  zoomAt(scale.value + 0.1, rect.left + rect.width / 2, rect.top + rect.height / 2)
}

const zoomOut = () => {
  const viewport = viewportRef.value
  if (!viewport) return
  const rect = viewport.getBoundingClientRect()
  zoomAt(scale.value - 0.1, rect.left + rect.width / 2, rect.top + rect.height / 2)
}

const onNodeClick = (node) => {
  if (!node?.targetId) return
  emit('select', node.targetId)
}

onMounted(() => {
  const viewport = viewportRef.value
  if (!viewport) return
  viewport.addEventListener('wheel', onWheel, { passive: false })
  requestAnimationFrame(() => fitToView())
})

onBeforeUnmount(() => {
  const viewport = viewportRef.value
  if (!viewport) return
  viewport.removeEventListener('wheel', onWheel)
})

watch(
  () => props.timelineNodes,
  () => requestAnimationFrame(() => fitToView()),
  { deep: true }
)
</script>

<style scoped>
.branch-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-radius: 14px;
  border: 1px solid rgba(30, 58, 138, 0.14);
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  cursor: grab;
  scrollbar-gutter: stable both-edges;
  scrollbar-width: thin;
  scrollbar-color: rgba(30, 58, 138, 0.28) rgba(255, 255, 255, 0.35);
}

.branch-canvas.panning {
  cursor: grabbing;
}

.branch-canvas::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

.branch-canvas::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.35);
  border-radius: 999px;
}

.branch-canvas::-webkit-scrollbar-thumb {
  background: rgba(30, 58, 138, 0.22);
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.35);
}

.branch-canvas::-webkit-scrollbar-thumb:hover {
  background: rgba(30, 58, 138, 0.32);
}

.canvas-content {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: 0 0;
}

.scroll-space {
  position: relative;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(circle at 18% 22%, rgba(59, 130, 246, 0.12), transparent 40%),
    radial-gradient(circle at 85% 65%, rgba(180, 83, 9, 0.06), transparent 45%),
    radial-gradient(circle at 35% 85%, rgba(59, 130, 246, 0.08), transparent 50%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0.2));
}

.scroll-space::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(30, 58, 138, 0.12) 0.8px, transparent 0.8px);
  background-size: 20px 20px;
  opacity: 0.08;
}

.canvas-edges {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
}

.edge-path {
  fill: none;
  stroke: rgba(30, 58, 138, 0.3);
  stroke-width: 1.2;
}

.edge-path.solid {
  stroke-dasharray: none;
}

.bn-card {
  position: absolute;
  border-radius: 16px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(30, 58, 138, 0.14);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.bn-card.primary {
  background: linear-gradient(135deg, rgba(219, 234, 254, 0.86), rgba(255, 255, 255, 0.68));
}

.bn-card.approve {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.76), rgba(255, 255, 255, 0.56));
}

.bn-card.approve::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 3px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(180, 83, 9, 0.9), rgba(245, 158, 11, 0.35));
  opacity: 0.8;
}

.bn-card.group {
  border-radius: 999px;
  background: rgba(241, 245, 249, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.28);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
}

.bn-card.group .bn-title {
  font-weight: 600;
  color: rgba(15, 23, 42, 0.66);
}

.bn-card.clickable:hover {
  transform: translateY(-2px);
  border-color: rgba(30, 58, 138, 0.28);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.12);
}

.bn-card.active {
  border-color: rgba(59, 130, 246, 0.7);
  box-shadow: 0 18px 38px rgba(59, 130, 246, 0.18);
}

.bn-title {
  font-size: 13px;
  line-height: 1.2;
  font-weight: 700;
  color: rgba(15, 23, 42, 0.88);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bn-role {
  border-radius: 999px;
  flex-shrink: 0;
}

.zoom-pill {
  position: absolute;
  right: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(30, 58, 138, 0.16);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
  z-index: 3;
  pointer-events: auto;
}

.zp-btn,
.zp-mid {
  height: 32px;
  border-radius: 999px;
  border: 1px solid rgba(30, 58, 138, 0.16);
  background: rgba(255, 255, 255, 0.65);
  color: rgba(15, 23, 42, 0.82);
  font-weight: 700;
  padding: 0 10px;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
}

.zp-btn {
  width: 34px;
  padding: 0;
}

.zp-mid {
  min-width: 70px;
}

.zp-btn:hover,
.zp-mid:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(30, 58, 138, 0.28);
  transform: translateY(-1px);
}

.zp-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.zp-reset {
  width: 40px;
}
</style>
